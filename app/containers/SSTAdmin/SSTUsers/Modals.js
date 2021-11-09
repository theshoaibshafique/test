
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Divider, Grid, InputLabel, makeStyles, MenuItem, Modal, TextField, Select, FormControl, ListItemIcon, Checkbox, ListItemText, FormHelperText } from '@material-ui/core';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react'
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import { selectAssignableRoles, selectLocationLookups, selectLocations, selectUsers } from '../../App/store/UserManagement/um-selectors';
import { CD_PRODUCT_ID, EFF_PRODUCT_ID, EMM_PRODUCT_ID, SSC_PRODUCT_ID, UM_PRODUCT_ID } from '../../../constants';
import { getRoleMapping } from './helpers';
import { makeSelectLogger, makeSelectProductRoles, makeSelectToken, makeSelectUserFacility } from '../../App/selectors';
import { mdiPlaylistEdit, mdiCheckboxBlankOutline, mdiCheckboxOutline } from '@mdi/js';
import globalFunctions from '../../../utils/global-functions';
import { setUsers } from '../../App/store/UserManagement/um-actions';
import { LEARNMORE_DESC, LEARNMORE_HEADER, LEARNMORE_INFO } from './constants';
import { ProfileIcon, SaveAndCancel, StyledTab, StyledTabs, TabPanel } from '../../../components/SharedComponents/SharedComponents';
import { setSnackbar } from '../../App/actions';
import { resetUser, createUser, deleteUser, generateProductUpdateBody, isWithinScope, patchRoles } from '../../AdminPanel/helpers';
/* 
    Generic Modal thats empty with an X in the corner
*/
const GenericModal = props => {
    const { children, toggleModal, className, open } = props;
    return (
        <Modal
            open={open}
            onClose={() => toggleModal(false)}
        >
            <div className={`Modal generic-modal ${className}`}>
                <div className="close-button" >
                    <Icon className={`pointer`} onClick={() => toggleModal(false)} color="#000000" path={mdiClose} size={'19px'} />
                </div>
                {children}
            </div>


        </Modal>
    )
}

export const UMLearnMore = props => {
    const [tabIndex, setTabIndex] = useState(0);
    const logger = useSelector(makeSelectLogger());
    const locationLookups = useSelector(selectLocationLookups());
    const facilityId = useSelector(makeSelectUserFacility())
    const facilityName = locationLookups?.[facilityId]?.name;
    const orderedInfo = Object.entries(LEARNMORE_INFO).sort((a, b) => a[1].order - b[1].order);
    const handleTabChange = (obj, tabIndex) => {
        setTabIndex(tabIndex);
        logger?.manualAddLog('click', `change-tab-${orderedInfo[tabIndex][0]}`, orderedInfo[tabIndex][0]);
    }
    const facilityMark = "<facility>";
    return (
        <GenericModal
            {...props}
            className="user-management-learn-more"
        >
            <>
                <div className="header header-2">{LEARNMORE_HEADER}</div>
                <p className="description subtext">{LEARNMORE_DESC?.replaceAll(facilityMark, facilityName)}</p>
                <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
                <StyledTabs
                    value={tabIndex}
                    onChange={(obj, value) => handleTabChange(obj, value)}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {orderedInfo.map(([title, v]) => (
                        <StyledTab label={title} />
                    ))}
                </StyledTabs>
                <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
                {orderedInfo.map(([title, values], index) => (
                    <TabPanel value={tabIndex} index={index}>
                        <div className="learn-more-content">
                            {Object.entries(values.content).map(([title, text]) => (
                                <div>
                                    <span className={`role-cell subtle-subtext ${title}`}>{title}</span>
                                    <span className="content">{text?.replaceAll(facilityMark, facilityName)}</span>
                                </div>
                            ))}
                        </div>
                    </TabPanel>
                ))}
            </>

        </GenericModal>
    )
}


export const DeleteUserModal = props => {
    const { firstName, lastName, userId, tableData } = props?.user || {};
    const userTable = useSelector(selectUsers());
    const userToken = useSelector(makeSelectToken());
    const dispatch = useDispatch();
    const { toggleModal } = props;
    const [isLoading, setIsLoading] = useState(false);

    const fetchDelete = async () => {
        setIsLoading(true)
        const response = await deleteUser({ userId, scope: 0 }, userToken);
        const modified = [...userTable];
        const id = modified.findIndex((u) => u.userId == userId);
        if (id >= 0) {
            modified.splice(id, 1);
        }
        dispatch(setSnackbar({ severity: 'success', message: `${firstName} ${lastName} was deleted.` }))
        dispatch(setUsers(modified))
        toggleModal(false);
        setIsLoading(false);
    }
    return (
        <GenericModal
            {...props}
            className="user-delete"
        >
            <>
                <div className="header header-2">
                    Delete User
                </div>
                <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
                <div className="contents subtext">
                    <p>Are you sure you want to delete {firstName} {lastName}?</p>
                    <p>Deleted user will not have any access to Insights.</p>
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
        if (id == 'email' || isValidateAll) {
            errorState['email'] = globalFunctions.validEmail(value ?? state?.email) ? null : '​Please enter a valid email address';
        }
        if (id == 'firstName' || isValidateAll) {
            errorState['firstName'] = (value ?? state?.firstName) ? null : '​Please enter a first name';
        }
        if (id == 'lastName' || isValidateAll) {
            errorState['lastName'] = (value ?? state?.lastName) ? null : '​Please enter a last name';
        }
        if (id == 'title' || isValidateAll) {
            errorState['title'] = (value ?? state?.title) ? null : '​Please enter a title';
        }
        if (defaultViewState?.hasOwnProperty(id)) {
            errorState[id] = (value?.length > 0) ? null : 'Please select an access level';
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
        color: '#323232',
        opacity: .8,
    }
}));





export const AddEditUserModal = props => {
    const dispatch = useDispatch();
    const { user } = props;
    const isAddUser = !Boolean(user?.userId);
    //if we're adding a new user we edit all sections at once
    const viewObject = isAddUser ? null : defaultViewState;

    const [userData, setUserData] = useReducer(userReducer, { ...user, viewState: viewObject });

    const userToken = useSelector(makeSelectToken());
    const assignableRoles = useSelector(selectAssignableRoles());

    const { viewProfile, viewAdminAccess, ...viewPermissions } = userData?.viewState || {};

    const isView = Object.values(userData?.viewState || {}).every((v) => v) && userData?.viewState;

    const [isLoading, setIsLoading] = useState(false);
    const [isUserAdded, setIsAdded] = useState(false);

    const isSingleEdit = Object.values(userData?.viewState || {}).filter(t => !t).length == 1;
    const { errorState } = userData;
    const isSubmitable = !Object.values(errorState || {}).some((d) => d) && (
        userData?.['firstName'] && userData?.['lastName'] && userData?.['email'] && (userData?.['title'] || !isAddUser)
    );

    //Reload the state every time user changes
    useEffect(() => {
        handleChange('new-user', { ...user, viewState: viewObject });
    }, [user])

    const handleChange = (name, value) => {
        setUserData({
            name, value, isSingleEdit
        })
    }

    const handleSubmit = (event) => {
        if (event == 'save-settings') {
            handleChange('save-settings');
        } else if (event == 'add-user') {
            //Post call to add user
            setIsLoading(true);
            const createUserSuccess = (userId) => {
                const { firstName, lastName } = userData;
                dispatch(setSnackbar({ severity: 'success', message: `${firstName} ${lastName} was added.` }));

                updateTable(userId);
                toggleModal(false);
                setIsLoading(false);

            }
            const createUserError = (result) => {
                setIsLoading(false);
                handleChange('view', { id: 'viewProfile', value: false });
                errorState['email'] = result?.detail
                handleChange('errorState', errorState);
                dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. User could not be created.` }));

            }
            createUser(userData, createUserSuccess, createUserError, userToken, assignableRoles, 0);
        }
    }

    const userTable = useSelector(selectUsers());
    
    const updateTable = (userId) => {
        const { tableData, firstName, lastName, title, roles, email } = userData || {};
        const modified = [...userTable];
        const updatedUser = {
            userId,
            firstName, lastName, title, email,
            sstDisplayRoles: getRoleMapping(roles, Object.values(assignableRoles)),
            name: `${firstName} ${lastName}`,
            roles
        };
        const id = modified.findIndex((u) => u.userId == userId);
        if (id >= 0) {
            modified[id] = { ...modified[id], ...updatedUser };
        } else {
            modified.push({ ...updatedUser, tableData: { id: modified.length } })
        }
        dispatch(setUsers(modified))
    }

    const handleRoleSubmit = async () => {
        const { userId, roles, firstName, lastName } = userData;
        handleChange('save-settings');
        const productUpdates = generateProductUpdateBody(roles, assignableRoles);
        const profile = await patchRoles({ userId, scope: 0, productUpdates }, userToken).then((e) => {
            if (e == 'error'){
                dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. Could not update user.` }))
            } else {
                dispatch(setSnackbar({ severity: 'success', message: `${firstName} ${lastName} was updated.` }))
                updateTable(userId);
            }
        });
        
        
    }

    const toggleModal = () => {
        props?.toggleModal?.();
        setIsAdded(false);
        setIsLoading(false);
        
    }

    return (
        <GenericModal
            {...props}
            toggleModal={toggleModal}
            className={`add-edit-user sstadmin ${!isAddUser && 'is-edit-user'} ${isSingleEdit && 'single-edit'} ${isUserAdded && 'user-added'}`}
        >
            <>
                <ProfileSection {...userData} isView={viewProfile} isSingleEdit={isSingleEdit} handleChange={handleChange} />
                <PermissionSection {...userData} isAddUser={isAddUser} isSubmitable={isSubmitable} viewState={viewPermissions} isSingleEdit={isSingleEdit} handleChange={handleChange} handleSubmit={handleRoleSubmit} />
                {isAddUser && (
                    <SaveAndCancel
                        className={"add-user-buttons"}
                        disabled={isLoading}
                        handleSubmit={() => !isSubmitable ? handleChange('validate', { id: 'all' }) : handleSubmit(isView ? 'add-user' : 'save-settings')}
                        submitText={(isView ? 'Add User' : 'Save')}
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
    const assignableRoles = useSelector(selectAssignableRoles());
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
                                        <Checkbox
                                            style={{ padding: 0 }}
                                            disableRipple
                                            disabled
                                            icon={<Icon path={mdiCheckboxBlankOutline} size={'18px'} />}
                                            checkedIcon={<Icon path={mdiCheckboxOutline} size={'18px'} />}
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
    const { toggleModal, firstName, lastName, email, userId } = props;
    const [isLoading, setIsLoading] = useState(false);
    const userToken = useSelector(makeSelectToken());
    const scope = 0;
    const handleReset = async () => {
        setIsLoading(true);
        await resetUser({ userId, scope }, userToken)
        setIsLoading(false);
        toggleModal(false);
        dispatch(setSnackbar({ severity: 'success', message: `${firstName} ${lastName}'s account was reset.` }))
    }
    return (
        <GenericModal
            {...props}
            className="user-delete">
            <>
                <div className="header header-2">
                    Reset User
                </div>
                <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
                <div className="contents subtext">
                    <p>Are you sure you want to reset account access?</p>
                    <p>Doing so will remove {firstName}'s access to Insights, and will send a email with an access reset link to {email}.</p>
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
        </GenericModal>
    )
}

const ProfileSection = props => {
    const { handleChange, isView, errorState, isSingleEdit } = props;
    const { firstName, lastName, title, email, datetimeJoined, userId } = props;
    const classes = useStyles();
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    if (isView) {
        return (
            <div className="view-profile">
                <div>
                    <ProfileIcon className="header-1" size={95} firstName={firstName} lastName={lastName} />
                    {userId && (
                        <a className="link reset-account" onClick={() => setShowConfirmReset(true)}>
                            Reset Account Access
                        </a>
                    )}
                </div>
                <div className="profile-info">
                    <div className="header-2">{firstName} {lastName}</div>
                    <div className="subtext">{title}</div>
                    <div className="subtext">{email}</div>
                    <div className="subtle-text">{`Member since ${moment(datetimeJoined).format('MMMM DD, YYYY')}`}</div>
                </div>
                <span className={`action-icon pointer edit-profile-icon`} title={'Edit Profile'} onClick={() => handleChange('view', { id: 'viewProfile', value: false })}>
                    <Icon className={`edit`} color="#828282" path={mdiPlaylistEdit} size={'24px'} />
                </span>
                <ConfirmReset
                    open={showConfirmReset}
                    toggleModal={setShowConfirmReset}
                    firstName={firstName}
                    lastName={lastName}
                    userId={userId}
                    email={email} />
            </div>
        )
    }
    const renderInputField = (title, id) => (
        <div>
            <InputLabel className={classes.inputLabel}>{title}</InputLabel>
            <TextField
                size="small"
                fullWidth
                id={`edit-${id}`}
                value={props?.[id]}
                onChange={(e, v) => handleChange(id, e.target.value)}
                onBlur={(e) => handleChange('validate', { id })}
                variant="outlined"
                error={Boolean(errorState?.[id])}
                helperText={<span style={{ marginLeft: -14 }}>{errorState?.[id]}</span>}
            />
        </div>
    )
    return (
        <div className="edit-profile">
            <div className='profile-row'>
                {renderInputField('First Name', 'firstName')}
                {renderInputField('Last Name', 'lastName')}
            </div>
            <div className='profile-row'>
                {renderInputField('Title', 'title')}
                {renderInputField('Email', 'email')}
            </div>
            {isSingleEdit && <SaveAndCancel
                className={"save-profile"}
                disabled={errorState?.['firstName'] || errorState?.['lastName'] || errorState?.['email'] || errorState?.['title']}
                handleSubmit={() => handleChange('save-settings')}
                submitText={'Save'}
                isLoading={false}
                cancelText={"Cancel"}
                handleCancel={() => handleChange('save-cancel')}
            />}
        </div>

    )
}
