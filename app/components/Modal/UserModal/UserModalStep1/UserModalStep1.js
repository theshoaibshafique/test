import React from 'react';
import './style.scss';
import Button from '@material-ui/core/Button';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import UserFields from '../../../UserManager/UserFields/UserFields'

class UserModalStep1 extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
        <div className="Modal User-Modal User-Modal-Step-1">
          <div className="ToolBar"><h5>Add User</h5><IconButton onClick={this.props.closeModal}><CloseIcon fontSize='small'/></IconButton></div>
          <UserFields
            userValue={this.props.userValue}
            enableField={this.props.enableField}
            handleFormChange={this.props.handleFormChange}
          />
          <div className="Button-Row right-align">
            <Button style={{color : "#3db3e3"}} onClick={this.props.closeModal}>Cancel</Button>
            <Button variant="contained" className="primary" onClick={this.props.addUser}>Add</Button>
          </div>
        </div>
    );
  }
}

export default UserModalStep1;
