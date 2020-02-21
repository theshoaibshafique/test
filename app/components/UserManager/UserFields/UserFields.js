import React from 'react';
import './style.scss';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

class UserFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '',
      validEmail: true,
      validFirstName: true,
      validLastName: true,
      validTitle: true
    }
  }

  checkPermissions(value) {
    return this.props.userValue.permissions.indexOf(value) >= 0;
  }

  validateField = (e, type) => {
    const field = e.target.value;

    switch (type) {
      case 'first':
        if (!field) {
          this.setState({
            validFirstName: false,
          });
        } else {
          this.setState({
            validFirstName: true,
          });
        }
        break;

      case 'last':
        if (!field) {
          this.setState({
            validLastName: false,
          });
        } else {
          this.setState({
            validLastName: true,
          });
        }
        break;

      case 'title':
        if (!field) {
          this.setState({
            validTitle: false,
          });
        } else {
          this.setState({
            validTitle: true,
          });
        }   
    }
  }

  validateEmail = (e) => {
    const email = e.target.value;
    if (!email || !this.validEmail(email)) {
      this.setState({
        validEmail: false,
      });
    } else {
      this.setState({
        validEmail: true,
      });
    }
  }

  validEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return (true);
    }
    return (false);
  }

  render() {
    return (
      <form className="User-Info-Form" noValidate autoComplete="off">
          <TextField
            id="firstName"
            name="firstName"
            label="First Name"
            margin="normal"
            className="User-Input"
            value={this.props.userValue.firstName}
            onChange={this.props.handleFormChange}
            variant="outlined"
            onBlur={(e) => this.validateField(e, 'first')}
            error={!this.state.validFirstName}
            helperText={!this.state.validFirstName ? 'Please enter a first name' : ' '}
          />
          <TextField
            id="lastName"
            name="lastName"
            label="Last Name"
            margin="normal"
            className="User-Input"
            value={this.props.userValue.lastName}
            onChange={this.props.handleFormChange}
            variant="outlined"
            onBlur={(e) => this.validateField(e, 'last')}
            error={!this.state.validLastName}
            helperText={!this.state.validLastName ? 'Please enter a last name' : ' '}
          />
          <TextField
            id="email"
            name="email"
            label="E-Mail"
            type="email"
            margin="normal"
            className="User-Input"
            value={this.props.userValue.email}
            onChange={this.props.handleFormChange}
            variant="outlined"
            onBlur={(e) => this.validateEmail(e)}
            error={!this.state.validEmail}
            helperText={!this.state.validEmail ? 'Please enter a valid email address' : ' '}
          />
          <TextField
            id="title"
            name="title"
            label="Title"
            margin="normal"
            className="User-Input"
            value={this.props.userValue.title}
            onChange={this.props.handleFormChange}
            variant="outlined"
            onBlur={(e) => this.validateField(e, 'title')}
            error={!this.state.validTitle}
            helperText={!this.state.validTitle ? 'Please enter a title' : ' '}    
          />
          <div>{this.props.currentView === 'edit' &&
            <Button style={{color : "#3db3e3"}} onClick={() => this.props.passwordResetLink()}>Send password reset link</Button> }</div>
          <h5>Permissions (Optional)</h5>
          <FormControl className="User-Input" margin="normal">
            <FormControlLabel
              control={
                <Checkbox
                  className="SST-Checkbox"
                  id="mmView"
                  name="mmView"
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
