
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Divider, Grid, InputLabel, makeStyles, MenuItem, Modal, TextField, Select, FormControl, ListItemIcon, Checkbox, ListItemText, FormHelperText } from '@material-ui/core';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react'
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import { selectAssignableRoles, selectLocationLookups, selectLocations, selectUsers } from '../../App/store/UserManagement/um-selectors';
import { CD_PRODUCT_ID, EFF_PRODUCT_ID, EMM_PRODUCT_ID, SSC_PRODUCT_ID, UM_PRODUCT_ID } from '../../../constants';
import { getLocationDisplay, getRoleMapping, getSelectedRoles, isWithinScope, userHasLocation } from './helpers';
import { makeSelectProductRoles, makeSelectToken } from '../../App/selectors';
import { mdiPlaylistEdit, mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';
import globalFunctions from '../../../utils/global-functions';
import { setUsers } from '../../App/store/UserManagement/um-actions';
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

const deleteUser = async (body, userToken) => {
    return await globalFunctions.axiosFetch(process.env.USER_V2_API + 'profile', 'DELETE', userToken, body)
        .then(result => {
            if (result != 'error') return result?.data;
        }).catch((error) => {
            console.log("oh no", error)
        });
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
        const response = await deleteUser({ userId, minAssignableScope: 2 }, userToken);

        const { id } = tableData || {};
        const modified = [...userTable];
        if (id) {
            modified.splice(id, 1);
        }
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
                    <p>Are you sure you want to delete {firstName} {lastName}</p>
                    <p>Deleted user will not have any access to Insights</p>
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
        return event.value;
    } else if (event.name == 'save-settings') {
        event.name = 'viewState';
        event.value = defaultViewState

        state.backup = null;
    } else if (event.name == 'save-cancel') {
        //Revert to previous state on cancel
        return {
            ...state.backup,
            backup: null
        }
    }
    if (event.name == 'validate') {

        const errorState = state?.errorState || {};
        const { id, value } = event.value;
        const isValidateAll = id == 'all';
        console.log(isValidateAll);
        if (id == 'email' || isValidateAll) {
            errorState['email'] = globalFunctions.validEmail(state?.email) ? null : '​Please enter a valid email address';
        }
        if (id == 'firstName' || isValidateAll) {
            errorState['firstName'] = state?.firstName ? null : '​Please enter a first name';
        }
        if (id == 'lastName' || isValidateAll) {
            errorState['lastName'] = state?.lastName ? null : '​Please enter a last name';
        }
        if (id == 'title' || isValidateAll) {
            errorState['title'] = state?.title ? null : '​Please enter a title';
        }
        if (defaultViewState?.hasOwnProperty(id)) {
            errorState[id] = (value?.length > 0) ? null : 'Please select an access level';
        }
        event.name = 'errorState'
        event.value = errorState;
    }


    if (event.name == 'view') {
        const { id, value } = event.value;
        event.name = 'viewState'
        event.value = {
            ...state.viewState,
            [id]: value
        }
        //Back up the current state for if the user cancels
        state.backup = JSON.parse(JSON.stringify(state));
    }

    if (event.name == 'roles') {
        const roles = state?.roles || {};
        const { current, id, value, productId } = event.value;
        //Delete current role in lists - If we select viewer we want to remove Admin
        if (current) {
            delete roles[current]
        }
        roles[id] = value;
        //Clear errors for Access Level
        if (productId && state.errorState?.[productId]) {
            state.errorState[productId] = null;
        }
        event.name = 'roles';
        event.value = roles
    }
    if (event.name == 'location-roles') {
        const { roleId, locations, locationLookups } = event.value;
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
        opacity: .8
    }
}));

const createProfile = async (body, userToken) => {
    return await globalFunctions.axiosFetch(process.env.USER_V2_API + 'profile', 'POST', userToken, body)
        .then(result => {
            if (result != 'error') return result?.data;
        }).catch((error) => {
            console.log("oh no", error)
        });
}
const patchRoles = async (body, userToken) => {
    return await globalFunctions.axiosFetch(process.env.USER_V2_API + 'roles', 'patch', userToken, body)
        .then(result => {
            if (result != 'error') return result;
        }).catch((error) => {
            console.log("oh no", error)
        });
}
function generateProductUpdateBody(roles, assignableRoles = {}) {
    const productUpdates = [];

    for (var [productId, product] of Object.entries(assignableRoles)) {
        const { productRoles } = product;

        const roleUpdates = {}
        for (var [roleId, role] of Object.entries(productRoles)) {
            if (Object.keys(roles?.[roleId]?.scope || {}).length >= 1)
                roleUpdates[roleId] = roles?.[roleId]?.scope
        }
        productUpdates.push({ productId, roleUpdates })
    }
    return productUpdates;
}
async function createUser(userData, callback, userToken, assignableRoles = {}) {
    const { firstName, lastName, title, email } = userData;
    const userId = await createProfile({ firstName, lastName, title, email }, userToken)
    // const userId = "caa9f488-0279-4242-b096-556428c86371";
    const { roles } = userData;
    const productUpdates = generateProductUpdateBody(roles, assignableRoles);
    const profile = await patchRoles({ userId, minAssignableScope: 2, productUpdates }, userToken);
    callback(userId);
}

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
        userData?.['firstName'] && userData?.['lastName'] && userData?.['email'] && userData?.['title']
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
            createUser(userData, (userId) => { setIsLoading(false); setIsAdded(true); updateTable(userId); }, userToken, assignableRoles);
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

        if (id) {
            modified[id] = updatedUser;
        } else {
            modified.push(updatedUser)
        }
        dispatch(setUsers(modified))
    }

    const handleRoleSubmit = async () => {
        const { userId, roles } = userData;
        handleChange('save-settings');
        const productUpdates = generateProductUpdateBody(roles, assignableRoles);
        const profile = await patchRoles({ userId, minAssignableScope: 2, productUpdates }, userToken);
        updateTable(userId);
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
            className={`add-edit-user ${!isAddUser && 'is-edit-user'} ${isSingleEdit && 'single-edit'} ${isUserAdded && 'user-added'}`}
        >
            <>
                <ProfileSection {...userData} isView={viewProfile} isSingleEdit={isSingleEdit} handleChange={handleChange} />
                <AdminPanelAccess {...userData} isView={viewAdminAccess} isSingleEdit={isSingleEdit} handleChange={handleChange} handleSubmit={handleRoleSubmit} />
                <PermissionSection {...userData} isSubmitable={isSubmitable} viewState={viewPermissions} isSingleEdit={isSingleEdit} handleChange={handleChange} handleSubmit={handleRoleSubmit} />
                {isAddUser && (
                    <SaveAndCancel
                        className={"add-user-buttons"}
                        disabled={isLoading}
                        handleSubmit={() => !isSubmitable ? handleChange('validate', {id:'all'}) : handleSubmit(isView ? 'add-user' : 'save-settings')}
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
const SaveAndCancel = props => {
    const { className, handleSubmit, handleCancel, isLoading, submitText, cancelText, disabled } = props;
    return (
        <div className={`${className} save-and-cancel`}>
            <Button id="save" variant="outlined" className="primary" disabled={disabled} onClick={() => handleSubmit()}>
                {(isLoading) ? <div className="loader"></div> : submitText}
            </Button>
            <Button id="cancel" style={{ color: "#3db3e3" }} onClick={() => handleCancel()}>{cancelText}</Button>
        </div>
    )
}

const PermissionSection = props => {
    const { viewState, isSingleEdit, handleChange, isSubmitable, handleSubmit } = props;
    const isEdit = Object.values(viewState || {}).some((v) => !v) && Object.keys(viewState).length > 0;
    const assignableRoles = useSelector(selectAssignableRoles());
    return (
        <div className={`permissions-section `}>
            <div className="subtle-subtext title">Permissions</div>
            <Divider className="divider" />
            <div className="permissions-header subtext">
                <span>Products</span>
                <span>Role</span>
                <span>Access Level</span>
                {/* {(isViewAll) && <span></span>} */}
            </div>
            <Divider className="divider" />
            {Object.entries(assignableRoles).map(([productId, product]) => (
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
                    handleSubmit={() => handleSubmit()}
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
            // width: 250
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
    const { productName, productId, roles, isSubscribed, errorState } = props;
    const { isView, handleChange } = props;
    const assignableProductRoles = props.productRoles || {};
    const productRoles = useSelector(makeSelectProductRoles(true));
    const locations = useSelector(selectLocations());
    const locationLookups = useSelector(selectLocationLookups());

    //TODO: update to allow multiselect (use roleID list instead and allow multiselect)
    const { roleDisplay, roleId } = getSelectedRoles(roles, productRoles?.[productId], true);
    const { minScope, maxScope } = props?.productRoles?.[roleId] || {};
    const userScope = roles?.[roleId]?.scope ?? {};
    //get a flat list of all locations
    const userLocations = Object.entries(userScope).map(([k, loc]) => loc).flat();
    //We auto focus Access level when a role is selected
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
        handleChange('validate', { id: productId, value: selectedLocations });
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const [selectedLocations, setLocations] = useState(userLocations);
    const getAccessLevelOptions = (minScope, maxScope, currentLocations) => {
        const currLoc = currentLocations || selectedLocations;
        const accessOptions = []
        const hospitals = Object.entries(locations)
        for (const [hId, h] of hospitals) {

            isWithinScope(1, minScope, maxScope) && accessOptions.push(hId);
            if (currLoc.includes(hId)) {
                continue;
            }
            const facilities = Object.entries(h?.facilities);
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
    const getRoleObject = (value) => {
        const { minScope, maxScope } = props?.productRoles?.[value] || {};
        const accessOptions = getAccessLevelOptions(minScope, maxScope, []);
        setAccessLevelOptions(accessOptions);
        const onlyOneOption = accessOptions?.length == 1
        setLocations(onlyOneOption ? accessOptions : []);
        value && !onlyOneOption && handleOpen();
        return {
            current: roleId,
            id: value,
            productId,
            //Default to 1 facility if only 1 option
            value: {
                name: assignableProductRoles?.[value]?.displayName,
                scope: onlyOneOption ?
                    { f: accessOptions } :
                    {}
            }
        }
    }

    const handleLocationChange = e => {
        var newLocations = e.target.value;
        const accessLevelOptions = getAccessLevelOptions(minScope, maxScope, newLocations);
        newLocations = newLocations.filter((l) => accessLevelOptions.includes(l))
        setLocations(newLocations);
        setAccessLevelOptions(accessLevelOptions);
        //Save in state for BE
        handleChange('location-roles', { roleId, locations: newLocations, locationLookups });
    }

    if (!isSubscribed || productName == 'User Management') {
        return ''
    }
    const accessLevelDisplay = selectedLocations.map(l => locationLookups?.[l]?.name).join(", ") || "None";
    if (isView) {
        return (
            <div className='product-permission subtext'>
                <span>{productName}</span>
                <span className="role"><span className={`role-cell subtle-subtext ${roleDisplay}`}>{roleDisplay}</span></span>
                <span className="flex space-between" >
                    <span title={accessLevelDisplay} className='access-level'>{accessLevelDisplay}</span>
                    <span className={`action-icon pointer edit-permissions-icon`} title={`Edit ${productName}`} >
                        <Icon className={`edit`} color="#828282" path={mdiPlaylistEdit} size={'24px'} onClick={() => handleChange('view', { id: productId, value: false })} />
                    </span>
                </span>

            </div>
        )
    }

    return (
        <div className='product-permission'>
            <span>{productName}</span>
            <span>
                <FormControl
                    className="product-role-select"
                    variant='outlined' size='small' fullWidth>
                    <Select
                        displayEmpty
                        id="product-role-select"
                        value={roleId}
                        onChange={(e, v) => handleChange('roles', getRoleObject(e.target.value))}
                    >
                        {Object.entries(assignableProductRoles).map(([roleId, role]) => (
                            role?.displayName && <MenuItem key={roleId} value={roleId}>{role?.displayName}</MenuItem>
                        ))}
                        <MenuItem value={null}>No Access</MenuItem>
                    </Select>
                </FormControl>
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
                        value={selectedLocations}
                        disabled={!accessLevelOptions?.length || (roleDisplay == 'Full Access' && productId != EMM_PRODUCT_ID)}
                        multiple
                        displayEmpty
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        renderValue={(userLocations) => userLocations?.map(l => locationLookups?.[l]?.name).join(", ") || 'None'}
                        onChange={handleLocationChange}
                        error={Boolean(errorState?.[productId])}
                    >
                        {accessLevelOptions.map((locationId) => {
                            const location = locationLookups?.[locationId] || {};
                            const { name, scopeId } = location;
                            return (
                                <MenuItem key={locationId} value={locationId} style={{ padding: "4px 14px 4px 0 " }}>
                                    <ListItemIcon style={{ minWidth: 30, marginLeft: (scopeId - 1) * 12 }}>
                                        <Checkbox
                                            style={{ padding: 0 }}
                                            disableRipple
                                            disabled
                                            icon={<Icon path={mdiCheckboxBlankOutline} size={'18px'} />}
                                            checkedIcon={<Icon path={mdiCheckBoxOutline} size={'18px'} />}
                                            className="SST-Checkbox"
                                            checked={selectedLocations.includes(locationId)}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={name} />
                                </MenuItem>
                            )
                        })}
                    </Select>
                    {errorState?.[productId] && <FormHelperText style={{
                        position: 'absolute',
                        bottom: -22,
                        color: '#f44336',
                        marginLeft: 0
                    }}>{errorState?.[productId]}</FormHelperText>}
                </FormControl>
            </span>
        </div>
    )
}


const AdminPanelAccess = props => {
    const { handleChange, roles, isView, isSingleEdit, handleSubmit } = props;
    const assignableUMRoles = useSelector(selectAssignableRoles())?.[UM_PRODUCT_ID]?.productRoles || {};
    const { umRoles } = useSelector(makeSelectProductRoles());
    const { roleDisplay, roleId } = getSelectedRoles(roles, umRoles);
    const locationLookups = useSelector(selectLocationLookups());
    //User management has a default scope of Facility
    const [defaultFacility, other] = Object.entries(locationLookups).find(([lId, l]) => l?.scopeId == 2);
    let content = null;
    const getLocationObject = (value) => {
        return {
            current: roleId,
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
                            role.displayName && <MenuItem key={roleId} value={roleId}>{role?.displayName}</MenuItem>
                        ))}
                        <MenuItem value={null}>No Access</MenuItem>
                    </Select>
                    {isSingleEdit && <SaveAndCancel
                        className={"save-admin-panel-access"}
                        handleSubmit={() => handleSubmit()}
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


const ProfileSection = props => {
    const { handleChange, isView, errorState, isSingleEdit } = props;
    const { firstName, lastName, title, email, startDate } = props;
    const classes = useStyles();
    if (isView) {
        return (
            <div className="view-profile">
                <ProfileIcon firstName={firstName} lastName={lastName} />
                <div className="profile-info">
                    <div className="normal-text">{firstName} {lastName}</div>
                    <div className="subtle-subtext">{title}</div>
                    <div className="subtle-subtext">{email}</div>
                    <div className="subtle-text">{moment(startDate).format('MMMM DD, YYYY')}</div>
                </div>
                <span className={`action-icon pointer edit-profile-icon`} title={'Edit Profile'} onClick={() => handleChange('view', { id: 'viewProfile', value: false })}>
                    <Icon className={`edit`} color="#828282" path={mdiPlaylistEdit} size={'24px'} />
                </span>
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

const ProfileIcon = props => {
    const { firstName, lastName } = props;
    const initials = `${firstName} ${lastName}`.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
    return (
        <div className="profile-icon header-1">{initials}</div>
    )

}