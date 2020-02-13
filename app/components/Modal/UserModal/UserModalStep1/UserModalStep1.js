import React from 'react';
import './style.scss';
import Button from '@material-ui/core/Button';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import UserFields from '../../../UserManager/UserFields/UserFields'
import globalFuncs from '../../../../utils/global-functions';

class UserModalStep1 extends React.Component {
  deleteUser() {
    // pop up modal asking to confirm

    let jsonBody = {
      "userName": this.props.userValue.userName
    }

    globalFuncs.genericFetch(process.env.USERMANAGEMENT_API, 'delete', this.props.userToken, jsonBody)
    .then(result => {
      if (!result) {
        // send error to modal
      } else {
        // go to users page
      }
    })
  }

  save() {
    let jsonBody = {
      "firstName": this.props.userValue.firstName,
      "lastName": this.props.userValue.lastName,
      "email": this.props.userValue.email,
      "title": this.props.userValue.title,
      "preferredLanguage": this.props.userValue.preferredLanguage,
      "active": this.props.userValue.active
    }

    globalFuncs.genericFetch(process.env.USERMANAGEMENT_API, 'patch', this.props.userToken, jsonBody)
    .then(result => {
      if (!result) {
        // send error to modal
      } else {
        // update roles
      }
    })
  }

  render() {
    return (
        <div className="Modal User-Modal User-Modal-Step-1">
          <div className="ToolBar">
            {this.props.currentView === 'add' ? (
              <h5>Add User</h5>
              ) : (
              <h5>Edit {this.props.userValue.firstName} {this.props.userValue.lastName}</h5>
            )}
            <IconButton onClick={this.props.closeModal}><CloseIcon fontSize='small'/></IconButton>
          </div>
          <UserFields
            userValue={this.props.userValue}
            enableField={this.props.enableField}
            handleFormChange={this.props.handleFormChange}
            currentView={this.props.currentView}
          />
          <div className="Button-Row right-align">
            {this.props.currentView === 'edit' &&
              <Button variant="contained" className="secondary" style={{float: "left"}} onClick={this.deleteUser()}>Delete User</Button>
            }
            <Button style={{color : "#3db3e3"}} onClick={this.props.closeModal}>Cancel</Button>
            {this.props.currentView === 'add' ? (
              <Button variant="contained" className="primary" onClick={this.props.addUser}>Add</Button>
            ) : (
              <Button variant="contained" className="primary" onClick={this.save()}>Save</Button>
            )}
          </div>
        </div>
    );
  }
}

export default UserModalStep1;