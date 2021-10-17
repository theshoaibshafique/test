
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Divider, Grid, InputLabel, makeStyles, MenuItem, Modal, TextField, Select, FormControl } from '@material-ui/core';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react'
import moment from 'moment/moment';
import { useSelector } from 'react-redux';
import { selectAssignableRoles } from '../../App/store/UserManagement/um-selectors';
import { UM_PRODUCT_ID } from '../../../constants';
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
    console.log(event);
    if (event.name == 'overview') {

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

export const AddUserModal = props => {
    const { isEdit } = props;
    const [userData, setUserData] = useReducer(userReducer, {});
    const handleChange = (name, value) => {
        setUserData({
            name, value
        })
    }
    return (
        <GenericModal
            {...props}
            className="add-user"
        >
            <>
                <ProfileSection isEdit={isEdit} handleChange={handleChange} />
                <AdminPanelAccess isEdit={isEdit} handleChange={handleChange} />
            </>
        </GenericModal>
    )
}

const AdminPanelAccess = props => {
    const { user, handleChange, isEdit } = props;
    const umRoles = useSelector(selectAssignableRoles())?.[UM_PRODUCT_ID]?.productRoles || {};
    return (
        <div className="admin-panel-setting">
            <div className="subtle-subtext title">Admin Panel Access</div>
            <Divider className="divider" />
            {!isEdit ? (
                <FormControl
                    className="admin-select"
                    variant='outlined' size='small' style={{ width: 200 }}>
                    <Select
                        displayEmpty
                        id="admin-setting"
                        onChange={(e, v) => handleChange('userRole', e.target.value)}
                    >
                        {Object.entries(umRoles).map(([roleId, role]) => (
                            <MenuItem key={roleId} value={roleId}>{role?.roleName}</MenuItem>
                        ))}
                        <MenuItem>No Access</MenuItem>
                    </Select>
                </FormControl>
            ) : (
                // TODO: update how t oread
                <div>{user?.roleName}</div>
            )}

            <Divider className="divider" />
        </div>
    )
}


const ProfileSection = props => {
    const { handleChange, isEdit } = props;
    // const { firstName, lastName, title, email, startDate} = props;
    const { firstName, lastName, title, email, startDate } = { firstName: "Adam", lastName: "Lee", email: "a.lee@surgicalsafety.com", title: "Mr", startDate: "October 6, 2021" };

    const classes = useStyles();
    if (isEdit) {
        return (
            <div className="view-profile">
                <ProfileIcon />
                <div className="profile-info">
                    <div className="normal-text">{firstName} {lastName}</div>
                    <div className="subtle-subtext">{title}</div>
                    <div className="subtle-subtext">{email}</div>
                    <div className="subtle-text">{moment(startDate).format('MMMM DD, YYYY')}</div>
                </div>

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