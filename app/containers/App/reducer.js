/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';

import {
  USER_TOKEN,
  USER_FACILITY,
  FACILITY_ROOMS,
  PROCEDURES,
  PUBLISHEDSURVEYS,
  RECENTPUBLISHEDSURVEYS
} from './constants';

// The initial state of the App
const initialState = fromJS({
  userToken: null,
  userName: null,
  userID: null,
  userFacility: null,
  facilityRooms: [],
  procedures: [],
  publishedSurveys: [],
  mostRecentSurvey: null
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case USER_TOKEN:
      return state
        .set('userToken', action.token.jwtAccessToken)
        .set('userName', action.token.user.name)
        .set('userID', action.token.user.idToken.sub);
    case USER_FACILITY:
      return state
        .set('userFacility', action.facility)
    case FACILITY_ROOMS:
      return state
        .set('facilityRooms', action.rooms)
    case PROCEDURES:
      return state
        .set('procedures', action.procedures)
    case PUBLISHEDSURVEYS:
      return state
        .set('publishedSurveys', action.publishedSurveys)
    case RECENTPUBLISHEDSURVEYS:
      return state
        .set('mostRecentSurvey', action.mostRecentSurvey)
    default:
      return state;
  }
}

export default appReducer;
