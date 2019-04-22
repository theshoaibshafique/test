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

const makeSelectProcedures = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('procedures')
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

export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectToken,
  makeSelectUserLoggedIn,
  makeSelectID,
  makeSelectRepos,
  makeSelectLocation,
  makeSelectProcedures,
  makeSelectFacilityRooms,
  makeSelectPublishedSurveys,
  makeSelectMostRecentSurvey
};
