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
  SPECIALTIES,
  COMPLICATIONS,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  userToken: null,
  userName: null,
  userID: null,
  firstName: null,
  lastName: null,
  email: null,
  jobTitle: null,
  userFacility: null,
  facilityRooms: [],
  specialties: [],
  complications: [],
});

function emmReducer(state = initialState, action) {
  switch (action.type) {
    case USER_TOKEN:
      return state
        .set('userToken', action.token.jwtAccessToken)
        .set('userName', action.token.user.name)
        .set('userID', action.token.user.idToken.sub)
        .set('userLoggedIn', true)
        .set('firstName', action.token.user.idToken.given_name)
        .set('lastName', action.token.user.idToken.family_name)
        .set('email', action.token.user.idToken.email)
        .set('jobTitle', action.token.user.idToken.job_title);
    case USER_FACILITY:
      return state
        .set('userFacility', action.facility)
    case FACILITY_ROOMS:
      return state
        .set('facilityRooms', action.rooms)
    case SPECIALTIES:
      return state
        .set('specialties', action.specialties)
    case COMPLICATIONS:
      return state
        .set('complications', action.complications)
    default:
      return state;
  }
}

export default emmReducer;
