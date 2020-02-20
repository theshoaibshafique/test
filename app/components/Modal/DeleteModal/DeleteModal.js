import React from 'react';
import Modal from '@material-ui/core/Modal';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import globalFuncs from '../../../utils/global-functions';
import './style.scss';

class DeleteModal extends React.Component {

  deleteUser() {
    let jsonBody = {
      "userName": this.props.userValue.currentUser
    }

    globalFuncs.genericFetch(process.env.USERMANAGEMENT_API, 'delete', this.props.userToken, jsonBody)
    .then(result => {
      if (!result) {
        // find roles
        let jsonBody;
        if (this.props.userValue.permissions.indexOf("6AD12264-46FA-8440-52AD1846BDF1_Admin") >= 0) {
          jsonBody = {
            "userName": this.props.userValue.currentUser,
            "appName": '6AD12264-46FA-8440-52AD1846BDF1',
            "roleNames": ['Admin']
          }

          globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'delete', this.props.userToken, jsonBody)
          .then(result => {
            if (!result) {
              // send error to modal
            } else {

            }
          });
        }
          
        let rolesNames = [];
        if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_EnhancedM&MView") >= 0) {
          rolesNames.push('EnhancedM&MView');
        }

        if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Edit") >= 0) {
          rolesNames.push('Enhanced M&M Edit');
        }

        if (rolesNames.length > 0) {
          jsonBody = {
            "userName": this.props.userValue.currentUser,
            "appName": '35840EC2-8FA4-4515-AF4F-D90BD2A303BA',
            "roleNames": rolesNames
          }

          globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'delete', this.props.userToken, jsonBody)
          .then(result => {
            if (!result) {
              // send error to modal
            } else {

            }
          });
        }

        this.props.handleClose();
      } else {
        // send error to modal
      }
    })
  }

  render() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.deleteDialogOpen}
        disableBackdropClick={true}
      >
        <DialogContent>
          <div className="Modal Delete-Modal">
            <p className="Title">Delete User</p>
            <p className="Paragraph">Are you sure you want to delete user {this.props.userValue.firstName} {this.props.userValue.lastName}?</p>
            <p className="Paragraph">This action cannot be undone.</p>
            <div className="Button-Row right-align">
              <Button style={{color : "#3db3e3"}} onClick={() => this.props.handleClose()}>Cancel</Button>
              <Button variant="contained" className="secondary" onClick={() => this.deleteUser()}>Delete</Button>
            </div>
          </div>
        </DialogContent>
      </Modal>
    );
  }
}

export default DeleteModal;