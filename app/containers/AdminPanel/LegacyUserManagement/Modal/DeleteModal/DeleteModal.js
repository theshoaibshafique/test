import React from 'react';
import Modal from '@material-ui/core/Modal';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import './style.scss';
import globalFuncs from 'utils/global-functions';

class DeleteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsgVisible: false,
      isLoading: false
    }
  }

  enableDisableUser() {
    this.setState({isLoading:true})
    const containsAdmin = this.props.userValue.permissions.indexOf("Admin") >= 0;
    let jsonBody = {
      "firstName": this.props.userValue.firstName,
      "lastName": this.props.userValue.lastName,
      "email": this.props.userValue.email,
      "title": this.props.userValue.title,
      "isActive": !this.props.userValue.isActive,
      "roles": containsAdmin ? this.props.roleNames : this.props.userValue.permissions
    }
    const {logger} = this.props;
    logger?.manualAddLog('click', this.props.userValue.isActive ? 'disable-user' :  'enable-user', this.props.userValue.currentUser);
    globalFuncs.genericFetch(`${process.env.USER_API}profile`, 'PATCH', this.props.userToken, jsonBody)
      .then(result => {
        if (result === 'error' || result === 'conflict') {
          // send error to modal
          this.setState({ errorMsgVisible: true });
        } else {
          this.props.updateGrid(this.props.userValue.id);
          this.props.handleClose();
          this.setState({ errorMsgVisible: false });
        }
        this.setState({isLoading:false})
      });

  }

  render() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.deleteDialogOpen}
        disableBackdropClick={true}
        className="user-modal"
      >
        <DialogContent>
          <div className="Modal Delete-Modal">
            <p className="Title">{this.props.userValue.isActive ? 'Disable User' : 'Enable User'}</p>
            {this.state.errorMsgVisible &&
              <p className="Paragraph-Error subtle-subtext">{this.props.errorMsg}</p>
            }
            <p className="Paragraph subtle-subtext">Are you sure you want to {this.props.userValue.isActive ? 'disable' : 'enable'} this user {this.props.userValue.firstName} {this.props.userValue.lastName}?</p>
            <p className="Paragraph subtle-subtext">{this.props.userValue.isActive ? 'Disabled users will not be able to access Insights.' : ''}</p>
            <div className="Button-Row right-align">
              <Button style={{color : "#3db3e3",marginRight:25}} onClick={() => { this.props.handleClose(); this.setState({ errorMsgVisible: false }); }}>Cancel</Button>
              <Button disableElevation variant="contained" className="secondary" disabled={(this.state.isLoading)} onClick={() => this.enableDisableUser()}>{ (this.state.isLoading) ? <div className="secondary-loader"></div> : (this.props.userValue.isActive ? 'Disable' : 'Enable')}</Button>
            </div>
          </div>
        </DialogContent>
      </Modal>
    );
  }
}

export default DeleteModal;