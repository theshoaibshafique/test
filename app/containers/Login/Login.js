/*
 * Distractions Page
 *
 */

import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Route } from 'react-router-dom'
import { AzureAD, LoginType, MsalAuthProviderFactory } from 'react-aad-msal';

export default class Login extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  unauthenticatedFunction = loginFunction => {
    return (
        <button className="Button" onClick={loginFunction}>Login</button>
    );
  }

  userJustLoggedIn = receivedToken => {
    this.props.userInfo(receivedToken);
    this.getUserFacility(receivedToken);
  }

  getUserFacility() {
    fetch(process.env.USER_API + this.props.userID, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.props.userToken,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((result) => {
      this.props.setUserFacility(result);
      this.getFacilityRooms(result.facilityName);
    })
  }

  getFacilityRooms(facilityName) {
    fetch(process.env.ROOMS_API + facilityName, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.props.userToken,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((result) => {
      let facilityRoomsList = result.reduce(function(map, obj) {
        map[obj.roomName] = obj.roomTitle;
        return map;
      }, {});
      this.props.setFacilityRooms(facilityRoomsList)
      this.getProcedureList();
    })
  }

  getProcedureList() {
    fetch(process.env.PROCEDURE_API, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.props.userToken,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((result) => {
      let procedureList = result.reduce(function(map, obj) {
          map[obj.name] = obj.title;
          return map;
      }, {});
      this.props.setProcedureList(procedureList)
      this.getPublishedSurveys();
    })
  }

  getPublishedSurveys() {
    fetch(process.env.PUBLISHEDSURVEY_API, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.props.userToken,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((result) => {
      let publishedSurveys = result.reduce(function(map, obj) {
        map[obj.name] = obj.title;
        return map;
      }, {});
      this.props.setPublishedSurveys(publishedSurveys)
      this.getMostRecentPublishedSurvey()
    })
  }

  getMostRecentPublishedSurvey() {
    fetch(process.env.MOSTRECENTSURVEY_API, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.props.userToken,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((result) => {
      this.props.setMostRecentPublishedSurvey(result)
      this.props.history.push(`/dashboard`);
    })
    .catch(() => {
      this.props.history.push(`/dashboard`);
    })
  }

  authenticatedFunction = logout => {
    return (
      <button onClick={logout}>Logout</button>
    )
  }

  render() {
    return (
      <section className="SST-LOGIN">
        <Helmet>
          <title>SST Insights Login</title>
          <meta name="description" content="SST Insights Dashboard" />
        </Helmet>
        <AzureAD
          // reduxStore={store}
          provider={new MsalAuthProviderFactory({
            authority: process.env.REACT_APP_AUTHORITY,
            clientID: process.env.REACT_APP_AAD_APP_CLIENT_ID,
            scopes: ["https://SSTapps.onmicrosoft.com/insightsapitest/user_impersonation", "openid", "offline_access"],
            redirectUri: process.env.REACT_APP_AAD_CALLback,
            type: LoginType.Redirect,
            validateAuthority: false,
            persistLoginPastSession: true,
          })}
          unauthenticatedFunction={this.unauthenticatedFunction}
          userInfoCallback={this.userJustLoggedIn}
          authenticatedFunction={this.authenticatedFunction}
          forceLogin={true}
        />
      </section>
    );
  }
}