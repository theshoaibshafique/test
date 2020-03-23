import React from 'react';
import './style.scss';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';

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
    const isAdmin = this.checkPermissions("6AD12264-46FA-8440-52AD1846BDF1_Admin");
    return (
      <Grid container spacing={2}>
        <Grid item xs={6} className="input-title">
          First Name
        </Grid>
        <Grid item xs={6} className="input-title">
          Last Name
        </Grid>
        <Grid item xs={6}>
          <TextField
              id="firstName"
              name="firstName"
              className="input-field"
              value={this.props.userValue.firstName}
              onChange={this.props.handleFormChange}
              variant="outlined"
              onBlur={(e) => this.validateField(e, 'first')}
              error={!this.state.validFirstName}
              helperText={!this.state.validFirstName ? 'Please enter a first name' : ' '}
            />
        </Grid>
        <Grid item xs={6}>
        <TextField
            id="lastName"
            name="lastName"
            className="input-field"
            value={this.props.userValue.lastName}
            onChange={this.props.handleFormChange}
            variant="outlined"
            onBlur={(e) => this.validateField(e, 'last')}
            error={!this.state.validLastName}
            helperText={!this.state.validLastName ? 'Please enter a last name' : ' '}
          />
        </Grid>
        <Grid item xs={6} className="input-title">
          <Grid container spacing={2}>
            <Grid item xs={4}>
            Email
            </Grid>
            {this.props.currentView === 'edit' &&
            <Grid item xs={8}>
              <Grid container justify="flex-end">
              <Button className="link" onClick={() => this.props.passwordResetLink()}>Send password reset link</Button> 
              </Grid>
              
            </Grid>
            }
            
          </Grid>
          
          
        </Grid>
        <Grid item xs={6} className="input-title">
          Title
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="email"
            name="email"
            type="email"
            className="input-field"
            value={this.props.userValue.email}
            onChange={this.props.handleFormChange}
            variant="outlined"
            onBlur={(e) => this.validateEmail(e)}
            error={!this.state.validEmail}
            helperText={!this.state.validEmail ? 'Please enter a valid email address' : ' '}
          />
        </Grid>
        <Grid item xs={6}>
        <TextField
            id="title"
            name="title"
            className="input-field"
            value={this.props.userValue.title}
            onChange={this.props.handleFormChange}
            variant="outlined"
            onBlur={(e) => this.validateField(e, 'title')}
            error={!this.state.validTitle}
            helperText={!this.state.validTitle ? 'Please enter a title' : ' '}    
          />
        </Grid>

        <Grid item xs={12} className="subtitle">
          Permissions (Optional)
        </Grid>
        <Grid item xs={12} style={{paddingTop:0}}>
          <FormControl className="input-field permissions-checkbox" >
              <FormControlLabel
                control={
                  <Checkbox
                  disableRipple 
                  icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
                  checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
                    className="SST-Checkbox"
                    id="userManagement"
                    name="userManagement"
                    onChange={this.props.handleFormChange}
                    checked={isAdmin}
                    value="6AD12264-46FA-8440-52AD1846BDF1_Admin"
                  />
                }
                label="Admin"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disableRipple 
                    icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
                    checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
                    className="SST-Checkbox"
                    id="mmView"
                    name="mmView"
                    disabled={isAdmin}
                    onChange={this.props.handleFormChange}
                    checked={this.checkPermissions("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M View") || isAdmin}
                    value="35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M View"
                  />
                }
                label="Enhanced M&M View"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disableRipple 
                    icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
                    checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
                    className="SST-Checkbox"
                    id="mmEdit"
                    name="mmEdit"
                    disabled={isAdmin}
                    onChange={this.props.handleFormChange}
                    checked={this.checkPermissions("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Edit") || isAdmin}
                    value="35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Edit"
                  />
                }
                label="Enhanced M&M Request"
              />
            </FormControl>
        </Grid>
      </Grid>
    );
  }
}

export default UserFields;
