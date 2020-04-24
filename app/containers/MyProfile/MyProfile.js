import React from 'react';
import Button from '@material-ui/core/Button';
import './style.scss';

export default class MyProfile extends React.PureComponent {
  componentDidMount() {
    
  };

  render() {
    return (
      <section>
        <div><p className="profile-title">My Profile</p></div>
        
        <div className="profile-box">
          <div className="user-info info-title">
            <div className="first-column">First Name</div>
          </div>
          <div className="user-info user-info-font">
            <div className="first-column bottom-spacer">{this.props.firstName}</div>
          </div>
          <div className="user-info info-title">
            <div className="first-column">Last Name</div> 
          </div>
          <div className="user-info user-info-font">
            <div className="first-column bottom-spacer">{this.props.lastName}</div>
          </div>
          <div className="user-info info-title">
            <div className="first-column">Email</div> 
          </div>
          <div className="user-info user-info-font">
            <div className="first-column bottom-spacer">{this.props.email}</div>
          </div>
          <div className="user-info info-title">
            <div className="first-column">Title</div> 
          </div>
          <div className="user-info user-info-font">
            <div className="first-column bottom-spacer">{this.props.jobTitle ? this.props.jobTitle : 'N/A'}</div>
          </div>
        </div>
        
        <div className="user-info-buttons">
          <p><Button disableRipple disableElevation variant="contained" className="secondary" target="_blank" href={`https://${process.env.B2C_ACCOUNT}/${process.env.TENANT}/oauth2/v2.0/authorize?p=${process.env.CHANGE_PASSWORD_POLICY}&client_id=${process.env.REACT_APP_AAD_APP_CLIENT_ID}&nonce=defaultNonce&redirect_uri=${encodeURIComponent(process.env.REACT_APP_AAD_CALLback)}&scope=openid&response_type=id_token&prompt=login`}>Change Password</Button> </p>
          <p><Button disableRipple disableElevation variant="contained" className="secondary" target="_blank" href={`https://${process.env.B2C_ACCOUNT}/${process.env.TENANT}/oauth2/v2.0/authorize?p=${process.env.CHANGE_PHONENUMBER_POLICY}&client_id=${process.env.REACT_APP_AAD_APP_CLIENT_ID}&nonce=defaultNonce&redirect_uri=${encodeURIComponent(process.env.REACT_APP_AAD_CALLback)}&scope=openid&response_type=id_token&prompt=login`}>Change Phone Number</Button> </p>
        </div>
      </section>
    );
  }
}