
import React, { useEffect, useReducer, useState } from 'react';
import {  Divider, InputLabel, makeStyles, MenuItem, TextField, Select, FormControl, ListItemIcon,  ListItemText, IconButton } from '@material-ui/core';
import Icon from '@mdi/react'
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import { selectLocationLookups, selectLocations } from '../../App/store/UserManagement/um-selectors';
import { CD_PRODUCT_ID, EFF_PRODUCT_ID, EMM_PRODUCT_ID, MAX_DESCRIPTION, MAX_INPUT, SSC_PRODUCT_ID, UM_PRODUCT_ID } from '../../../constants';
import { createClient, deleteClient, generateProductUpdateBody,  isWithinScope, patchRoles, resetClient, updateClientProfile } from '../../AdminPanel/helpers';
import { makeSelectLogger, makeSelectToken } from '../../App/selectors';
import { mdiPlaylistEdit, mdiContentCopy } from '@mdi/js';
import { GenericModal, ProfileIcon, SaveAndCancel, StyledCheckbox } from '../../../components/SharedComponents/SharedComponents';
import { setSnackbar } from '../../App/actions';
import { setClients } from '../../App/store/ApiManagement/am-actions';
import { selectClients, selectApiAssignableRoles } from '../../App/store/ApiManagement/am-selectors';
import { getRoleMapping } from '../SSTUsers/helpers';

export const ClipboardField = props => {
    const classes = useStyles();
    const { value, warning, title, className, id, isView, size } = props;
    const dispatch = useDispatch();
    const copyToClipboard = () => {
        navigator?.clipboard?.writeText?.(value);
        document.getElementById(id ?? 'clipboard-field')?.select?.()
        dispatch(setSnackbar({ severity: 'success', message: `Copied to clipboard.` }))
    }
    if (isView) {
        return (
            <div className={className}>
                {`${title}: ${value}`}
                <IconButton
                    onClick={() => copyToClipboard()}
                    title="copy"
                >
                    <Icon
                        color="#828282" path={mdiContentCopy} size={size ?? '18px'} />
                </IconButton>
            </div>
        )
    }

    return (
        <div className={className}>
            <InputLabel className={classes.inputLabel}>{title}</InputLabel>
            <span className='flex'>
                <TextField
                    size="small"
                    fullWidth
                    id={id ?? 'clipboard-field'}
                    value={value}
                    variant="outlined"
                    disabled
                    onClick={() => copyToClipboard()}
                    helperText={warning && <span style={{ marginLeft: -14, color: '#004F6E' }}>{warning}</span>}
                />
                <div >
                    <SaveAndCancel
                        className={"delete-user-buttons"}
                        handleSubmit={copyToClipboard}
                        submitText={'Copy'}
                    />
                </div>
            </span>
        </div>
    )
}

export const ClientSuccessModal = props => {
    const { clientName, clientSecret, clientId, tableData } = props || {};
    return (
        <GenericModal
            {...props}
            className="client-success"
        >
            <>
                <div className="header header-2">
                    API User Added
                </div>
                <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
                <div className="contents subtext">
                    <p>{clientName} has been added.</p>
                </div>
                <ClipboardField
                    className="copy-field subtext contents"
                    title={"Client ID"}
                    id="clientId-field"
                    value={clientId}
                    isView
                    size={'20px'}
                />
                <ClipboardField
                    title={"Client Secret"}
                    id="clientSecret-field"
                    warning="The Client Secret will only be displayed now."
                    value={clientSecret}
                />
            </>
        </GenericModal>
    )
}

export const DeleteUserModal = props => {
    const { clientName, clientId, tableData } = props?.user || {};
    const userTable = useSelector(selectClients());
    const userToken = useSelector(makeSelectToken());
    const dispatch = useDispatch();
    const { toggleModal } = props;
    const [isLoading, setIsLoading] = useState(false);

    const fetchDelete = async () => {
        setIsLoading(true)
        const response = await deleteClient({ clientId, scope: 0 }, userToken);

        setIsLoading(false);
        if (response == 'error'){
            dispatch(setSnackbar({ severity: 'error', message: `${clientName} failed to deleted.` }))
            return 
        }
        const modified = [...userTable];
        const id = modified.findIndex((u) => u.clientId == clientId);
        if (id >= 0) {
            modified.splice(id, 1);
        }
        dispatch(setSnackbar({ severity: 'success', message: `${clientName} was deleted.` }))
        dispatch(setClients(modified))
        toggleModal(false);
    }
    return (
        <GenericModal
            {...props}
            className="user-delete"
        >
            <>
                <div className="header header-2">
                    Delete API User
                </div>
                <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
                <div className="contents subtext">
                    <p>Are you sure you want to delete {clientName}?</p>
                    <p>Deleted API user will not have any access to Insights.</p>
                </div>
                <div className="close">
                    <SaveAndCancel
                        className={"delete-user-buttons"}
                        handleSubmit={() => fetchDelete()}
                        submitText={'Delete'}
                        disabled={isLoading}
                        isLoading={isLoading}
                        cancelText={"Cancel"}
                        handleCancel={() => toggleModal(false)}
                    />
                </div>

            </>
        </GenericModal>
    )
}
const SCOPE_MAP = ['unrestricted', 'h', 'f', 'd', 'r'];
const defaultViewState = {
    viewProfile: true,
    viewAdminAccess: true,
    [CD_PRODUCT_ID]: true,
    [EMM_PRODUCT_ID]: true,
    [SSC_PRODUCT_ID]: true,
    [EFF_PRODUCT_ID]: true,
    [UM_PRODUCT_ID]: true
};
const userReducer = (state, event) => {
    if (event.name == 'new-user') {
        //Reseting the state for Add users
        return event.value;
    } else if (event.name == 'save-settings') {
        //Saving clears the backup (which existed for 'cancel')
        event.name = 'viewState';
        event.value = defaultViewState

        state.backup = null;
    } else if (event.name == 'save-cancel') {
        //Revert to previous state on cancel
        return {
            ...state.backup,
            backup: null
        }
    } else if (event.name == 'view') {
        const { id, value } = event.value;
        event.name = 'viewState'
        event.value = {
            ...state.viewState,
            [id]: value
        }
        //Back up the current state for if the user cancels
        state.backup = JSON.parse(JSON.stringify(state));
    } else if (event.name == 'roles') {
        const roles = state?.roles || {};
        const { current, id, value, productId } = event.value;
        //Delete current role in lists - If we select viewer we want to remove Admin
        if (current) {
            for (var r of current) {
                delete roles[r]
            }
        }
        roles[id] = value;
        //Clear errors for Access Level
        if (productId && state.errorState?.[productId]) {
            state.errorState[productId] = null;
        }

        event.name = 'roles';
        event.value = roles
    } else if (event.name == 'location-roles') {
        const { roleId, locations, locationLookups, productId } = event.value;
        //We're under the assumption that roles is alredy in the state if you're modifying location
        state.roles = state.roles || {}
        state.roles[roleId] = state.roles[roleId] || {}
        //Build the new locations object seperating between h,f,d,r
        state.roles[roleId].scope = {}
        for (var locationId of locations) {
            const { scopeId } = locationLookups?.[locationId];
            state.roles[roleId].scope[SCOPE_MAP[scopeId]] = state.roles[roleId].scope[SCOPE_MAP[scopeId]] || [];
            state.roles[roleId].scope[SCOPE_MAP[scopeId]].push(locationId)
        }

        event.name = 'roles'
        event.value = state.roles;
    } else {
        //Validate by default 
        const errorState = state?.errorState || {};
        //If manual validate (on blur) vs if ttheyre updating the field directly
        const { id, value } = event.name == 'validate' ? event.value : { id: event.name, value: event.value };
        const isValidateAll = id == 'all';

        if (id == 'clientName' || isValidateAll) {
            errorState['clientName'] = (value ?? state?.clientName) ? null : '​Please enter a API user';
        }

        state.errorState = errorState;
    }


    return {
        ...state,
        [event.name]: event.value
    }
}

// Used for Text fields
const useStyles = makeStyles((theme) => ({
    inputLabel: {
        fontFamily: 'Noto Sans',
        fontSize: '14px',
        lineHeight: '19px',
        marginBottom: 4,
        color: '#000000',
        opacity: .8,
    }
}));


export const AddEditUserModal = props => {
    const dispatch = useDispatch();
    const { user } = props;
    const isAddUser = !Boolean(user?.clientId);
    //if we're adding a new user we edit all sections at once
    const viewObject = isAddUser ? null : defaultViewState;
    const locationLookups = useSelector(selectLocationLookups());
    const [userData, setUserData] = useReducer(userReducer, { ...user, viewState: viewObject, locationLookups });

    const userToken = useSelector(makeSelectToken());
    const assignableRoles = useSelector(selectApiAssignableRoles());
    const logger = useSelector(makeSelectLogger());

    const { viewProfile, ...viewPermissions } = userData?.viewState || {};

    const isView = Object.values(userData?.viewState || {}).every((v) => v) && userData?.viewState;

    const [isLoading, setIsLoading] = useState(false);

    const isSingleEdit = Object.values(userData?.viewState || {}).filter(t => !t).length == 1;
    const { errorState } = userData;
    const isSubmitable = !Object.values(errorState || {}).some((d) => d) && (
        userData?.['clientName']
    );

    //Reload the state every time user changes
    useEffect(() => {
        handleChange('new-user', { ...user, viewState: viewObject, locationLookups });
    }, [user])

    const handleChange = (name, value) => {

        setUserData({
            name, value, isSingleEdit
        })
        !['validate', 'new-user', 'errorState'].includes(name) && logger?.manualAddLog('onchange', name, value)
    }
    const createUserError = (result) => {
        setIsLoading(false);
        handleChange('view', { id: 'viewProfile', value: false });
        errorState['email'] = result?.detail
        handleChange('errorState', errorState);
        dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. User could not be created.` }));
    }


    const handleSubmit = (event) => {
        if (event == 'save-settings') {
            handleChange('save-settings');
        } else if (event == 'add-user') {

            //Post call to add user
            setIsLoading(true);
            const createUserSuccess = (client) => {
                const { clientId, clientSecret } = client || {};
                const { clientName } = userData;

                updateTable(clientId);
                toggleModal(false);
                setIsLoading(false);

                props.setClientSecret?.({ clientName, clientSecret, clientId });

            }

            createClient(userData, createUserSuccess, createUserError, userToken, assignableRoles, 0);
        }
    }

    const userTable = useSelector(selectClients());
    
    const updateTable = (clientId) => {
        const { tableData, clientName, description, roles } = userData || {};
        const modified = [...userTable];
        const updatedUser = {
            clientId,
            clientName, description,
            sstDisplayRoles: getRoleMapping(roles, Object.values(assignableRoles)),
            roles
        };
        const id = modified.findIndex((u) => u.clientId == clientId);
        if (id >= 0) {
            modified[id] = { ...modified[id], ...updatedUser };
        } else {
            modified.push({ ...updatedUser, tableData: { id: modified.length } })
        }
        // console.log(modified);
        dispatch(setClients(modified))
    }

    const handleRoleSubmit = async () => {
        const { clientId, roles, clientName } = userData;
        handleChange('save-settings');
        const productUpdates = generateProductUpdateBody(roles, assignableRoles);
        const profile = await patchRoles({ userId: clientId, scope: 0, productUpdates }, userToken).then((e) => {
            if (e == 'error') {
                dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. Could not update API user.` }))
            } else {
                dispatch(setSnackbar({ severity: 'success', message: `${clientName} was updated.` }))
                updateTable(clientId);
            }
        })
    }

    const handleProfileSubmit = async () => {
        const { clientId, clientName, description } = userData;
        handleChange('save-settings');
        const profile = await updateClientProfile({ clientId, clientName, description }, userToken).then((e) => {
            if (e == 'error') {
                dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. Could not update API user.` }))
            } else {
                dispatch(setSnackbar({ severity: 'success', message: `${clientName} was updated.` }))
                updateTable(clientId);
            }
        })
    }

    const toggleModal = () => {
        props?.toggleModal?.();
        setIsLoading(false);
    }

    return (
        <GenericModal
            {...props}
            toggleModal={toggleModal}
            className={`add-edit-user sstadmin client ${!isAddUser && 'is-edit-client'} ${isSingleEdit && 'single-edit'} `}
        >
            <>
                <ProfileSection {...userData} isView={viewProfile} isSingleEdit={isSingleEdit} handleChange={handleChange} handleSubmit={handleProfileSubmit} />
                <PermissionSection {...userData} isAddUser={isAddUser} isSubmitable={isSubmitable} viewState={viewPermissions} isSingleEdit={isSingleEdit} handleChange={handleChange} handleSubmit={handleRoleSubmit} />
                {isAddUser && (
                    <SaveAndCancel
                        className={"add-user-buttons"}
                        disabled={isLoading}
                        handleSubmit={() => !isSubmitable ? handleChange('validate', { id: 'all' }) : handleSubmit(isView ? 'add-user' : 'save-settings')}
                        submitText={(isView ? 'Add API User' : 'Save')}
                        isLoading={isLoading}
                        cancelText={"Cancel"}
                        handleCancel={() => toggleModal(false)}
                    />
                )}
            </>
        </GenericModal>
    )
}

const PermissionSection = props => {
    const { viewState, isSingleEdit, handleChange, isSubmitable, handleSubmit, isAddUser } = props;
    const isEdit = Object.values(viewState || {}).some((v) => !v) && Object.keys(viewState).length > 0;
    const assignableRoles = useSelector(selectApiAssignableRoles());
    const orderedMap = Object.entries(assignableRoles).sort((a, b) => a[1]?.productName?.localeCompare?.(b[1]?.productName));
    return (
        <div className={`permissions-section `}>
            <div className="subtle-subtext title">Permissions</div>
            <Divider className="divider" />
            <div className="permissions-header subtext">
                <span>Products</span>
                <span>Role</span>
                <span>Access Level</span>
            </div>
            <Divider className="divider" />
            {orderedMap.map(([productId, product]) => (
                <ProductPermissions
                    {...product}
                    productId={productId}
                    {...props}
                    isView={viewState?.[productId]}
                />
            ))}
            {isSingleEdit && isEdit && (
                <SaveAndCancel
                    className={"add-permissions-buttons"}
                    handleSubmit={() => isAddUser ? handleChange('save-settings') : handleSubmit()}
                    disabled={!isSubmitable}
                    submitText={'Save'}
                    isLoading={false}
                    cancelText={"Cancel"}
                    handleCancel={() => handleChange('save-cancel')}
                />
            )}
        </div>
    )
}
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 40 * 4.5 + 0,
            width: 230
        }
    },
    getContentAnchorEl: null,
    anchorOrigin: {
        vertical: "bottom",
        horizontal: "center"
    },
    transformOrigin: {
        vertical: "top",
        horizontal: "center"
    },
    variant: "menu"
};

const ProductPermissions = props => {
    const { productName, isSubscribed} = props;
    const assignableProductRoles = props.productRoles || {};

    if (!isSubscribed) {
        return ''
    }
    const orderedMap = Object.entries(assignableProductRoles).sort((a, b) => a[1]?.displayName?.localeCompare?.(b[1]?.displayName));
    return (
        <>
            {orderedMap.map(([roleId, role], i) => {
                return (
                    <div className='product-permission'>
                        <span>{i == 0 ? productName : ''}</span>
                        <RolePermissions {...props} roleId={roleId} role={role} />
                    </div>
                )
            })}
            <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
        </>
    )
}

const RolePermissions = props => {
    const { productName, productId, roles, roleId, isSubscribed, errorState, role } = props;

    const { isView, handleChange } = props;
    const locations = useSelector(selectLocations());
    const locationLookups = useSelector(selectLocationLookups());
    const { minScope, maxScope } = props?.productRoles?.[roleId] || {};
    const scope = roles?.[roleId]?.scope
    const isUnrestricted = scope && Object.keys(scope).length != 0 && Object.values(scope).every((v) => v.length == 0);
    const userScope = isUnrestricted ? {unrestricted:['unrestricted']} : (scope ?? {});
    //get a flat list of all locations
    const userLocations = Object.entries(userScope).map(([k, loc]) => loc).flat();
    const [selectedLocations, setLocations] = useState(userLocations);
    const getAccessLevelOptions = (minScope, maxScope, currentLocations) => {
        const currLoc = currentLocations || selectedLocations;
        const accessOptions = minScope == 0 ? ['unrestricted'] : []
        const hospitals = Object.entries(locations)?.sort((a, b) => a[1]?.name?.localeCompare?.(b[1]?.name))
        if (currLoc.includes('unrestricted')) {
            return accessOptions
        }
        for (const [hId, h] of hospitals) {

            isWithinScope(1, minScope, maxScope) && accessOptions.push(hId);
            if (currLoc.includes(hId)) {
                continue;
            }
            const facilities = Object.entries(h?.facilities)?.sort((a, b) => a[1]?.name?.localeCompare?.(b[1]?.name));
            for (const [fId, f] of facilities) {
                isWithinScope(2, minScope, maxScope) && accessOptions.push(fId);
                if (currLoc.includes(fId)) {
                    continue;
                }
                const departments = Object.entries(f?.departments);
                for (const [dId, d] of departments) {
                    // We dont show departments if theres only 1
                    isWithinScope(3, minScope, maxScope) && departments.length > 1 && accessOptions.push(dId);
                    if (currLoc.includes(dId)) {
                        continue;
                    }
                    const rooms = Object.entries(d?.rooms)
                    for (const [rId, r] of rooms) {
                        isWithinScope(4, minScope, maxScope) && accessOptions.push(rId);
                    }
                }
            }
        }
        return accessOptions
    };

    const [accessLevelOptions, setAccessLevelOptions] = useState(getAccessLevelOptions(minScope, maxScope));

    const handleLocationChange = e => {
        var newLocations = e.target.value;
        const accessLevelOptions = getAccessLevelOptions(minScope, maxScope, newLocations);
        newLocations = newLocations.filter((l) => accessLevelOptions.includes(l))
        setLocations(newLocations);
        setAccessLevelOptions(accessLevelOptions);
        //Save in state for BE
        handleChange('location-roles', { roleId, locations: newLocations, locationLookups, productId });
    }

    if (!isSubscribed) {
        return ''
    }
    const accessLevelDisplay = userLocations.map(l => locationLookups?.[l]?.name).join(", ") || "None";
    if (isView) {
        return (
            <>
                <span>
                    {role?.displayName}
                </span>
                <span className="flex space-between" >
                    <span title={accessLevelDisplay} className='access-level'>{accessLevelDisplay}</span>
                    <span className={`action-icon pointer edit-permissions-icon`} title={`Edit ${productName?.replace(/^[^a-z]+|[^\w:.-]+/gi, "")}`} >
                        <Icon className={`edit`} color="#828282" path={mdiPlaylistEdit} size={'24px'}
                            onClick={() => {
                                handleChange('view', { id: productId, value: false });
                                //When cancelling and re-editing we have to reset the location state to current user locations and options
                                setLocations(userLocations);
                                const accessLevelOptions = getAccessLevelOptions(minScope, maxScope, userLocations)
                                setAccessLevelOptions(accessLevelOptions)
                            }}
                        />
                    </span>
                </span>
            </>
        )
    }

    return (
        <>
            <span>
                {role?.displayName}
            </span>
            <span>
                <FormControl
                    className="access-level-select"
                    title={accessLevelDisplay}
                    variant='outlined' size='small' fullWidth>
                    <Select
                        MenuProps={MenuProps}
                        displayEmpty
                        id={productId}
                        className={`${productName?.replace(/^[^a-z]+|[^\w:.-]+/gi, "")} ${productId}`}
                        value={selectedLocations}
                        // disabled={!accessLevelOptions?.length || (productId != EMM_PRODUCT_ID)}
                        multiple
                        displayEmpty
                        renderValue={(userLocations) => userLocations?.map(l => locationLookups?.[l]?.name).join(", ") || 'None'}
                        onChange={handleLocationChange}
                    >
                        {accessLevelOptions.map((locationId) => {
                            const location = locationLookups?.[locationId] || {};
                            const { name, scopeId } = location;
                            return (
                                <MenuItem key={locationId} value={locationId} style={{ padding: "4px 14px 4px 0" }}>
                                    <ListItemIcon style={{ minWidth: 30, marginLeft: (scopeId + 1) * 12 }}>
                                        <StyledCheckbox
                                            style={{ padding: 0 }}
                                            disabled
                                            className="SST-Checkbox"
                                            checked={selectedLocations.includes(locationId)}
                                        />
                                    </ListItemIcon>
                                    <ListItemText disableTypography title={name} primary={name} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />

                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </span>
        </>
    )
}

const ConfirmReset = props => {
    const dispatch = useDispatch();
    const { clientName, clientId } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState(false)
    const userToken = useSelector(makeSelectToken());
    const scope = 0;
    const handleReset = async () => {
        setIsLoading(true);
        const secret = await resetClient({ clientId, scope }, userToken)

        if (secret == 'error') {
            dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. Could not update API user.` }))
            setIsLoading(false);
            return
        }

        setClientSecret(secret?.clientSecret);
        setIsLoading(false);
        // toggleModal(false);
        dispatch(setSnackbar({ severity: 'success', message: `${clientName}'s secret was reset.` }))
    }
    const toggleModal = (open) => {
        props.toggleModal?.(open);
        setClientSecret(false);
    }
    var content = null;
    if (clientSecret) {
        content = (
            <>
                <div className="contents subtle-subtext">
                    <p>{clientName} has been reset.</p>
                </div>
                <ClipboardField
                    warning="The Client Secret will only be displayed now."
                    title={"Client Secret"}
                    className="subtle-subtext"
                    value={clientSecret}
                />
            </>
        )
    } else {
        content = (
            <>
                <div className="contents subtext">
                    <p>Are you sure you want to reset the Client Secret of {clientName}?</p>
                    <p>Resetting the client secret will invalidate the current secret, and leave {clientName} unable to authenticate until its credentials are updated.</p>
                </div>
                <div className="close">
                    <SaveAndCancel
                        className={"delete-user-buttons"}
                        handleSubmit={() => handleReset()}
                        submitText={'Confirm'}
                        disabled={isLoading}
                        isLoading={isLoading}
                        cancelText={"Cancel"}
                        handleCancel={() => toggleModal(false)}
                    />
                </div>
            </>
        )
    }
    return (
        <GenericModal
            {...props}
            toggleModal={toggleModal}
            className="secret-reset">
            <>
                <div className="header header-2">
                    Reset Client Secret
                </div>
                <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
                {content}

            </>
        </GenericModal>
    )
}

const ProfileSection = props => {
    const { handleChange, isView, errorState, isSingleEdit, handleSubmit } = props;
    const { clientName, description, datetimeJoined, clientId } = props;
    const classes = useStyles();
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    if (isView) {
        return (
            <div className="view-profile client">
                <div className="client-info">
                    <div>
                        <ProfileIcon className="header-1 api-icon" size={95} override={"API"} />

                    </div>
                    <div className="profile-info">
                        <div className="header-2" title={clientName}>{clientName}</div>
                        {clientId && <ClipboardField
                            className="copy-field subtle-subtext"
                            title={"Client ID"}
                            id="clientId-field"
                            value={clientId}
                            isView
                        />}
                        {clientId && <div className="subtle-text">{`Created on ${moment(datetimeJoined).format('MMMM DD, YYYY')}`}</div>}
                        {clientId && (
                            <a className="link reset-account subtle-text" onClick={() => setShowConfirmReset(true)}>
                                Reset Client Secret
                            </a>
                        )}
                    </div>
                    <span className={`action-icon pointer edit-profile-icon`} title={'Edit Profile'} onClick={() => handleChange('view', { id: 'viewProfile', value: false })}>
                        <Icon className={`edit`} color="#828282" path={mdiPlaylistEdit} size={'24px'} />
                    </span>
                </div>

                <div className="subtle-text description">{description}</div>
                <ConfirmReset
                    open={showConfirmReset}
                    toggleModal={setShowConfirmReset}
                    clientName={clientName}
                    clientId={clientId}
                />
            </div>
        )
    }
    return (
        <div className="edit-profile">
            <InputLabel className={classes.inputLabel}>API User</InputLabel>
            <TextField
                size="small"
                fullWidth
                id={`edit-clientName`}
                value={props?.['clientName']}
                onChange={(e, v) => handleChange('clientName', e.target.value)}
                onBlur={(e) => handleChange('validate', { id: 'clientName' })}
                variant="outlined"
                error={Boolean(errorState?.['clientName'])}
                inputProps={{ maxLength: MAX_INPUT }}
                helperText={<span style={{ marginLeft: -14 }}>{errorState?.['clientName']}</span>}
            />
            <InputLabel className={classes.inputLabel}>Description</InputLabel>
            <TextField
                size="small"
                fullWidth
                id={`edit-description`}
                value={props?.['description']}
                onChange={(e, v) => handleChange('description', e.target.value)}
                onBlur={(e) => handleChange('validate', { id: 'description' })}
                variant="outlined"
                multiline
                rows={5}
                inputProps={{ maxLength: MAX_DESCRIPTION }}
                helperText={<span style={{ marginRight: -14, float: 'right' }}>{props?.['description']?.length ?? 0}</span>}
            />
            {isSingleEdit && <SaveAndCancel
                className={"save-profile"}
                disabled={errorState?.['clientName']}
                handleSubmit={() => clientId ? handleSubmit() : handleChange('save-settings')}
                submitText={'Save'}
                isLoading={false}
                cancelText={"Cancel"}
                handleCancel={() => handleChange('save-cancel')}
            />}
        </div>

    )
}

