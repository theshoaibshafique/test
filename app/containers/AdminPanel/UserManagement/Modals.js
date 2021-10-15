import { Button, Divider, Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react'
const GenericModal = props => {
    const { children, toggleModal, className, open } = props;
    return (
        <Modal
            open={open}
            onClose={() => toggleModal(false)}
        >
            <div className={`Modal generic-modal ${className}`}>
                <div className="close-button" onClick={() => toggleModal(false)}>
                    <Icon className={``} color="#000000" path={mdiClose} size={'24px'} />
                </div>
                {children}
            </div>


        </Modal>
    )
}

export const UserAddedModal = props => {
    const { firstName, lastName, email } = { firstName: "Adam", lastName: "Lee", email: "a.lee@surgicalsafety.com" };
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
                <Divider className="divider" style={{backgroundColor:'#F2F2F2'}}/>
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