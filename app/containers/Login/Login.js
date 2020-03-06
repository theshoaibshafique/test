import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';
import SSTLogo from './img/SST_logo.svg';
import { AzureAD, LoginType, MsalAuthProviderFactory } from 'react-aad-msal';

export default class Login extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  unauthenticatedFunction = loginFunction => {
    return (
        <button className="Button sst-login-button" onClick={loginFunction}>Login</button>
    );
  }

  userJustLoggedIn = receivedToken => {
    this.props.userInfo(receivedToken);
    this.props.history.push(`/maindashboard`);
  }

  render() {
    return (
      <section className="SST-LOGIN full-height">
        <Helmet>
          <title>SST Insights Login</title>
          <meta name="description" content="SST Insights Dashboard" />
        </Helmet>
        <div className="flex vertical-center flex-column full-height">
          <img src={SSTLogo} style={{width: '650px'}}/>
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
            authenticatedFunction={this.authenticatedFunction}
            storeAuthStateInCookie={true}
            forceLogin={true}
          />
        </div>
      </section>
    );
  }
}