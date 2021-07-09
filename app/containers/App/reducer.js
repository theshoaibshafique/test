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
  OPERATING_ROOM,
  USER_ROLES,
  LOGGER,
  AUTH_LOGIN,
  PROFILE
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
  operatingRoom: [],
  userRoles: []
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
    case AUTH_LOGIN:
      return state
        .set('userToken', action.accessToken)
        .set('userLoggedIn', true);
    case PROFILE:
      return state
        .set('userID', action.profile.userId)
        .set('email', action.profile.email)
        .set('userFacility', action.profile.facilityId)
        .set('firstName', action.profile.firstName)
        .set('lastName', action.profile.lastName)
        .set('jobTitle', action.profile.title)
        .set('userRoles', action.profile.roles);
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
    case OPERATING_ROOM:
      return state
        .set('operatingRoom', action.operatingRoom)
    case USER_ROLES:
      return state
        .set('userRoles', action.userRoles)
    case LOGGER:
      return state
        .set('logger', action.logger)
    default:
      return state;
  }
}

export default emmReducer;
