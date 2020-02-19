import React from 'react';
import './style.scss';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

class UserFields extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  checkPermissions(value) {
    return this.props.userValue.permissions.indexOf(value) >= 0;
  }

  render() {
    return (
      <form className="User-Info-Form" noValidate autoComplete="off">
          <TextField
            required
            disabled={!this.props.enableField}
            id="firstName"
            name="firstName"
            label="First Name"
            margin="normal"
            className="User-Input"
            value={this.props.userValue.firstName}
            onChange={this.props.handleFormChange}
            variant="outlined"
          />
          <TextField
            required
            disabled={!this.props.enableField}
            id="lastName"
            name="lastName"
            label="Last Name"
            margin="normal"
            className="User-Input"
            value={this.props.userValue.lastName}
            onChange={this.props.handleFormChange}
            variant="outlined"
          />
          <TextField
            required
            disabled={!this.props.enableField}
            id="email"
            name="email"
            label="E-Mail"
            margin="normal"
            className="User-Input"
            value={this.props.userValue.email}
            onChange={this.props.handleFormChange}
            variant="outlined"
          />
          <TextField
            required
            disabled={!this.props.enableField}
            id="title"
            name="title"
            label="Title"
            margin="normal"
            className="User-Input"
            value={this.props.userValue.title}
            onChange={this.props.handleFormChange}
            variant="outlined"
          />
          <div>{this.props.currentView === 'edit' &&
            <Button style={{color : "#3db3e3"}} onClick={() => this.props.passwordResetLink()}>Send password reset link</Button> }</div>
          <h5>Permissions</h5>
          <FormControl className="User-Input" margin="normal">
            <FormControlLabel
              control={
                <Checkbox
                  className="SST-Checkbox"
                  id="mmView"
                  name="mmView"
                  disabled={!this.props.enableField}
                  onChange={this.props.handleFormChange}
                  checked={this.checkPermissions("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_EnhancedM&MView")}
                  value="35840EC2-8FA4-4515-AF4F-D90BD2A303BA_EnhancedM&MView"
                />
              }
              label="Enhanced M&M View"
            />
            <FormControlLabel
              control={
                <Checkbox
                  className="SST-Checkbox"
                  id="mmEdit"
                  name="mmEdit"
                  disabled={!this.props.enableField}
                  onChange={this.props.handleFormChange}
                  checked={this.checkPermissions("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Edit")}
                  value="35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Edit"
                />
              }
              label="Enhanced M&M Edit"
            />
            <FormControlLabel
              control={
                <Checkbox
                  className="SST-Checkbox"
                  id="userManagement"
                  name="userManagement"
                  disabled={!this.props.enableField}
                  onChange={this.props.handleFormChange}
                  checked={this.checkPermissions("6AD12264-46FA-8440-52AD1846BDF1_Admin")}
                  value="6AD12264-46FA-8440-52AD1846BDF1_Admin"
                />
              }
              label="User Management (Create and Edit)"
            />            
          </FormControl>
      </form>
    );
  }
}

export default UserFields;
