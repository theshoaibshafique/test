
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Divider, Grid, InputLabel, makeStyles, MenuItem, Modal, TextField, Select, FormControl, ListItemIcon, Checkbox, ListItemText } from '@material-ui/core';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react'
import moment from 'moment/moment';
import { useSelector } from 'react-redux';
import { selectAssignableRoles, selectLocationLookups, selectLocations } from '../../App/store/UserManagement/um-selectors';
import { UM_PRODUCT_ID } from '../../../constants';
import { getLocationDisplay, getRoleMapping, getSelectedRoles, isWithinScope, userHasLocation } from './helpers';
import { makeSelectProductRoles } from '../../App/selectors';
import { mdiPlaylistEdit, mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';
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

export const UserAddedModal = props => {
    const { firstName, lastName, email } = props;
    const { toggleModal } = props;
    return (
        <GenericModal
            {...props}
            className="user-added"
        >
            <>
                <div className="header header-2">
                    User Added
                </div>
                <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
                <div className="contents subtext">
                    <p>{firstName} {lastName} has been successfully added</p>
                    <p>A confirmation email link has been sent to {email}</p>
                </div>
                <div className="close">
                    <Button disableElevation disableRipple
                        variant="contained" className="primary"
                        onClick={() => toggleModal(false)}>
                        Close
                    </Button>
                </div>

            </>
        </GenericModal>
    )
}

const SCOPE_MAP = ['unrestricted', 'h', 'f', 'd', 'r'];
const userReducer = (state, event) => {
    if (event.name == 'new-user') {
        return event.value;
    } else if (event.name == 'save-settings') {
        return {
            ...state,
            viewState: { viewProfile: true, viewAdminAccess: true, viewPermissions: true }
        }
    }

    if (event.name == 'view') {
        const { id, value } = event.value;
        return {
            ...state,
            viewState: {
                ...state.viewState,
                [id]: value
            }
        }
    }

    if (event.name == 'roles') {
        const roles = state?.roles || {};
        const { current, id, value } = event.value;
        //Delete current role in lists
        if (current) {
            delete roles[current]
        }
        roles[id] = value;
        return {
            ...state,
            roles: roles
        }
    } else if (event.name == 'location-roles') {
        const { location, roleId } = event.value;
        const { locationId, scopeId, name } = location || {};
        //We're under the assumption that roles is alredy in the state if you're modifying location
        state.roles = state.roles || {}
        state.roles[roleId] = state.roles[roleId] || {}
        state.roles[roleId].scope = state.roles[roleId].scope || {}
        state.roles[roleId].scope[SCOPE_MAP[scopeId]] = state.roles[roleId].scope[SCOPE_MAP[scopeId]] || [];
        const locationList = state.roles[roleId].scope[SCOPE_MAP[scopeId]];
        const index = locationList.findIndex((l) => l == locationId);
        if (index >= 0) {
            locationList.pop(index)
        } else {
            locationList.push(locationId)
        }

        return {
            ...state
        }
    }

    if (event.name == 'permissionRoles') {
        console.log('this', event);
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

export const AddEditUserModal = props => {
    const { user, toggleModal } = props;
    const isAddUser = !Boolean(user?.userId);
    //if we're adding a new user we edit all sections at once
    const viewObject = isAddUser ? {} : { viewProfile: true, viewAdminAccess: true, viewPermissions: true }

    const [userData, setUserData] = useReducer(userReducer, { ...user, viewState: viewObject });
    const { viewProfile, viewAdminAccess, viewPermissions } = userData?.viewState;
    const isView = Object.values(userData?.viewState || {}).some((v) => v);
    const [isLoading, setIsLoading] = useState(false);
    //Reload the state every time user changes
    useEffect(() => {
        handleChange('new-user', { ...user, viewState: viewObject });
    }, [user])

    const handleChange = (name, value) => {
        setUserData({
            name, value
        })
    }

    const handleSubmit = (event) => {
        if (event == 'save-settings') {
            handleChange('save-settings');
        } else if (event == 'add-user') {
            //Post call to add user
        }
    }
    return (
        <GenericModal
            {...props}
            className="add-edit-user"
        >
            <>
                <ProfileSection {...userData} isView={viewProfile} handleChange={handleChange} />
                <AdminPanelAccess {...userData} isView={viewAdminAccess} handleChange={handleChange} />
                <PermissionSection {...userData} isView={viewPermissions} handleChange={handleChange} />
                {isAddUser && (
                    <div className="add-user-buttons">
                        <Button id="save" variant="outlined" className="primary" disabled={isLoading} onClick={() => handleSubmit(isView ? 'add-user' : 'save-settings')}>
                            {(isLoading) ? <div className="loader"></div> : (isView ? 'Add User' : 'Save')}
                        </Button>
                        <Button id="cancel" style={{ color: "#3db3e3" }} onClick={() => toggleModal(false)}>Cancel</Button>
                    </div>
                )}
            </>
        </GenericModal>
    )
}

const PermissionSection = props => {
    const { isView, handleChange } = props;
    const assignableRoles = useSelector(selectAssignableRoles());
    return (
        <div className={`permissions-section ${isView && 'isView'}`}>
            <div className="subtle-subtext title">Permissions</div>
            <Divider className="divider" />
            <div className="permissions-header subtext">
                <span>Products</span>
                <span>Role</span>
                <span>Access Level</span>
                {isView && <span></span>}
            </div>
            <Divider className="divider" />
            {Object.entries(assignableRoles).map(([productId, product]) => (
                <ProductPermissions
                    {...product}
                    productId={productId}
                    {...props} />
            ))}
        </div>
    )
}
const ProductPermissions = props => {
    const { productName, productId, roles } = props;
    const { isView, handleChange } = props;
    const assignableProductRoles = props.productRoles || {};
    const productRoles = useSelector(makeSelectProductRoles(true));
    const locationLookups = useSelector(selectLocationLookups());

    //TODO: update to allow multiselect (use roleID list instead and allow multiselect)
    const { roleDisplay, roleId } = getSelectedRoles(roles, productRoles?.[productId], true);
    const { minScope, maxScope } = props?.productRoles?.[roleId] || {};
    const userScope = roles?.[roleId]?.scope ?? {};
    const userLocations = Object.entries(userScope).map(([k, loc]) => loc.map(l => { return { locationId: l, locationShort: k } })).flat();

    const getAccessLevelOptions = (minScope, maxScope) => Object.entries(locationLookups).map(([locationId, location]) => {
        const { scopeId, name, isOnlyChild } = location;
        if (isWithinScope(scopeId, minScope, maxScope)) {
            return {
                locationId, name, scopeId
            }
        }

    }).filter((l) => l);
    const [accessLevelOptions, setAccessLevelOptions] = useState(getAccessLevelOptions(minScope, maxScope));
    const getRoleObject = (value) => {
        const { minScope, maxScope } = props?.productRoles?.[value] || {};
        setAccessLevelOptions(getAccessLevelOptions(minScope, maxScope));
        return {
            current: roleId,
            id: value,
            value: { name: assignableProductRoles?.[value]?.roleName, scope: {} }
        }
    }

    const handleLocationChange = location => {
        handleChange('location-roles', { location: location, roleId });
    }

    //TODO: check if theyre subscribed
    if (productName == 'User Management') {
        return ''
    }
    if (isView) {
        return (
            <div className='product-permission subtext'>
                <span>{productName}</span>
                <span className="role"><span className={`role-cell subtle-subtext ${roleDisplay}`}>{roleDisplay}</span></span>
                <span>{userLocations.map(l => locationLookups?.[l.locationId]?.name).join(", ") || "None"}</span>
                <span></span>
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
                    variant='outlined' size='small' fullWidth>
                    <Select
                        MenuProps={{
                            getContentAnchorEl: () => null,
                        }}
                        displayEmpty
                        id="access-level-select"
                        value={userLocations}
                        disabled={!accessLevelOptions?.length}
                        multiple
                        displayEmpty
                        renderValue={(userLocations) => userLocations?.map(l => locationLookups?.[l.locationId]?.name).join(", ") || 'None'}
                    // onChange={handleLocationChange}
                    >
                        {accessLevelOptions?.map((location) => (
                            <AccessLevelOption location={location} userLocations={userLocations} handleLocationChange={handleLocationChange} />
                        ))}
                    </Select>
                </FormControl>
            </span>
            {/* <span></span> */}
        </div>
    )
}

const AccessLevelOption = (props) => {
    const { location, userLocations, handleLocationChange } = props;
    const { locationId, scopeId, name } = location || {};
    console.log(userLocations, locationId);
    const [checked, setIsChecked] = useState(userHasLocation(userLocations, locationId));
    const handleCheck = () => {
        handleLocationChange(location);
        setIsChecked(!checked);
    }
    return (
        <MenuItem key={locationId} value={locationId} onClick={() => handleCheck()} style={{ padding: "4px 14px 4px 0 " }}>
            <ListItemIcon style={{ minWidth: 30, marginLeft: (scopeId - 1) * 12 }}>
                <Checkbox
                    style={{ padding: 0 }}
                    disableRipple
                    disabled
                    icon={<Icon path={mdiCheckboxBlankOutline} size={'18px'} />}
                    checkedIcon={<Icon path={mdiCheckBoxOutline} size={'18px'} />}
                    className="SST-Checkbox"
                    checked={checked}
                />
            </ListItemIcon>
            <ListItemText primary={name} />
        </MenuItem>
    )
}



const AdminPanelAccess = props => {
    const { handleChange, roles, isView } = props;
    const assignableUMRoles = useSelector(selectAssignableRoles())?.[UM_PRODUCT_ID]?.productRoles || {};
    const { umRoles } = useSelector(makeSelectProductRoles());
    const { roleDisplay, roleId } = getSelectedRoles(roles, umRoles);

    return (
        <div className="admin-panel-access">
            <div className="subtle-subtext title">Admin Panel Access</div>
            <Divider className="divider" />
            {!isView ? (
                <FormControl
                    className="admin-select"
                    variant='outlined' size='small' style={{ width: 200 }}>
                    <Select
                        displayEmpty
                        id="admin-setting"
                        value={roleId}
                        onChange={(e, v) => handleChange('roles', { current: roleId, id: e.target.value, value: assignableUMRoles[e.target.value] })}
                    >
                        {Object.entries(assignableUMRoles).map(([roleId, role]) => (
                            role.displayName && <MenuItem key={roleId} value={roleId}>{role?.displayName}</MenuItem>
                        ))}
                        <MenuItem value={null}>No Access</MenuItem>
                    </Select>
                </FormControl>
            ) : (
                <div className="role-display">{roleDisplay}</div>
            )}

            <Divider className="divider" />
        </div>
    )
}


const ProfileSection = props => {
    const { handleChange, isView } = props;
    const { firstName, lastName, title, email, startDate } = props;
    const classes = useStyles();
    if (isView) {
        return (
            <div className="view-profile">
                <ProfileIcon />
                <div className="profile-info">
                    <div className="normal-text">{firstName} {lastName}</div>
                    <div className="subtle-subtext">{title}</div>
                    <div className="subtle-subtext">{email}</div>
                    <div className="subtle-text">{moment(startDate).format('MMMM DD, YYYY')}</div>
                </div>
                <span className={`action-icon pointer`} title={'Edit Profile'} onClick={() => handleChange('view', { id: 'viewProfile', value: false })}>
                    <Icon className={``} color="#828282" path={mdiPlaylistEdit} size={'24px'} />
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
                variant="outlined"
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