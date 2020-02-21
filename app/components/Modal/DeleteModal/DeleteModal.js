import React from 'react';
import Modal from '@material-ui/core/Modal';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import globalFuncs from '../../../utils/global-functions';
import './style.scss';

class DeleteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsgVisible: false
    }
  }

  deleteUser() {
    let jsonBody = {
      "userName": this.props.userValue.currentUser
    }

    globalFuncs.genericFetch(process.env.USERMANAGEMENT_API, 'delete', this.props.userToken, jsonBody)
    .then(result => {
      if (result === 'error') {
        // send error to modal
        this.setState({ errorMsgVisible: true });
      } else {
        this.props.handleClose();
        this.setState({ errorMsgVisible: false });
      }
    });
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
            <p className="Title">Disable User</p>
            {this.state.errorMsgVisible &&
              <p className="Paragraph-Error">{this.props.errorMsg}</p>
            }
            <p className="Paragraph">Are you sure you want to disable this user {this.props.userValue.firstName} {this.props.userValue.lastName}?</p>
            <p className="Paragraph">Disabled users will not be able to log into Insights</p>
            <div className="Button-Row right-align">
              <Button style={{color : "#3db3e3"}} onClick={() => { this.props.handleClose(); this.setState({ errorMsgVisible: false }); }}>Cancel</Button>
              <Button variant="contained" className="secondary" onClick={() => this.deleteUser()}>Disable</Button>
            </div>
          </div>
        </DialogContent>
      </Modal>
    );
  }
}

export default DeleteModal;