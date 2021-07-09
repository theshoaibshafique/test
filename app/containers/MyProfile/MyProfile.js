import React from 'react';
import Button from '@material-ui/core/Button';
import globalFuncs from '../../utils/global-functions';
import './style.scss';

export default class MyProfile extends React.PureComponent {
  redirect(type, url) {
    window.location.replace(`${process.env.AUTH_LOGIN}/update`)
  }

  render() {
    return (
      <section>
        <div><p className="profile-title">My Profile</p></div>

        <div className="profile-box">
          <div className="user-info info-title">
            <div className="first-column">First Name</div>
          </div>
          <div className="user-info normal-text">
            <div className="first-column bottom-spacer">{this.props.firstName}</div>
          </div>
          <div className="user-info info-title">
            <div className="first-column">Last Name</div>
          </div>
          <div className="user-info normal-text">
            <div className="first-column bottom-spacer">{this.props.lastName}</div>
          </div>
          <div className="user-info info-title">
            <div className="first-column">Email</div>
          </div>
          <div className="user-info normal-text">
            <div className="first-column bottom-spacer">{this.props.email}</div>
          </div>
          <div className="user-info info-title">
            <div className="first-column">Title</div>
          </div>
          <div className="user-info normal-text">
            <div className="first-column bottom-spacer">{this.props.jobTitle ? this.props.jobTitle : 'N/A'}</div>
          </div>
        </div>

        <div className="user-info-buttons">
          <p><Button disableRipple disableElevation variant="contained" className="secondary" target="_blank" onClick={() => this.redirect()}>Change Password</Button> </p>
          <p><Button disableRipple disableElevation variant="contained" className="secondary" target="_blank" onClick={() => this.redirect()}>Change Phone Number</Button> </p>
        </div>
      </section>
    );
  }
}