import React from 'react';
import './style.scss';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class UserFields extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
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
                  checked={this.props.userValue.permissions[0]}
                  value={this.props.userValue.permissions[0]}
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
                  checked={this.props.userValue.permissions[1]}
                  value={this.props.userValue.permissions[1]}
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
                  checked={this.props.userValue.permissions[2]}
                  value={this.props.userValue.permissions[2]}
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
