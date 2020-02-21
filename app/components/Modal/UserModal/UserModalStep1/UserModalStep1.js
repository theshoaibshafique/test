import React from 'react';
import './style.scss';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import UserFields from '../../../UserManager/UserFields/UserFields'
import globalFuncs from '../../../../utils/global-functions';

class UserModalStep1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsgVisible: false,
      errorMsg: 'Email exists, please enter another email address.'
    }
  }
  
  save() {
    let jsonBody = {
      "userName": this.props.userValue.currentUser,
      "firstName": this.props.userValue.firstName,
      "lastName": this.props.userValue.lastName,
      "email": this.props.userValue.email,
      "title": this.props.userValue.title,
      "preferredLanguage": this.props.userValue.preferredLanguage,
      "active": this.props.userValue.active
    }

    globalFuncs.genericFetch(process.env.USERMANAGEMENT_API, 'PATCH', this.props.userToken, jsonBody)
    .then(result => {
      if (result === 'error') {
        this.setState({ errorMsgVisible: true,  errorMsg: ''});
      } else if (result === 'conflict') {
        this.setState({ errorMsgVisible: true });
      } else {
        // update roles
        this.setState({ errorMsgVisible: false });
        let jsonBody;
        if (this.props.userValue.permissions.indexOf("6AD12264-46FA-8440-52AD1846BDF1_Admin") >= 0) {
          jsonBody = {
            "userName": this.props.userValue.currentUser,
            "appName": '6AD12264-46FA-8440-52AD1846BDF1',
            "roleNames": ['Admin']
          }

          globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'PUT', this.props.userToken, jsonBody)
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              // send error to modal
              this.setState({ errorMsgVisible: true });
            }
          });
        }
          
        let rolesNames = [];
        if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_EnhancedM&MView") >= 0) {
          rolesNames.push('EnhancedM&MView');
        }

        if (this.props.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Edit") >= 0) {
          rolesNames.push('Enhanced M&M Edit');
        }

        if (rolesNames.length > 0) {
          jsonBody = {
            "userName": this.props.userValue.currentUser,
            "appName": '35840EC2-8FA4-4515-AF4F-D90BD2A303BA',
            "roleNames": rolesNames
          }

          globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'PUT', this.props.userToken, jsonBody)
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              // send error to modal
              this.setState({ errorMsgVisible: true });
            }
          });
        }
      }

      if (!this.state.errorMsgVisible && !this.props.errorMsgVisible) {
        this.props.refreshGrid();
      }
    })
  }

  render() {
    return (
        <div className="Modal User-Modal User-Modal-Step-1">
          <div className="ToolBar">
            {this.props.currentView === 'add' ? (
              <h5>Add User</h5>
              ) : (
              <h5>Edit {this.props.userValue.firstName} {this.props.userValue.lastName}</h5>
            )}
            <IconButton onClick={this.props.closeModal}><CloseIcon fontSize='small'/></IconButton>
          </div>
          <div>
            {(this.props.errorMsgVisible || this.state.errorMsgVisible) &&
              <p className="Paragraph-Error">{this.props.errorMsg}</p>
            }
            {(this.props.errorMsgVisible || this.state.errorMsgVisible) &&
              <p className="Paragraph-Error">{this.state.errorMsg}</p>
            }
          </div>
          <UserFields
            userValue={this.props.userValue}
            handleFormChange={this.props.handleFormChange}
            currentView={this.props.currentView}
            passwordResetLink={this.props.passwordResetLink}
          />
          <div className="Button-Row right-align">
            {this.props.currentView === 'edit' &&
              <Button variant="contained" className="secondary" style={{float: "left"}} onClick={() => this.props.deleteUser()}>{this.props.userValue.active ? 'Disable User' : 'Enable User'}</Button>
            }
            <Button style={{color : "#3db3e3"}} onClick={() => this.props.closeModal()}>Cancel</Button>
            {this.props.currentView === 'add' ? (
              <Button variant="contained" className="primary" onClick={() => this.props.addUser()}>Add</Button>
            ) : (
              <Button variant="contained" className="primary" onClick={() => this.save()}>Save</Button>
            )}
          </div>
        </div>
    );
  }
}

export default UserModalStep1;