import React from 'react';
import Modal from '@material-ui/core/Modal';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import './style.scss';
import globalFuncs from '../../../../utils/global-functions';

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
    let jsonBody = {
      "userName": this.props.userValue.currentUser
    };
    this.props.userValue.id;
    if (this.props.userValue.active) {
      globalFuncs.genericFetchWithNoReturnMessage(process.env.USERMANAGEMENT_API, 'delete', this.props.userToken, jsonBody)
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
    } else {
      globalFuncs.genericFetchWithNoReturnMessage(process.env.USERMANAGMENTACTIVATE_API + '/' + this.props.userValue.currentUser, 'PATCH', this.props.userToken, {})
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
            <p className="Title">{this.props.userValue.active ? 'Disable User' : 'Enable User'}</p>
            {this.state.errorMsgVisible &&
              <p className="Paragraph-Error">{this.props.errorMsg}</p>
            }
            <p className="Paragraph">Are you sure you want to {this.props.userValue.active ? 'disable' : 'enable'} this user {this.props.userValue.firstName} {this.props.userValue.lastName}?</p>
            <p className="Paragraph">{this.props.userValue.active ? 'Disabled users will not be able to access Insights.' : ''}</p>
            <div className="Button-Row right-align">
              <Button style={{color : "#3db3e3",marginRight:25}} onClick={() => { this.props.handleClose(); this.setState({ errorMsgVisible: false }); }}>Cancel</Button>
              <Button disableElevation variant="contained" className="secondary" disabled={(this.state.isLoading)} onClick={() => this.enableDisableUser()}>{ (this.state.isLoading) ? <div className="secondary-loader"></div> : (this.props.userValue.active ? 'Disable' : 'Enable')}</Button>
            </div>
          </div>
        </DialogContent>
      </Modal>
    );
  }
}

export default DeleteModal;