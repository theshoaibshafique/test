import React from 'react';
import './style.scss';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Grid, Tooltip, withStyles} from '@material-ui/core';
import Icon from '@mdi/react'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);


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
    var EMAIL_REGEX = process.env.ALLOW_PLUS_EMAILS
      ? /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (EMAIL_REGEX.test(email)) {
      return (true);
    }
    return (false);
  }

  includesRole(role) {
    if (!this.props.roleNames || this.props.roleNames.length == 0) {
      return false;
    }
    let regex = new RegExp(this.props.roleNames.join("|"), "i");
    return regex.test(role);
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
            size="small"
            className="input-field"
            value={this.props.userValue.firstName}
            onChange={this.props.handleFormChange}
            variant="outlined"
            onBlur={(e) => this.validateField(e, 'first')}
            error={!this.state.validFirstName || Boolean(this.props.fieldErrors.firstName)}
            helperText={!this.state.validFirstName ? 'Please enter a first name' : this.props.fieldErrors.firstName}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="lastName"
            name="lastName"
            size="small"
            className="input-field"
            value={this.props.userValue.lastName}
            onChange={this.props.handleFormChange}
            variant="outlined"
            onBlur={(e) => this.validateField(e, 'last')}
            error={!this.state.validLastName || Boolean(this.props.fieldErrors.lastName)}
            helperText={!this.state.validLastName ? 'Please enter a last name' : this.props.fieldErrors.lastName}
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
                  {this.props.isEmailLoading
                    ? <div className="loader" ></div>
                    : (this.props.isEmailSent
                      ? <div className="input-title">Email Sent!</div>
                      : <a className="link" onClick={this.props.passwordResetLink}>Send password reset link</a>)}

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
            size="small"
            type="email"
            className="input-field"
            value={this.props.userValue.email}
            onChange={this.props.handleFormChange}
            disabled={this.props.currentView === 'edit'}
            variant="outlined"
            onBlur={(e) => this.validateEmail(e)}
            error={!this.state.validEmail || Boolean(this.props.fieldErrors.email)}
            helperText={!this.state.validEmail ? 'Please enter a valid email address' : this.props.fieldErrors.email}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="title"
            name="title"
            size="small"
            className="input-field"
            value={this.props.userValue.title}
            onChange={this.props.handleFormChange}
            variant="outlined"
            onBlur={(e) => this.validateField(e, 'title')}
            error={!this.state.validTitle || Boolean(this.props.fieldErrors.title)}
            helperText={!this.state.validTitle ? 'Please enter a title' : this.props.fieldErrors.title}
          />
        </Grid>
        <Grid item xs={12} className="subtitle">
          Permissions (Optional)
        </Grid>
        <Grid item xs={12} style={{ paddingTop: 0 }}>
          <FormControl className="input-field permissions-checkbox" >
            {this.includesRole("Admin") && <FormControlLabel
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
            />}
            {this.includesRole("Enhanced M&M View") && <FormControlLabel
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
                  checked={this.checkPermissions("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M View")}
                  value="35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M View"
                />
              }
              label="Enhanced M&M View Report"
            />}
            {this.includesRole("Enhanced M&M Edit") && <FormControlLabel
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
                  checked={this.checkPermissions("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Edit")}
                  value="35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Edit"
                />
              }
              label="Enhanced M&M Request"
            />}
            {this.includesRole("Enhanced M&M Presenter") && <FormControlLabel
              control={
                <Checkbox
                  disableRipple
                  icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
                  checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
                  className="SST-Checkbox"
                  id="presenterAccess"
                  name="presenterAccess"
                  disabled={isAdmin}
                  onChange={this.props.handleFormChange}
                  checked={this.checkPermissions("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Presenter")}
                  value="35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Presenter"
                />
              }
              label={<div>Enhanced M&M Presenter<LightTooltip interactive arrow title={"This permission enables the user to access Presentation Mode for Enhanced M&M Reports. Presentation Mode will cause the videos to no longer be secured but will enable sharing over video conferencing tools. This feature can be found above the video player for each report."} placement="top" fontSize="small">
                <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
              </LightTooltip></div>}
            />}
            {this.includesRole("Surgical Checklist") && <FormControlLabel
              control={
                <Checkbox
                  disableRipple
                  icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
                  checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
                  className="SST-Checkbox"
                  id="sscAccess"
                  name="sscAccess"
                  disabled={isAdmin}
                  onChange={this.props.handleFormChange}
                  checked={this.checkPermissions("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Surgical Checklist")}
                  value="35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Surgical Checklist"
                />
              }
              label="Surgical Safety Checklist"
            />}
            {this.includesRole("Efficiency") && <FormControlLabel
              control={
                <Checkbox
                  disableRipple
                  icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
                  checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
                  className="SST-Checkbox"
                  id="efficiencyAccess"
                  name="efficiencyAccess"
                  disabled={isAdmin}
                  onChange={this.props.handleFormChange}
                  checked={this.checkPermissions("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Efficiency")}
                  value="35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Efficiency"
                />
              }
              label="Efficiency"
            />}
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}

export default UserFields;