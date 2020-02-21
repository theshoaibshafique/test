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

  enableDisableUser() {
    let jsonBody = {
      "userName": this.props.userValue.currentUser
    };
    this.props.userValue.id;
    if (this.props.userValue.active) {
      globalFuncs.genericFetch(process.env.USERMANAGEMENT_API, 'delete', this.props.userToken, jsonBody)
      .then(result => {
        if (result === 'error' || result === 'conflict') {
          // send error to modal
          this.setState({ errorMsgVisible: true });
        } else {
          this.props.updateGrid(this.props.userValue.id);
          this.props.handleClose();
          this.setState({ errorMsgVisible: false });
        }
      });
    } else {
      globalFuncs.genericFetch(process.env.USERMANAGMENTACTIVATE_API + '/' + this.props.userValue.currentUser, 'PATCH', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {
          // send error to modal
          this.setState({ errorMsgVisible: true });
        } else {
          this.props.updateGrid(this.props.userValue.id);
          this.props.handleClose();
          this.setState({ errorMsgVisible: false });
        }
      });
    }
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
            <p className="Title">{this.props.userValue.active ? 'Disable User' : 'Enable User'}</p>
            {this.state.errorMsgVisible &&
              <p className="Paragraph-Error">{this.props.errorMsg}</p>
            }
            <p className="Paragraph">Are you sure you want to {this.props.userValue.active ? 'disable' : 'enable'} this user {this.props.userValue.firstName} {this.props.userValue.lastName}?</p>
            <p className="Paragraph">{this.props.userValue.active ? 'Disabled users will not be able to log into Insights' : ''}</p>
            <div className="Button-Row right-align">
              <Button style={{color : "#3db3e3"}} onClick={() => { this.props.handleClose(); this.setState({ errorMsgVisible: false }); }}>Cancel</Button>
              <Button variant="contained" className="secondary" onClick={() => this.enableDisableUser()}>{this.props.userValue.active ? 'Disable' : 'Enable'}</Button>
            </div>
          </div>
        </DialogContent>
      </Modal>
    );
  }
}

export default DeleteModal;