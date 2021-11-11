
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Divider, Grid, InputLabel, makeStyles, MenuItem, Modal, TextField, Select, FormControl, ListItemIcon, Checkbox, ListItemText, FormHelperText } from '@material-ui/core';
import Icon from '@mdi/react'
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import { selectAssignableRoles, selectLocationLookups } from '../../App/store/UserManagement/um-selectors';
import { UM_PRODUCT_ID } from '../../../constants';
import { createClient, deleteClient, generateProductUpdateBody, getRoleMapping, getSelectedRoles, patchRoles, resetClient, updateClientProfile } from '../helpers';
import { makeSelectLogger, makeSelectProductRoles, makeSelectToken, makeSelectUserFacility } from '../../App/selectors';
import { mdiPlaylistEdit } from '@mdi/js';
import { MAX_DESCRIPTION, MAX_INPUT } from '../constants';
import { GenericModal, ProfileIcon, SaveAndCancel } from '../../../components/SharedComponents/SharedComponents';
import { setSnackbar } from '../../App/actions';
import { setClients } from '../../App/store/ApiManagement/am-actions';
import { selectClients } from '../../App/store/ApiManagement/am-selectors';


export const APILearnMore = props => {
    const HEADER = "How does API management work?"
    const DESC = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec mi, justo molestie scelerisque. Placerat ipsum egestas aenean laoreet enim integer. Mi ut et faucibus et feugiat phasellus at porttitor.";

    const locationLookups = useSelector(selectLocationLookups());
    const facilityId = useSelector(makeSelectUserFacility())
    const facilityName = locationLookups?.[facilityId]?.name;
    const facilityMark = "<facility>";
    return (
        <GenericModal
            {...props}
            className="api-management-learn-more"
        >
            <div className="header header-2">{HEADER}</div>
            <p className="description subtext">{DESC?.replaceAll(facilityMark, facilityName)}</p>
            <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />

            <div className="learn-more-content ">
                <div>
                    <span className={`role-cell subtle-subtext Full Access`}>Full Access</span>
                    <span className="content subtle-subtext">{DESC?.replaceAll(facilityMark, facilityName)}</span>
                </div>
                <div>
                    <span className={`role-cell subtle-subtext View Only`}>View Only</span>
                    <span className="content subtle-subtext">{DESC?.replaceAll(facilityMark, facilityName)}</span>
                </div>
            </div>
        </GenericModal>
    )
}

export const ClipboardField = props => {
    const classes = useStyles();
    const { value, warning, title, className, id } = props;
    const dispatch = useDispatch();
    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
        document.getElementById(id ?? 'clipboard-field')?.select?.()
        dispatch(setSnackbar({ severity: 'success', message: `Copied to clipboard.` }))
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
                    Client Added
                </div>
                <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
                <div className="contents subtext">
                    <p>{clientName} has been added.</p>
                </div>
                <ClipboardField
                    className="copy-field"
                    title={"Client ID"}
                    id="clientId-field"
                    value={clientId}
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
        const response = await deleteClient({ clientId, scope: 2 }, userToken);
        const modified = [...userTable];
        const id = modified.findIndex((u) => u.clientId == clientId);
        if (id >= 0) {
            modified.splice(id, 1);
        }
        dispatch(setSnackbar({ severity: 'success', message: `${clientName} was deleted.` }))
        dispatch(setClients(modified))
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
                    Delete Client
                </div>
                <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
                <div className="contents subtext">
                    <p>Are you sure you want to delete {clientName}?</p>
                    <p>Deleted client will not have any access to Insights.</p>
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

const defaultViewState = {
    viewProfile: true,
    viewAdminAccess: true
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
    } else {
        //Validate by default 
        const errorState = state?.errorState || {};
        //If manual validate (on blur) vs if ttheyre updating the field directly
        const { id, value } = event.name == 'validate' ? event.value : { id: event.name, value: event.value };
        const isValidateAll = id == 'all';

        if (id == 'clientName' || isValidateAll) {
            errorState['clientName'] = (value ?? state?.clientName) ? null : '​Please enter a client name';
        }
        event.value = value?.substring(0, id == 'description' ? MAX_DESCRIPTION : MAX_INPUT);
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
    const isAddUser = !Boolean(user?.clientId);
    //if we're adding a new user we edit all sections at once
    const viewObject = isAddUser ? null : defaultViewState;
    const locationLookups = useSelector(selectLocationLookups());
    const [userData, setUserData] = useReducer(userReducer, { ...user, viewState: viewObject, locationLookups });

    const userToken = useSelector(makeSelectToken());
    const assignableRoles = useSelector(selectAssignableRoles());
    const logger = useSelector(makeSelectLogger());

    const { viewProfile, viewAdminAccess, ...viewPermissions } = userData?.viewState || {};

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

            createClient(userData, createUserSuccess, createUserError, userToken, assignableRoles);
        }
    }

    const userTable = useSelector(selectClients());
    const productRoles = useSelector(makeSelectProductRoles());
    const updateTable = (clientId) => {
        const { tableData, clientName, description, roles } = userData || {};
        const modified = [...userTable];
        const updatedUser = {
            clientId,
            clientName, description,
            displayRoles: getRoleMapping(roles, Object.values(productRoles)),
            roles
        };
        const id = modified.findIndex((u) => u.clientId == clientId);
        if (id >= 0) {
            modified[id] = { ...modified[id], ...updatedUser };
        } else {
            modified.push({ ...updatedUser, tableData: { id: modified.length } })
        }
        dispatch(setClients(modified))
    }

    const handleRoleSubmit = async () => {
        const { clientId, roles, clientName } = userData;
        handleChange('save-settings');
        const productUpdates = generateProductUpdateBody(roles, assignableRoles);
        const profile = await patchRoles({ userId: clientId, scope: 2, productUpdates }, userToken).then((e) => {
            if (e == 'error') {
                dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. Could not update client.` }))
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
                dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. Could not update client.` }))
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
            className={`add-edit-user client ${!isAddUser && 'is-edit-client'} ${isSingleEdit && 'single-edit'} `}
        >
            <>
                <ProfileSection {...userData} isView={viewProfile} isSingleEdit={isSingleEdit} handleChange={handleChange} handleSubmit={handleProfileSubmit} />
                <AdminPanelAccess {...userData} isAddUser={isAddUser} isView={viewAdminAccess} isSingleEdit={isSingleEdit} handleChange={handleChange} handleSubmit={handleRoleSubmit} />
                {isAddUser && (
                    <SaveAndCancel
                        className={"add-user-buttons"}
                        disabled={isLoading}
                        handleSubmit={() => !isSubmitable ? handleChange('validate', { id: 'all' }) : handleSubmit(isView ? 'add-user' : 'save-settings')}
                        submitText={(isView ? 'Add Client' : 'Save')}
                        isLoading={isLoading}
                        cancelText={"Cancel"}
                        handleCancel={() => toggleModal(false)}
                    />
                )}
            </>
        </GenericModal>
    )
}


const AdminPanelAccess = props => {
    const { handleChange, roles, isView, isSingleEdit, handleSubmit, isAddUser } = props;
    const assignableUMRoles = useSelector(selectAssignableRoles())?.[UM_PRODUCT_ID]?.productRoles || {};
    const { umRoles } = useSelector(makeSelectProductRoles());
    const { roleDisplay, roleId } = getSelectedRoles(roles, umRoles);
    const locationLookups = useSelector(selectLocationLookups());
    //User management has a default scope of Facility
    const [defaultFacility, other] = Object.entries(locationLookups).find(([lId, l]) => l?.scopeId == 2);
    let content = null;
    const getLocationObject = (value) => {
        return {
            current: [roleId],
            value: {
                scope: { f: [defaultFacility] }
            },
            id: value,
            productId: UM_PRODUCT_ID
        }
    }
    if (isView) {
        content = (
            <div className="role-display">
                <span>{roleDisplay}</span>
                <span className={`action-icon pointer`} title={'Edit User Management Access'} onClick={() => handleChange('view', { id: 'viewAdminAccess', value: false })}>
                    <Icon className={`edit`} color="#828282" path={mdiPlaylistEdit} size={'24px'} />
                </span>
            </div>
        )
    } else {
        content = (
            <>
                <FormControl
                    className="admin-select"
                    variant='outlined' size='small' >
                    <Select
                        displayEmpty
                        id="admin-setting"
                        value={roleId}
                        style={{ width: 200 }}
                        onChange={(e, v) => handleChange('roles', getLocationObject(e.target.value))}
                    >
                        {Object.entries(assignableUMRoles).map(([roleId, role]) => (
                            <MenuItem key={roleId} value={roleId}>{role?.displayName}</MenuItem>
                        ))}
                        <MenuItem value={null}>No Access</MenuItem>
                    </Select>
                    {isSingleEdit && <SaveAndCancel
                        className={"save-admin-panel-access"}
                        handleSubmit={() => isAddUser ? handleChange('save-settings') : handleSubmit()}
                        submitText={'Save'}
                        isLoading={false}
                        cancelText={"Cancel"}
                        handleCancel={() => handleChange('save-cancel')}
                    />}
                </FormControl>

            </>
        )
    }

    return (
        <div className="admin-panel-access">
            <div className="subtle-subtext title">User Management Access</div>
            <Divider className="divider" />
            {content}
            <Divider className="divider" />
        </div>
    )
}

const ConfirmReset = props => {
    const dispatch = useDispatch();
    const { clientName, clientId } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState(false)
    const userToken = useSelector(makeSelectToken());
    const scope = 2;
    const handleReset = async () => {
        setIsLoading(true);
        const secret = await resetClient({ clientId, scope }, userToken)

        if (secret == 'error') {
            dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. Could not update client.` }))
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
                <div className="contents subtext">
                    <p>{clientName} has been added.</p>
                </div>
                <ClipboardField
                    warning="The Client Secret will only be displayed now."
                    title={"Client Secret"}
                    value={clientSecret}
                />
            </>
        )
    } else {
        content = (
            <>
                <div className="contents subtext">
                    <p>Are you sure you want to reset the Client Secret?</p>
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
                        <ProfileIcon className="header-1 api-icon" size={88} override={"API"} />
                        {clientId && (
                            <a className="link reset-account" onClick={() => setShowConfirmReset(true)}>
                                Reset Client Secret
                            </a>
                        )}
                    </div>
                    <div className="profile-info">
                        <div className="header-2">{clientName}</div>
                        {clientId && <div className="subtle-text">{`Client ID: ${clientId}`}</div>}
                        {clientId && <div className="subtle-text">{`Created on ${moment(datetimeJoined).format('MMMM DD, YYYY')}`}</div>}

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
            <InputLabel className={classes.inputLabel}>Client Name</InputLabel>
            <TextField
                size="small"
                fullWidth
                id={`edit-clientName`}
                value={props?.['clientName']}
                onChange={(e, v) => handleChange('clientName', e.target.value)}
                onBlur={(e) => handleChange('validate', { id: 'clientName' })}
                variant="outlined"
                error={Boolean(errorState?.['clientName'])}
                helperText={<span style={{ marginLeft: -14 }}>{errorState?.['clientName']}</span>}
            />
            <InputLabel className={classes.inputLabel}>Client Description</InputLabel>
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

