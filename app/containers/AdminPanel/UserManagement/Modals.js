
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Divider, Grid, InputLabel, makeStyles, MenuItem, Modal, TextField, Select, FormControl } from '@material-ui/core';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react'
import moment from 'moment/moment';
import { useSelector } from 'react-redux';
import { selectAssignableRoles, selectLocations } from '../../App/store/UserManagement/um-selectors';
import { UM_PRODUCT_ID } from '../../../constants';
import { getLocationDisplay, getRoleMapping, getSelectedRoles } from './helpers';
import { makeSelectProductRoles } from '../../App/selectors';
import { mdiPlaylistEdit } from '@mdi/js';
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
        <div className="permissions-section">
            <div className="subtle-subtext title">Permissions</div>
            <Divider className="divider" />
            <div className="permissions-header subtext">
                <span>Products</span>
                <span>Role</span>
                <span>Access Level</span>
                <span></span>
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
    const { productName, productId, isView, roles } = props;
    const productRoles = useSelector(makeSelectProductRoles(true));
    const locations = useSelector(selectLocations());
    //TODO: check if theyre subscribed
    if (productName == 'User Management') {
        return ''
    }

    const { roleDisplay, roleId } = getSelectedRoles(roles, productRoles?.[productId], true);
    const { minScope, maxScope } = props?.productRoles?.[roleId] || {};
    if (isView) {
        return (
            <div className='product-permission subtext'>
                <span>{productName}</span>
                <span className={`role-cell subtle-subtext ${roleDisplay}`}>{roleDisplay}</span>
                <span>{getLocationDisplay(roles?.[roleId]?.scope, minScope, maxScope, locations)}</span>
                <span></span>
            </div>
        )
    }

    return (
        <div className='product-permission'>
            <span>{productName}</span>
            <span></span>
            <span></span>
        </div>
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
                        onChange={(e, v) => handleChange('roles', { current: value, id: e.target.value, value: assignableUMRoles[e.target.value] })}
                    >
                        {Object.entries(assignableUMRoles).map(([roleId, role]) => (
                            <MenuItem key={roleId} value={roleId}>{role?.roleName}</MenuItem>
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