import React from 'react';
import './style.scss';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Grid } from '@material-ui/core';
import UserFields from '../../../UserManager/UserFields/UserFields'
import globalFuncs from '../../../../utils/global-functions';
import LoadingOverlay from 'react-loading-overlay';

class UserModalStep1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsgVisible: false,
      errorMsgEmailVisible: false,
      errorMsg: 'A user with this email address already exists. Please use a different email address.',
      isLoading: false,
      fieldErrors: this.props.fieldErrors
    }
  }

  addUser(){
    if (!this.props.isFormValid()){
      return; 
    }

    this.setState({ errorMsgVisible: false, isLoading: true });

    let jsonBody = {
      "firstName": this.props.userValue.firstName,
      "lastName": this.props.userValue.lastName,
      "email": this.props.userValue.email,
      "title": this.props.userValue.title,
      "departmentName": this.props.userValue.department,
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
        this.setState({ errorMsgEmailVisible: true, errorMsgVisible: false ,fieldErrors, isLoading: false});
      } else {
        // add roles
        let jsonBody;
        
        if (this.props.userValue.permissions.indexOf("6AD12264-46FA-8440-52AD1846BDF1_Admin") >= 0) {
          jsonBody = {
            "userName": result,
            "appName": '6AD12264-46FA-8440-52AD1846BDF1',
            "roleNames": ['Admin']
          }

          globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'post', this.props.userToken, jsonBody) // User management
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              this.setState({ errorMsgVisible: true });
            }
          });

          jsonBody = {
            "userName": result,
            "appName": '5E451021-9E5B-4C5D-AC60-53109DAE7853',
            "roleNames": ['Admin']
          }

          globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'post', this.props.userToken, jsonBody) // Location
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              this.setState({ errorMsgVisible: true });
            }
          });

          jsonBody = {
            "userName": result,
            "appName": '35840EC2-8FA4-4515-AF4F-D90BD2A303BA',
            "roleNames": ['Admin', 'Enhanced M&M View', 'Enhanced M&M Edit']
          }

          globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'post', this.props.userToken, jsonBody) // Insights
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

        if (!this.state.errorMsgVisible && !this.state.errorMsgEmailVisible) {
          this.props.refreshGrid(result);
        }
      }
    })
    
  };
  
  save() {

    if (!this.props.isFormValid()){
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
        this.setState({ errorMsgVisible: true, errorMsgEmailVisible: false, isLoading: false});
      } else if (result === 'conflict') {
        this.setState({ errorMsgEmailVisible: true, errorMsgVisible: false, isLoading: false });
      } else {
        // update roles
        this.setState({ errorMsgVisible: false, errorMsgEmailVisible: false, isLoading: false });
        let jsonBody;
        
        if (this.props.userValue.permissions.indexOf("6AD12264-46FA-8440-52AD1846BDF1_Admin") >= 0) {
          jsonBody = {
            "userName": this.props.userValue.currentUser,
            "appName": '6AD12264-46FA-8440-52AD1846BDF1',
            "roleNames": ['Admin']
          }

          globalFuncs.genericFetchWithNoReturnMessage(process.env.USERMANAGEMENTUSERROLES_API, 'PUT', this.props.userToken, jsonBody) // User management
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              // send error to modal
              this.setState({ errorMsgVisible: true, isLoading: false });
            }
          });

          jsonBody = {
            "userName": this.props.userValue.currentUser,
            "appName": '5E451021-9E5B-4C5D-AC60-53109DAE7853',
            "roleNames": ['Admin']
          }

          globalFuncs.genericFetchWithNoReturnMessage(process.env.USERMANAGEMENTUSERROLES_API, 'PUT', this.props.userToken, jsonBody) // Location
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              // send error to modal
              this.setState({ errorMsgVisible: true, isLoading: false });
            }
          });

          jsonBody = {
            "userName": this.props.userValue.currentUser,
            "appName": '35840EC2-8FA4-4515-AF4F-D90BD2A303BA',
            "roleNames": ['Admin', 'Enhanced M&M View', 'Enhanced M&M Edit']
          }

          globalFuncs.genericFetchWithNoReturnMessage(process.env.USERMANAGEMENTUSERROLES_API, 'PUT', this.props.userToken, jsonBody) // Insights
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              // send error to modal
              this.setState({ errorMsgVisible: true, isLoading: false });
            }
          })
          .then(result => {
            if (!this.state.errorMsgVisible || !this.state.errorMsgEmailVisible) {
              this.props.updateGridEdit(this.props.userValue.id);
              this.setState({ isLoading: false });
            }
          });
        } else { // remove roles
          jsonBody = {
            "userName": this.props.userValue.currentUser,
            "appName": '6AD12264-46FA-8440-52AD1846BDF1',
            "roleNames": []
          }

          globalFuncs.genericFetchWithNoReturnMessage(process.env.USERMANAGEMENTUSERROLES_API, 'PUT', this.props.userToken, jsonBody) // User management
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              // send error to modal
              this.setState({ errorMsgVisible: true, isLoading: false });
            }
          });

          jsonBody = {
            "userName": this.props.userValue.currentUser,
            "appName": '5E451021-9E5B-4C5D-AC60-53109DAE7853',
            "roleNames": []
          }

          globalFuncs.genericFetchWithNoReturnMessage(process.env.USERMANAGEMENTUSERROLES_API, 'PUT', this.props.userToken, jsonBody) // Location
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              // send error to modal
              this.setState({ errorMsgVisible: true, isLoading: false });
            }
          });

          let rolesNames = [];  // will add in the selected insights role and remove Admin
          if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M View") >= 0) {
            rolesNames.push('Enhanced M&M View');
          }
  
          if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Edit") >= 0) {
            rolesNames.push('Enhanced M&M Edit');
          }
  
          jsonBody = {
            "userName": this.props.userValue.currentUser,
            "appName": '35840EC2-8FA4-4515-AF4F-D90BD2A303BA',
            "roleNames": rolesNames
          }
  
          globalFuncs.genericFetchWithNoReturnMessage(process.env.USERMANAGEMENTUSERROLES_API, 'PUT', this.props.userToken, jsonBody)
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              // send error to modal
              this.setState({ errorMsgVisible: true, isLoading: false });
            }
          })
          .then(result => {
            if (!this.state.errorMsgVisible || !this.state.errorMsgEmailVisible) {
              this.props.updateGridEdit(this.props.userValue.id);
              this.setState({ isLoading: false });
            }
          });
        }
      }
    })
  }

  render() {
    let isLoaded = this.props.userValue.isLoaded;
    return (
      <LoadingOverlay
          active={!isLoaded && this.props.currentView === 'edit'}
          spinner
          text='Loading...'
          className="Modal User-Modal User-Modal-Step-1 ">
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
                    <IconButton onClick={this.props.closeModal}><CloseIcon fontSize='small'/></IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            
            {(this.props.errorMsgVisible || this.state.errorMsgVisible) &&
              <Grid item xs={12}><p className="Paragraph-Error">{this.props.errorMsg}</p></Grid>
            }
            {/* {(this.props.errorMsgEmailVisible || this.state.errorMsgEmailVisible) &&
              <Grid item xs={12}><p className="Paragraph-Error">{this.state.errorMsg}</p></Grid>
            } */}
            
            <Grid item xs={10} >
              <UserFields
                userValue={this.props.userValue}
                handleFormChange={this.props.handleFormChange}
                currentView={this.props.currentView}
                passwordResetLink={this.props.passwordResetLink}
                fieldErrors={this.props.fieldErrors}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  {this.props.currentView === 'edit' &&
                    <Button disableElevation disableRipple variant="contained" className="secondary" style={{float: "left"}} onClick={() => this.props.deleteUser()}>{this.props.userValue.active ? 'Disable User' : 'Enable User'}</Button>
                  }
                </Grid>
                <Grid item xs={6}>
                  <Grid container justify="flex-end">
                    <Grid item xs={12}>
                      <Grid container justify="flex-end" >
                      <Button style={{color : "#3db3e3",marginRight:40}} onClick={() => this.props.closeModal()}>Cancel</Button>
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
      </LoadingOverlay>
    );
  }
}

export default UserModalStep1;