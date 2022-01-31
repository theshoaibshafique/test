import React from 'react';
import './style.scss';
import globalFunctions from '../../utils/global-functions';
import { redirectLogin } from '../../utils/Auth';
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
      this.redirect()
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

  redirect() {
    const animateQuery = 'animate=true';
    let redirect = localStorage.getItem('redirect') || '/dashboard';
    if(redirect.includes('/dashboard?')){
      redirect += animateQuery;
    } else if(redirect.includes('/dashboard')){
      redirect += `?${animateQuery}`;
    }
    localStorage.removeItem('redirect')
    this.props.pushUrl(redirect.includes("state") ? `/dashboard?${animateQuery}` : redirect);
  }

  async login(auth_code) {
    const { logger } = this.props;
    localStorage.setItem('refreshToken', null);
    const verifier_list = JSON.parse(localStorage.getItem('verifier_list')) || [];
    let success = false;
    for (const verifier of verifier_list) {
      if (success) {
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
          this.redirect()
        }).catch(error => {
          console.error(error);
          logger?.manualAddLog('session', `error_login_auth`, { 'verifier': verifier, 'error': error });
        });
    }
    if (!success) {
      logger?.sendLogs();
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
    logger?.manualAddLog('session', `refresh_token`, { 'refresh_token': refreshToken });
    globalFunctions.authFetch(`${process.env.AUTH_API}token`, 'POST', body)
      .then(result => {
        this.processAuthentication(result.data);
      }).catch(error => {
        console.error(error)
        logger?.manualAddLog('session', `error_refresh_token`, { 'refresh_token': refreshToken, 'error': error });
        logger?.sendLogs();
        localStorage.setItem('refreshToken', null);
        window.location.replace(redirectLogin(logger))
      });
  };

  async processAuthentication(data) {
    const { accessToken, expiresAt, refreshToken } = data;
    localStorage.setItem('refreshToken', JSON.stringify({ refreshToken: refreshToken, expiresAt: expiresAt * 1000 }));

    const roleToken = await globalFunctions.genericFetch(`${process.env.USER_V2_API}roles`, 'get', accessToken, {})
      .catch((results) => {
        console.error("oh no", results)
      });



    const token = { userToken: accessToken, roleToken: roleToken?.forbidden ? '' : roleToken }
    this.props.setUserToken(token);
    if (this.props.logger) {
      this.props.logger.userToken = this.props.userToken;
      return;
    }
    await Promise.all([
      globalFunctions.genericFetch(`${process.env.USER_V2_API}profile`, 'get', token, {}),
      globalFunctions.genericFetch(`${process.env.USER_V2_API}facility`, 'get', token, {})
    ]).then(async ([profileResult, facilityResult]) => {
      this.props.setFacilityDetails(facilityResult);
      this.props.setProfile(profileResult);
      this.setLogger(token);
      if (roleToken?.forbidden){
        const val = await roleToken?.forbidden
        this.props.setUserStatus({status: 'forbidden', message: val?.detail})
        return
      }
      this.getOperatingRooms(token);
      this.getComplications(token);
    }).catch((results) => {
      console.error("oh no", results)
    });

  }

  setLogger(token) {
    this.props.setLogger(new Logger(token))
  }


  getComplications(token) {
    if (this.props.complications?.length > 0) {
      return;
    }

    globalFunctions.axiosFetch(process.env.EMMREPORT_API + '/complications', 'get', token, {})
      .then(result => {
        this.props.setComplicationList(result);
      }).catch((error) => {
        console.error('Could not fetch Complications list')
      })
  };

  getOperatingRooms(token) {
    globalFunctions.genericFetch(process.env.EMR_API + "rooms", 'get', token, {})
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
      <span></span>
    );
  }
}
