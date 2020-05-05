/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');

const selectRoute = (state) => state.get('route');

const makeSelectToken = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('userToken')
);

const makeSelectID = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('userID')
);

const makeSelectUserLoggedIn = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('userLoggedIn')
);

const makeSelectRepos = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['userData', 'repositories'])
);

const makeSelectLocation = () => createSelector(
  selectRoute,
  (routeState) => routeState.get('location').toJS()
);

const makeSelectSpecialties = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('specialties')
);

const makeSelectComplications = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('complications')
);

const makeSelectFacilityRooms = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('facilityRooms')
);

const makeSelectPublishedSurveys = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('publishedSurveys')
);

const makeSelectMostRecentSurvey = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('mostRecentSurvey')
);

const makeSelectUserFacility = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('userFacility')
);

const makeSelectFirstName = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('firstName')
);

const makeSelectLastName = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('lastName')
);

const makeSelectEmail = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('email')
);

const makeSelectJobTitle = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('jobTitle')
);

export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectToken,
  makeSelectUserLoggedIn,
  makeSelectID,
  makeSelectRepos,
  makeSelectLocation,
  makeSelectSpecialties,
  makeSelectComplications,
  makeSelectFacilityRooms,
  makeSelectPublishedSurveys,
  makeSelectMostRecentSurvey,
  makeSelectUserFacility,
  makeSelectFirstName,
  makeSelectLastName,
  makeSelectEmail,
  makeSelectJobTitle
};
