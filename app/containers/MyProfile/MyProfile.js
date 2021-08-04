import React from 'react';
import Button from '@material-ui/core/Button';
import globalFuncs from '../../utils/global-functions';
import './style.scss';
import { IconButton, InputLabel, makeStyles, TextField, withStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import globalFunctions from '../../utils/global-functions';
const styles = theme => ({
  input: {
    '&:before': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.0)'
    },
  },
  label: {
    fontSize: 18,
    marginRight: 20
  },
  header: {
    marginTop: 24,
    marginBottom: 10
  }

});

function EField(props) {
  const { value, handleChange, isEdit, label } = props;
  const inputProps = {
    className: props.classes.input, // usually you dont need this and you only need classes, but just wanted to show that you can use
  };
  const labelProps = { className: props.classes.label };
  var errorMessage = null;
  if (label == 'Email' && !globalFunctions.validEmail(value)){
    errorMessage = 'Please enter a valid email address';
  } else if (!value){
    errorMessage = `Please enter a ${label.toLowerCase()}`
  }
  if (isEdit)
    return (<div>
      <InputLabel className={props.classes.header}>{label}</InputLabel>
      <TextField
        size="small"
        id="filled-start-adornment"
        fullWidth
        className="user-field"
        placeholder={label}
        onChange={(e, v) => handleChange(e)}
        value={value}
        InputProps={inputProps}
        InputLabelProps={labelProps}
        error={errorMessage}
        helperText={errorMessage}
        variant="outlined"
      />
    </div>)
  return (<div>
    <InputLabel className={props.classes.header}>{label}</InputLabel>
    <div className="normal-text" style={{ marginBottom: 24 }}>{value}</div>
  </div>)
}
const EditableField = withStyles(styles)(EField);
export default class MyProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    }
  }
  redirect(type, url) {
    window.location.replace(`${process.env.AUTH_LOGIN}update`)
  }

  handleChange(key, value) {
    if (key == 'isEdit' && !value) {
      this.reset();
    }
    this.setState({ [key]: value })
  }

  reset() {
    this.setState({ ...this.props, isEdit:false })
  }

  isValid(){
    const { firstName, lastName, email, jobTitle} = this.state;
    const current = JSON.stringify({firstName, lastName, email, jobTitle })
    const old = JSON.stringify({firstName:this.props.firstName,lastName:this.props.lastName, email:this.props.email, jobTitle: this.props.jobTitle})

    return firstName && lastName && email && jobTitle && globalFuncs.validEmail(email) && old != current;
  }

  submit() {
    this.setState({ isLoading: true })
    const { firstName, lastName, email, jobTitle } = this.state;
    const { roles } = this.props;
    const jsonBody = {
      firstName, lastName, email, title: jobTitle, roles, isActive: true
    }
    globalFuncs.genericFetch(`${process.env.USER_API}profile`, 'PATCH', this.props.userToken, jsonBody)
      .then(result => {
        if (result == 'error') {

        } else {
          this.props.setProfile(result);
          this.setState({ isEdit: false });
        }
      }).finally(() => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    const { firstName, lastName, email, jobTitle, isEdit } = this.state;
    return (
      <section className="my-profile">
        <div><p className="profile-title">My Profile {!isEdit && <IconButton onClick={() => this.handleChange('isEdit', !isEdit)}>
          <EditIcon />
        </IconButton>}</p></div>

        <div className="profile-box">
          <EditableField
            label="First Name"
            handleChange={(e, v) => this.handleChange('firstName', e.target.value)}
            value={firstName}
            isEdit={isEdit}
          />
          <EditableField
            label="Last Name"
            handleChange={(e, v) => this.handleChange('lastName', e.target.value)}
            value={lastName}
            isEdit={isEdit}
          />
          <EditableField
            label="Email"
            handleChange={(e, v) => this.handleChange('email', e.target.value)}
            value={email}
            isEdit={isEdit}
          />
          <EditableField
            label="Title"
            handleChange={(e, v) => this.handleChange('jobTitle', e.target.value)}
            value={jobTitle}
            isEdit={isEdit}
          />
        </div>
        <div ></div>
        <div className="buttons" hidden={!isEdit}>
          <Button disableRipple disableElevation id="reset" variant="contained" className="secondary reset" onClick={() => this.reset()}>Cancel</Button>
          <Button disableRipple disableElevation id="save" variant="outlined" className="primary" disabled={(this.state.isLoading) || !this.isValid()} onClick={() => this.submit()}>
            {(this.state.isLoading) ? <div className="loader"></div> : 'Save'}</Button>
        </div>

        <div className="user-info-buttons" style={{ marginTop: 40 }}><Button disableRipple disableElevation variant="contained" className="secondary" target="_blank" onClick={() => this.redirect()}>Change Password</Button></div>
        <div className="user-info-buttons"><Button disableRipple disableElevation variant="contained" className="secondary" target="_blank" onClick={() => this.redirect()}>Change MFA Method</Button></div>
      </section>
    );
  }
}
