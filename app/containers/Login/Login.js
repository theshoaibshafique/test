import React from 'react';
import './style.scss';

import { Helmet } from 'react-helmet';
import SSTLogo from './img/SST_logo.svg';
import { AzureAD, LoginType, MsalAuthProviderFactory } from 'react-aad-msal';
import globalFunctions from '../../utils/global-functions';
import { redirectLogin } from '../../utils/Auth';
import moment from 'moment';
import { Logger } from '../../components/Logger/Logger';
import { refreshInterval } from '../../constants';

export default class Login extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { logger } = this.props;

    const { refreshToken, expiresAt } = JSON.parse(localStorage.getItem('refreshToken')) || {};
    const urlParams = new URLSearchParams(window.location.search)
    const auth_code = urlParams.get('code')
    //If they're redirecting back to Insights
    if (auth_code) {
      this.login(auth_code);
      return;
    }
    if (window.location.pathname == "/") {
      this.props.pushUrl('/dashboard');
      return;
    }
    if (!refreshToken) {
      window.location.replace(redirectLogin(logger))
      return;
    }

    this.refreshLoop();
  }

  refreshLoop() {
    this.refreshLogin();
    setTimeout(() => {
      this.refreshLoop();
    }, refreshInterval);
  }

  unauthenticatedFunction = loginFunction => {
    return (
      <button className="Button sst-login-button" onClick={loginFunction}>Login</button>
    );
  }

  userJustLoggedIn = receivedToken => {
    this.props.userInfo(receivedToken);
    this.props.pushUrl('/dashboard');
  }

  async login(auth_code) {
    const { logger } = this.props;
    localStorage.setItem('refreshToken', null);
    const verifier_list = JSON.parse(localStorage.getItem('verifier_list')) || [];
    let success = false;
    for (const verifier of verifier_list) {
      if (success){
        break;
      }
      const body = {
        client_id: process.env.AUTH_CLIENT_ID,
        grant_type: 'authorization_code',
        redirect_uri: process.env.AUTH_CALLBACK,
        code_verifier: verifier,
        code: auth_code
      }
      
      await globalFunctions.authFetch(`${process.env.AUTH_API}token`, 'POST', body)
        .then(result => {
          localStorage.setItem('verifier_list', null);
          this.processAuthentication(result.data);
          success = true;
          this.props.pushUrl('/dashboard');
        }).catch(error => {
          console.error(error);
          logger && logger.manualAddLog('session', `error_login_auth`, {'verifier': verifier, 'error': error});
        });
    }
    if (!success){
      logger && logger.sendLogs();
      localStorage.setItem('verifier_list', null);
      window.location.replace(redirectLogin(logger));
    }

  }

  refreshLogin() {
    const { logger } = this.props;

    const { refreshToken, expiresAt } = JSON.parse(localStorage.getItem('refreshToken')) || {};
    const body = {
      client_id: process.env.AUTH_CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken || ""
    }
    if (!refreshToken) {
      window.location.replace(redirectLogin(logger))
      return;
    }
    logger && logger.manualAddLog('session', `refresh_token`, {'refresh_token': refreshToken});
    globalFunctions.authFetch(`${process.env.AUTH_API}token`, 'POST', body)
      .then(result => {
        this.processAuthentication(result.data);
      }).catch(error => {
        console.error(error)
        logger && logger.manualAddLog('session', `error_refresh_token`, {'refresh_token': refreshToken, 'error':error});
        logger && logger.sendLogs();
        localStorage.setItem('refreshToken', null);
        window.location.replace(redirectLogin(logger))
      });
  };

  processAuthentication(data) {
    const { accessToken, expiresAt, refreshToken } = data;
    localStorage.setItem('refreshToken', JSON.stringify({ refreshToken: refreshToken, expiresAt: expiresAt * 1000 }));
    this.props.setUserToken(accessToken);
    if (this.props.logger) {
      this.props.logger.userToken = this.props.userToken;
      return;
    }
    globalFunctions.genericFetch(`${process.env.USER_API}profile`, 'get', accessToken, {})
      .then(result => {
        this.props.setProfile(result);
        this.getOperatingRooms(result.facilityId);
        this.getComplications();
        this.setLogger();
      }).catch((results) => {
        console.error("oh no", results)
      });
  }

  setLogger() {
    this.props.setLogger(new Logger(this.props.userToken))
  }


  getComplications() {
    if (this.props.complications && this.props.complications.length > 0) {
      return;
    }

    globalFunctions.axiosFetch(process.env.EMMREPORT_API + '/complications', 'get', this.props.userToken, {})
      .then(result => {
        result = result.data
        this.props.setComplicationList(result);
      }).catch((error) => {
        console.error('Could not fetch Complications list')
      })
  };

  getOperatingRooms() {
    globalFunctions.genericFetch(process.env.EMR_API + "rooms", 'get', this.props.userToken, {})
      .then(result => {
        if (result != 'error') {
          this.props.setOperatingRoom(result)
        }
      }).catch((error) =>
        console.error(error)
      );
  }

  render() {
    return (
      // <section className="SST-LOGIN full-height">
      //   <Helmet>
      //     <title>SST Insights Login</title>
      //     <meta name="description" content="SST Insights Dashboard" />
      //   </Helmet>
      //   <div className="flex vertical-center flex-column full-height">
      //     <img src={SSTLogo} style={{width: '650px'}}/>
      //     {/* <AzureAD
      //       // reduxStore={store}
      //       provider={new MsalAuthProviderFactory({
      //         authority: process.env.REACT_APP_AUTHORITY,
      //         clientID: process.env.REACT_APP_AAD_APP_CLIENT_ID,
      //         scopes: process.env.REACT_APP_AAD_SCOPES.split(' '),
      //         redirectUri: process.env.REACT_APP_AAD_CALLback,
      //         type: LoginType.Redirect,
      //         validateAuthority: false,
      //         persistLoginPastSession: true,
      //       })}
      //       unauthenticatedFunction={this.unauthenticatedFunction}
      //       userInfoCallback={this.userJustLoggedIn}
      //       authenticatedFunction={this.authenticatedFunction}
      //       storeAuthStateInCookie={true}
      //       forceLogin={true}
      //     /> */}
      //   </div>
      // </section>
      <span></span>
    );
  }
}