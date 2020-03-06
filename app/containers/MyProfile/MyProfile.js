import React from 'react';
import Button from '@material-ui/core/Button';
import './style.scss';

export default class MyProfile extends React.PureComponent {
  componentDidMount() {
    this.props.notLoading();
  };

  render() {
    return (
      <section>
        <div><p className="profile-title">My Profile</p></div>
        
        <div className="profile-box">
          <div className="user-info">
            <div className="first-column">First Name</div> <div>Last Name</div>
          </div>
          <div className="user-info user-info-font">
            <div className="first-column bottom-spacer">{this.props.firstName}</div> <div className="bottom-spacer">{this.props.lastName}</div>
          </div>
          <div className="user-info">
            <div className="first-column">Email</div> <div className="left-align">Title</div>
          </div>
          <div className="user-info user-info-font">
            <div className="first-column bottom-spacer">{this.props.email}</div> <div className="bottom-spacer">{this.props.jobTitle ? this.props.jobTitle : 'N/A'}</div>
          </div>
        </div>
        
        <div className="user-info-buttons">
          <p><Button variant="contained" className="secondary" target="_blank" href="https://SSTapps.b2clogin.com/SSTapps.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1A_default_password_change&client_id=99ed3764-67fc-4549-9458-626c0d92f228&nonce=defaultNonce&redirect_uri=https%3A%2F%2Finsights.surgicalsafety.com&scope=openid&response_type=id_token&prompt=login">Change Password</Button> </p>
          <p><Button variant="contained" className="secondary" target="_blank" href="https://SSTapps.b2clogin.com/SSTapps.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1A_Edit_MFA&client_id=99ed3764-67fc-4549-9458-626c0d92f228&nonce=defaultNonce&redirect_uri=https%3A%2F%2Finsights.surgicalsafety.com&scope=openid&response_type=id_token&prompt=login">Change Phone Number</Button> </p>
        </div>
      </section>
    );
  }
}