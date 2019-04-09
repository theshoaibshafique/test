import React from 'react';
import './style.scss';
import Button from '@material-ui/core/Button';
import UserFields from '../../../UserManager/UserFields/UserFields'

class UserModalStep1 extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
        <div className="Modal User-Modal User-Modal-Step-1">
          <h5 className="light-green bold">Add User</h5>
          <UserFields
            userValue={this.props.userValue}
            enableField={this.props.enableField}
            handleFormChange={this.props.handleFormChange}
          />
          <div className="Button-Row right-align">
            <Button variant="contained" onClick={this.props.closeModal}>Cancel</Button>
            <Button variant="contained" className="primary" onClick={this.props.addUser}>Add User</Button>
          </div>
        </div>
    );
  }
}

export default UserModalStep1;
