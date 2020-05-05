import React from 'react';
import './style.scss';
import { AzureAD, LoginType, MsalAuthProviderFactory } from 'react-aad-msal';
import IdleTimer from 'react-idle-timer';
import * as CONSTANTS from '../../constants';
import globalFunctions from '../../utils/global-functions';

class AzureLogin extends React.Component {
  constructor(props) {
    super(props);
    this.logoutFunc = null;
    this.onIdle = this._onIdle.bind(this)
  }

  unauthenticatedFunction = loginFunction => {
    //this.props.history.push(`/usermanagement`);
    this.props.pushUrl('/dashboard');
  }

  userAuthenticatedFunction = logout => {
    if (!this.logoutFunc){
      this.logoutFunc = logout;
    }
    return (
        <button className="Logout-Button" onClick={logout} ref={this.props.logoutRef}>Logout</button>
    );
  };

  _onIdle(e){
    this.logoutFunc();
  }

  userJustLoggedIn = receivedToken => {
    this.props.userInfo(receivedToken);
    this.getUserFacility(receivedToken);
    this.getSpecialty();
    this.getComplications();
  }

  getUserFacility() {
    fetch(process.env.USER_API, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.props.userToken,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status !== 204) {
        response.json().then((result) => {
          if (result) {
            this.props.setUserFacility(result);
            this.props.resourcesGathered(true);
          }
        });
      } else {
        this.props.redirect();
      }
    })
  }

  
  getSpecialty() {
    if (this.props.specialties && this.props.specialties.length > 0){
      return;
    }
    globalFunctions.genericFetch(process.env.SPECIALTY_API, 'get', this.props.userToken, {})
      .then(result => {
        if (result) {
          this.props.setSpecialtyList(result);
        } else {

          // error
        }
      });
  };

  getComplications() {
    if (this.props.complications && this.props.complications.length > 0){
      return;
    }
    globalFunctions.genericFetch(process.env.COMPLICATION_API, 'get', this.props.userToken, {})
      .then(result => {

        if (result) {
          this.props.setComplicationList(result);
        } else {

          // error
        }
      });
  };

  render() {
    return (
      <span>
      <IdleTimer
          element={document}
          onIdle={this.onIdle}
          timeout={CONSTANTS.idleTimeout} />
      <AzureAD
      // reduxStore={store}
      provider={new MsalAuthProviderFactory({
        authority: process.env.REACT_APP_AUTHORITY,
        clientID: process.env.REACT_APP_AAD_APP_CLIENT_ID,
        scopes: process.env.REACT_APP_AAD_SCOPES.split(' '),
        redirectUri: process.env.REACT_APP_AAD_CALLback,
        type: LoginType.Redirect,
        validateAuthority: false,
        persistLoginPastSession: true,
      })}
      unauthenticatedFunction={this.unauthenticatedFunction}
      userInfoCallback={this.userJustLoggedIn}
      authenticatedFunction={this.userAuthenticatedFunction}
      storeAuthStateInCookie={true}
      forceLogin={true}
    />
    </span>
    );
  }
}

export default AzureLogin;
