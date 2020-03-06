import React from 'react';
import './style.scss';
import { AzureAD, LoginType, MsalAuthProviderFactory } from 'react-aad-msal';

class AzureLogin extends React.Component {
  unauthenticatedFunction = loginFunction => {
    //this.props.history.push(`/usermanagement`);
  }

  userAuthenticatedFunction = logout => {
    return (
        <button className="Logout-Button" onClick={logout}>Logout</button>
    );
  };

  userJustLoggedIn = receivedToken => {
    this.props.userInfo(receivedToken);
    this.getUserFacility(receivedToken);
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

  render() {
    return (
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
    );
  }
}

export default AzureLogin;
