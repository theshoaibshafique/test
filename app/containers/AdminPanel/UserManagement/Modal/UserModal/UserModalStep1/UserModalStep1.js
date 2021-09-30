import React from 'react';
import './style.scss';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Grid } from '@material-ui/core';
import LoadingOverlay from 'react-loading-overlay';
import UserFields from '../../../UserFields/UserFields';
import globalFuncs from 'utils/global-functions';

class UserModalStep1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsgVisible: false,
      errorMsgEmailVisible: false,
      errorMsg: 'A problem has occurred while completing your action. Please try again or contact the administrator.',
      isLoading: false,
      isEmailSent: false,
      isEmailLoading: false,
      fieldErrors: this.props.fieldErrors
    }
  }

  passwordResetLink() {
    this.setState({ isEmailLoading: true })
    globalFuncs.genericFetchWithNoReturnMessage(`${process.env.USER_API}reset_user?user_email=${encodeURIComponent(this.props.userValue.email)}`, 'PATCH', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {
          // send error to modal
          this.setState({ errorMsgVisible: true });
        } else {
          // show toast for success
          this.setState({
            isEmailSent: true
          })
        }
        this.setState({ isEmailLoading: false })
      })
  };

  addUser() {
    const { logger } = this.props;
    let fieldErrors = this.props.isFormValid();
    this.setState({ fieldErrors });
    if (Object.keys(fieldErrors).length !== 0) {
      logger?.manualAddLog('click', `add-user-errors`, fieldErrors);
      return;
    }

    this.setState({ errorMsgVisible: false, isLoading: true });
    const containsAdmin = this.props.userValue.permissions.indexOf("Admin") >= 0;

    let jsonBody = {
      "firstName": this.props.userValue.firstName,
      "lastName": this.props.userValue.lastName,
      "email": this.props.userValue.email,
      "title": this.props.userValue.title,
      "isActive": true,
      "roles": containsAdmin ? this.props.roleNames : this.props.userValue.permissions
    }
    logger?.manualAddLog('click', `add-user`);
    globalFuncs.genericFetch(`${process.env.USER_API}profile`, 'post', this.props.userToken, jsonBody)
      .then(result => {

        if (result === 'error') {
          this.setState({ errorMsgVisible: true, errorMsgEmailVisible: false, isLoading: false });
        } else if (result === 'conflict') {
          let fieldErrors = this.state.fieldErrors;
          fieldErrors.email = 'A user with this email address already exists. Please use a different email address.'
          this.setState({ errorMsgEmailVisible: true, errorMsgVisible: false, fieldErrors, isLoading: false });
        } else if (result?.conflict) {
          result.conflict.then(message => {
            message = message?.detail;
            if (message?.toLowerCase().indexOf("email") >= 0) {
              let fieldErrors = this.state.fieldErrors;
              fieldErrors.email = message
              this.setState({ errorMsgEmailVisible: true, errorMsgVisible: false, fieldErrors, isLoading: false });
            } else {
              this.setState({ errorMsgVisible: true, errorMsg: message, isLoading: false });
            }
          });
        } else {
          if (!this.state.errorMsgVisible || !this.state.errorMsgEmailVisible) {
            this.props.refreshGrid(result);
          }
        }
      })

  };

  save() {
    let fieldErrors = this.props.isFormValid();
    this.setState({ fieldErrors });
    if (Object.keys(fieldErrors).length !== 0) {
      return;
    }

    this.setState({ errorMsgVisible: false, isLoading: true });

    const containsAdmin = this.props.userValue.permissions.indexOf("Admin") >= 0;
    let jsonBody = {
      "firstName": this.props.userValue.firstName,
      "lastName": this.props.userValue.lastName,
      "email": this.props.userValue.email,
      "title": this.props.userValue.title,
      "isActive": true,
      "roles": containsAdmin ? this.props.roleNames : this.props.userValue.permissions
    }

    globalFuncs.genericFetch(`${process.env.USER_API}profile`, 'PATCH', this.props.userToken, jsonBody)
      .then(result => {
        if (result === 'error') {
          this.setState({ errorMsgVisible: true, errorMsgEmailVisible: false, isLoading: false });
        } else if (result === 'conflict') {
          this.setState({ errorMsgEmailVisible: true, errorMsgVisible: false, isLoading: false });
        } else if (result?.conflict) {
          if (result.conflict.toLowerCase().indexOf("email") >= 0) {
            let fieldErrors = this.state.fieldErrors;
            fieldErrors.email = result.conflict
            this.setState({ errorMsgEmailVisible: true, errorMsgVisible: false, fieldErrors, isLoading: false });
          } else {
            this.setState({ errorMsgVisible: true, errorMsg: result.conflict, isLoading: false });
          }
        } else {
          if (!this.state.errorMsgVisible || !this.state.errorMsgEmailVisible) {
            this.props.updateGridEdit(this.props.userValue.id, this.props.userValue);
          }
          this.setState({ isLoading: false });
        }

      })
  }

  render() {
    let isLoaded = this.props.userValue.isLoaded || (this.props.errorMsgVisible && this.props.currentView === 'edit');
    return (
      <LoadingOverlay
        active={!isLoaded && this.props.currentView === 'edit'}
        spinner
        text='Loading...'
        className="Modal User-Modal User-Modal-Step-1 ">
        {this.props.errorMsgVisible && this.props.currentView === 'edit'
          ? <Grid container spacing={2} className="" >
            <Grid item xs={12} className="">
              <Grid container spacing={2}>
                <Grid item xs={10} >
                  {this.props.currentView === 'add' ? (
                    <h5>Add User</h5>
                  ) : (
                    <h5>Edit {this.props.userValue.firstName} {this.props.userValue.lastName}</h5>
                  )}
                </Grid>
                <Grid item xs={2}>
                  <Grid container justify="flex-end">
                    <IconButton onClick={this.props.closeModal} className='close-button' disableRipple disableFocusRipple><CloseIcon fontSize='small' /></IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {(this.props.errorMsgVisible || this.state.errorMsgVisible) &&
              <Grid item xs={12}><p className="Paragraph-Error subtle-subtext">{this.props.errorMsg}</p></Grid>
            }
            <Grid item xs={12}>
              <Grid container justify="flex-end">
                <Button variant="outlined" className="primary" onClick={() => this.props.closeModal()}>
                  Close
                </Button>
              </Grid>

            </Grid>

          </Grid>
          :
          <Grid container spacing={2} className="" >
            <Grid item xs={12} className="">
              <Grid container spacing={2}>
                <Grid item xs={10} >
                  {this.props.currentView === 'add' ? (
                    <h5>Add User</h5>
                  ) : (
                    <h5>Edit {this.props.userValue.firstName} {this.props.userValue.lastName}</h5>
                  )}
                </Grid>
                <Grid item xs={2}>
                  <Grid container justify="flex-end">
                    <IconButton onClick={this.props.closeModal} className='close-button' disableRipple disableFocusRipple><CloseIcon fontSize='small' /></IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {(this.props.errorMsgVisible || this.state.errorMsgVisible) &&
              <Grid item xs={12}><p className="Paragraph-Error">{this.state.errorMsg || this.props.errorMsg}</p></Grid>
            }
            {/* {(this.props.errorMsgEmailVisible || this.state.errorMsgEmailVisible) &&
              <Grid item xs={12}><p className="Paragraph-Error">{this.state.errorMsg}</p></Grid>
            } */}

            <Grid item xs={10} >
              <UserFields
                userValue={this.props.userValue}
                handleFormChange={this.props.handleFormChange}
                currentView={this.props.currentView}
                passwordResetLink={() => this.passwordResetLink()}
                fieldErrors={this.state.fieldErrors}
                isEmailLoading={this.state.isEmailLoading}
                isEmailSent={this.state.isEmailSent}
                roleNames={this.props.roleNames}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  {this.props.currentView === 'edit' &&
                    <Button id="disable" disableElevation disableRipple variant="contained" className="secondary" style={{ float: "left" }} onClick={() => this.props.deleteUser()}>{this.props.userValue.isActive ? 'Disable User' : 'Enable User'}</Button>
                  }
                </Grid>
                <Grid item xs={6}>
                  <Grid container justify="flex-end">
                    <Grid item xs={12}>
                      <Grid container justify="flex-end" >
                        <Button id="cancel" style={{ color: "#3db3e3", marginRight: 40 }} onClick={() => this.props.closeModal()}>Cancel</Button>
                        {this.props.currentView === 'add' ? (
                          <Button id="add" variant="outlined" className="primary" disabled={(this.state.isLoading)} onClick={() => this.addUser()}>
                            {(this.state.isLoading) ? <div className="loader"></div> : 'Add'}
                          </Button>
                        ) : (
                          <Button id="save" variant="outlined" className="primary" disabled={(this.state.isLoading)} onClick={() => this.save()}>
                            {(this.state.isLoading) ? <div className="loader"></div> : 'Save'}
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
      </LoadingOverlay>
    );
  }
}

export default UserModalStep1;