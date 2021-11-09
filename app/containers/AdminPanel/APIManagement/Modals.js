
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Divider, Grid, InputLabel, makeStyles, MenuItem, Modal, TextField, Select, FormControl, ListItemIcon, Checkbox, ListItemText, FormHelperText } from '@material-ui/core';
import Icon from '@mdi/react'
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import { selectAssignableRoles, selectLocationLookups, selectLocations, selectUsers } from '../../App/store/UserManagement/um-selectors';
import { CD_PRODUCT_ID, EFF_PRODUCT_ID, EMM_PRODUCT_ID, SSC_PRODUCT_ID, UM_PRODUCT_ID } from '../../../constants';
import { createUser, deleteUser, generateProductUpdateBody, getRoleMapping, getSelectedRoles, isWithinScope, patchRoles, resetUser } from '../helpers';
import { makeSelectLogger, makeSelectProductRoles, makeSelectToken, makeSelectUserFacility } from '../../App/selectors';
import { mdiPlaylistEdit, mdiCheckboxBlankOutline, mdiCheckboxOutline } from '@mdi/js';
import globalFunctions from '../../../utils/global-functions';
import { setUsers } from '../../App/store/UserManagement/um-actions';
import { LEARNMORE_DESC, LEARNMORE_HEADER, LEARNMORE_INFO } from '../constants';
import { GenericModal, ProfileIcon, SaveAndCancel, StyledTab, StyledTabs, TabPanel } from '../../../components/SharedComponents/SharedComponents';
import { setSnackbar } from '../../App/actions';


export const APILearnMore = props => {
    
    return (
        <GenericModal
            {...props}
            className="user-management-learn-more"
        >

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
        const response = await deleteUser({ userId, scope: 2 }, userToken);
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
    [EFF_PRODUCT_ID]: true
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
        userData?.['firstName'] && userData?.['lastName'] && userData?.['email'] && (userData?.['title'] || !isAddUser)
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
            createUser(userData, createUserSuccess, createUserError, userToken, assignableRoles);
        }
    }

    const userTable = useSelector(selectUsers());
    const productRoles = useSelector(makeSelectProductRoles());
    const updateTable = (userId) => {
        const { tableData, firstName, lastName, title, roles, email } = userData || {};
        const { id } = tableData || {};
        const modified = [...userTable];
        const updatedUser = {
            userId,
            firstName, lastName, title, email,
            displayRoles: getRoleMapping(roles, Object.values(productRoles)),
            name: `${firstName} ${lastName}`,
            roles
        };

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
        const profile = await patchRoles({ userId, scope: 2, productUpdates }, userToken).then((e) => {
            if (e == 'error') {
                dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. Could not update user.` }))
            } else {
                dispatch(setSnackbar({ severity: 'success', message: `${firstName} ${lastName} was updated.` }))
                updateTable(userId);
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
            className={`add-edit-user ${!isAddUser && 'is-edit-user'} ${isSingleEdit && 'single-edit'} `}
        >
            <>
                <ProfileSection {...userData} isView={viewProfile} isSingleEdit={isSingleEdit} handleChange={handleChange} />
                <AdminPanelAccess {...userData} isAddUser={isAddUser} isView={viewAdminAccess} isSingleEdit={isSingleEdit} handleChange={handleChange} handleSubmit={handleRoleSubmit} />
                
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
                <span className={`action-icon pointer`} title={'Edit Admin Panel Access'} onClick={() => handleChange('view', { id: 'viewAdminAccess', value: false })}>
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
            <div className="subtle-subtext title">Admin Panel Access</div>
            <Divider className="divider" />
            {content}
            <Divider className="divider" />
        </div>
    )
}

const ConfirmReset = props => {
    const dispatch = useDispatch();
    const { toggleModal, firstName, lastName, email, userId } = props;
    const [isLoading, setIsLoading] = useState(false);
    const userToken = useSelector(makeSelectToken());
    const scope = 2;
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
                    {userId && <div className="subtle-text">{`Member since ${moment(datetimeJoined).format('MMMM DD, YYYY')}`}</div>}
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

