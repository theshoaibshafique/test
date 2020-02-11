import React from 'react';
import Modal from '@material-ui/core/Modal';
import DialogContent from '@material-ui/core/DialogContent';
import UserModalStep1 from '../UserModalStep1';

class UserModal extends React.Component { // eslint-disable-line react/prefer-stateless-function

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
          />
        </DialogContent>
      </Modal>
    );
  }
}

export default UserModal;
