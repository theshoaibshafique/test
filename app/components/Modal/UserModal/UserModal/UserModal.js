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
        // disableBackdropClick={true}
        className="user-modal"
      >
        <DialogContent>
          <UserModalStep1
            closeModal={this.props.closeModal}
            addUser={this.props.addUser}
            handleFormChange={this.props.handleFormChange}
            userValue={this.props.userValue}
            currentView={this.props.currentView}
            deleteUser={this.props.deleteUser}
            errorMsg={this.props.errorMsg}
            errorMsgVisible={this.props.errorMsgVisible}
            errorMsgEmailVisible={this.props.errorMsgEmailVisible}
            refreshGrid={this.props.refreshGrid}
            updateGridEdit={this.props.updateGridEdit}
            isFormValid={this.props.isFormValid}
            fieldErrors={this.props.fieldErrors}
            roleNames={this.props.roleNames}
          />
        </DialogContent>
      </Modal>
    );
  }
}

export default UserModal;