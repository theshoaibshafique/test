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
    let jsonBody = {
      "userName": this.props.userValue.currentUser
    }
    this.setState({ isEmailLoading: true })
    globalFuncs.genericFetchWithNoReturnMessage(process.env.USERMANAGEMENTRESET_API, 'PATCH', this.props.userToken, jsonBody)
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
    let fieldErrors = this.props.isFormValid();
    this.setState({ fieldErrors });
    if (Object.keys(fieldErrors).length !== 0) {
      return;
    }

    this.setState({ errorMsgVisible: false, isLoading: true });

    let jsonBody = {
      "firstName": this.props.userValue.firstName,
      "lastName": this.props.userValue.lastName,
      "email": this.props.userValue.email,
      "title": this.props.userValue.title,
      "facilityName": this.props.facilityName,
      "preferredLanguage": 'en-US',
      "active": true,
      "sendEmail": true
    }

    globalFuncs.genericFetch(process.env.USERMANAGEMENT_API, 'post', this.props.userToken, jsonBody)
      .then(result => {
        if (result === 'error') {
          this.setState({ errorMsgVisible: true, errorMsgEmailVisible: false, isLoading: false });
        } else if (result === 'conflict') {
          let fieldErrors = this.state.fieldErrors;
          fieldErrors.email = 'A user with this email address already exists. Please use a different email address.'
          this.setState({ errorMsgEmailVisible: true, errorMsgVisible: false, fieldErrors, isLoading: false });
        } else if (result && result.conflict) {
          result.conflict.then(message => {
            if (message && message.toLowerCase().indexOf("email") >= 0) {
              let fieldErrors = this.state.fieldErrors;
              fieldErrors.email = message
              this.setState({ errorMsgEmailVisible: true, errorMsgVisible: false, fieldErrors, isLoading: false });
            } else {
              this.setState({ errorMsgVisible: true, errorMsg: message, isLoading: false });
            }
          });
        } else {
          // add roles
          let jsonBody;
          let jsonList = [];
          if (this.props.userValue.permissions.indexOf("6AD12264-46FA-8440-52AD1846BDF1_Admin") >= 0) {
            jsonBody = {
              "userName": result,
              "appName": '6AD12264-46FA-8440-52AD1846BDF1',
              "roleNames": ['Admin']
            }
            jsonList.push(jsonBody); // User Management

            jsonBody = {
              "userName": result,
              "appName": '5E451021-9E5B-4C5D-AC60-53109DAE7853',
              "roleNames": ['Admin']
            }
            jsonList.push(jsonBody); // Location

            jsonBody = {
              "userName": result,
              "appName": 'FF9C8C7C-2404-4DC0-9768-942649032327',
              "roleNames": ['Admin']
            }

            jsonList.push(jsonBody); //Lookup

            jsonBody = {
              "userName": result,
              "appName": '35840EC2-8FA4-4515-AF4F-D90BD2A303BA',
              "roleNames": ['Admin', 'Enhanced M&M View', 'Enhanced M&M Edit', 'Surgical Checklist', 'Efficiency', 'Enhanced M&M Presenter']
            }
            jsonList.push(jsonBody); // Insights
            globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_MULTI_API, 'post', this.props.userToken, jsonList) 
              .then(result => {
                if (result === 'error' || result === 'conflict') {
                  this.setState({ errorMsgVisible: true });
                }
              });
          } else {
            let rolesNames = [];
            if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M View") >= 0) {
              rolesNames.push('Enhanced M&M View');
            }

            if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Edit") >= 0) {
              rolesNames.push('Enhanced M&M Edit');
            }

            if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Surgical Checklist") >= 0) {
              rolesNames.push('Surgical Checklist');
            }

            if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Efficiency") >= 0) {
              rolesNames.push('Efficiency');
            }

            if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Presenter") >= 0) {
              rolesNames.push('Enhanced M&M Presenter');
            }

            if (rolesNames.length > 0) {
              jsonBody = {
                "userName": result,
                "appName": '35840EC2-8FA4-4515-AF4F-D90BD2A303BA',
                "roleNames": rolesNames
              }

              globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'post', this.props.userToken, jsonBody)
                .then(result => {
                  if (result === 'error' || result === 'conflict') {
                    this.setState({ errorMsgVisible: true });
                  }
                });
            }
          }

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

    let jsonBody = {
      "userName": this.props.userValue.currentUser,
      "firstName": this.props.userValue.firstName,
      "lastName": this.props.userValue.lastName,
      "email": this.props.userValue.email,
      "title": this.props.userValue.title,
      "preferredLanguage": this.props.userValue.preferredLanguage,
      "active": this.props.userValue.active
    }

    globalFuncs.genericFetchWithNoReturnMessage(process.env.USERMANAGEMENT_API, 'PATCH', this.props.userToken, jsonBody)
      .then(result => {
        if (result === 'error') {
          this.setState({ errorMsgVisible: true, errorMsgEmailVisible: false, isLoading: false });
        } else if (result === 'conflict') {
          this.setState({ errorMsgEmailVisible: true, errorMsgVisible: false, isLoading: false });
        } else if (result && result.conflict) {
          if (result.conflict.toLowerCase().indexOf("email") >= 0) {
            let fieldErrors = this.state.fieldErrors;
            fieldErrors.email = result.conflict
            this.setState({ errorMsgEmailVisible: true, errorMsgVisible: false, fieldErrors, isLoading: false });
          } else {
            this.setState({ errorMsgVisible: true, errorMsg: result.conflict, isLoading: false });
          }
        } else {
          // update roles
          this.setState({ errorMsgVisible: false, errorMsgEmailVisible: false });
          let jsonBody;
          let jsonList = [];
          if (this.props.userValue.permissions.indexOf("6AD12264-46FA-8440-52AD1846BDF1_Admin") >= 0) {
            jsonBody = {
              "userName": this.props.userValue.currentUser,
              "appName": '6AD12264-46FA-8440-52AD1846BDF1',
              "roleNames": ['Admin']
            }
            jsonList.push(jsonBody);

            jsonBody = {
              "userName": this.props.userValue.currentUser,
              "appName": '5E451021-9E5B-4C5D-AC60-53109DAE7853',
              "roleNames": ['Admin']
            }
            jsonList.push(jsonBody);

            jsonBody = {
              "userName": this.props.userValue.currentUser,
              "appName": 'FF9C8C7C-2404-4DC0-9768-942649032327',
              "roleNames": ['Admin']
            }
            jsonList.push(jsonBody);

            jsonBody = {
              "userName": this.props.userValue.currentUser,
              "appName": '35840EC2-8FA4-4515-AF4F-D90BD2A303BA',
              "roleNames": ['Admin', 'Enhanced M&M View', 'Enhanced M&M Edit', 'Surgical Checklist', 'Efficiency', 'Enhanced M&M Presenter']
            }
            jsonList.push(jsonBody); // Insights

            globalFuncs.genericFetchWithNoReturnMessage(process.env.USERMANAGEMENTUSERROLES_MULTI_API, 'PUT', this.props.userToken, jsonList) 
              .then(result => {
                if (result === 'error' || result === 'conflict') {
                  // send error to modal
                  this.setState({ errorMsgVisible: true });
                }
                this.setState({ isLoading: false });
              })
              .then(result => {
                if (!this.state.errorMsgVisible || !this.state.errorMsgEmailVisible) {
                  this.props.updateGridEdit(this.props.userValue.id, this.props.userValue);
                }
                this.setState({ isLoading: false });
              });
          } else { // remove roles
            jsonBody = {
              "userName": this.props.userValue.currentUser,
              "appName": '6AD12264-46FA-8440-52AD1846BDF1',
              "roleNames": []
            }
            jsonList.push(jsonBody);

            jsonBody = {
              "userName": this.props.userValue.currentUser,
              "appName": '5E451021-9E5B-4C5D-AC60-53109DAE7853',
              "roleNames": []
            }
            jsonList.push(jsonBody);

            jsonBody = {
              "userName": this.props.userValue.currentUser,
              "appName": 'FF9C8C7C-2404-4DC0-9768-942649032327',
              "roleNames": []
            }
            jsonList.push(jsonBody);

            let rolesNames = [];  // will add in the selected insights role and remove Admin
            if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M View") >= 0) {
              rolesNames.push('Enhanced M&M View');
            }

            if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Edit") >= 0) {
              rolesNames.push('Enhanced M&M Edit');
            }

            if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Surgical Checklist") >= 0) {
              rolesNames.push('Surgical Checklist');
            }

            if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Efficiency") >= 0) {
              rolesNames.push('Efficiency');
            }

            if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Presenter") >= 0) {
              rolesNames.push('Enhanced M&M Presenter');
            }

            jsonBody = {
              "userName": this.props.userValue.currentUser,
              "appName": '35840EC2-8FA4-4515-AF4F-D90BD2A303BA',
              "roleNames": rolesNames
            }
            jsonList.push(jsonBody);

            globalFuncs.genericFetchWithNoReturnMessage(process.env.USERMANAGEMENTUSERROLES_MULTI_API, 'PUT', this.props.userToken, jsonList)
              .then(result => {
                if (result === 'error' || result === 'conflict') {
                  // send error to modal
                  this.setState({ errorMsgVisible: true });
                }
                this.setState({ isLoading: false });
              })
              .then(result => {
                if (!this.state.errorMsgVisible || !this.state.errorMsgEmailVisible) {
                  this.props.updateGridEdit(this.props.userValue.id, this.props.userValue);
                }
                this.setState({ isLoading: false });
              });
          }
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
                    <Button disableElevation disableRipple variant="contained" className="secondary" style={{ float: "left" }} onClick={() => this.props.deleteUser()}>{this.props.userValue.active ? 'Disable User' : 'Enable User'}</Button>
                  }
                </Grid>
                <Grid item xs={6}>
                  <Grid container justify="flex-end">
                    <Grid item xs={12}>
                      <Grid container justify="flex-end" >
                        <Button style={{ color: "#3db3e3", marginRight: 40 }} onClick={() => this.props.closeModal()}>Cancel</Button>
                        {this.props.currentView === 'add' ? (
                          <Button variant="outlined" className="primary" disabled={(this.state.isLoading)} onClick={() => this.addUser()}>
                            {(this.state.isLoading) ? <div className="loader"></div> : 'Add'}
                          </Button>
                        ) : (
                            <Button variant="outlined" className="primary" disabled={(this.state.isLoading)} onClick={() => this.save()}>
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