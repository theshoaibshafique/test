import React from 'react';
import './style.scss';
import { AzureAD, LoginType, MsalAuthProviderFactory } from 'react-aad-msal';

class AzureLogin extends React.Component { // eslint-disable-line react/prefer-stateless-function
  unauthenticatedFunction = loginFunction => {
    this.props.history.push(`/dashboard`);
  }

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
      this.props.resourcesGathered(true);
    })
    .catch(() => {
      // this.props.history.push(`/dashboard`);
    })
  }

  authenticatedFunction = logout => {
    // this.props.logoutFunction(logout);
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
      authenticatedFunction={this.authenticatedFunction}
      storeAuthStateInCookie={true}
      forceLogin={true}
    />
    );
  }
}

export default AzureLogin;
