import React from 'react';
import Modal from '@material-ui/core/Modal';
import DialogContent from '@material-ui/core/DialogContent';
import UserModalStep1 from '../UserModalStep1';

class UserModal extends React.Component {

  render() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.open}
        onClose={this.props.handleClose}
        disableBackdropClick={true}
      >
        <DialogContent>
          <UserModalStep1
            closeModal={this.props.closeModal}
            addUser={this.props.addUser}
            enableField={this.props.enableField}
            handleFormChange={this.props.handleFormChange}
            userValue={this.props.userValue}
            currentView={this.props.currentView}
            passwordResetLink={this.props.passwordResetLink}
            deleteUser={this.props.deleteUser}
            errorMsg={this.props.errorMsg}
            errorMsgVisible={this.props.errorMsgVisible}
          />
        </DialogContent>
      </Modal>
    );
  }
}

export default UserModal;