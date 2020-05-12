/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  USER_TOKEN,
  USER_FACILITY,
  FACILITY_ROOMS,
  SHOWEMMREPORT,
  HIDEEMMREPORT,
  SPECIALTIES,
  COMPLICATIONS,
} from './constants';

/**
 * Save user info from Azure token
 *
 * @param  {object} token Token returned by Azure
 *
 * @return {object}    An action object with a type of USER_TOKEN
 */
export function setUserInfo(token) {
  return {
    type: USER_TOKEN,
    token
  };
}

/**
 * Save user facility
 *
 * @param  {string} facility facility ID
 *
 * @return {object}    An action object with a type of USER_FACILITY
 */
export function setUserFacility(facility) {
  return {
    type: USER_FACILITY,
    facility
  };
}

/**
 * Save facility room
 *
 * @param  {array} rooms list of rooms based on facility
 *
 * @return {object}    An action object with a type of FACILITY_ROOMS
 */
export function setFacilityRooms(rooms) {
  return {
    type: FACILITY_ROOMS,
    rooms
  };
}

/**
 * Save specialties list
 *
 * @param  {array} specialties list of specialties
 *
 * @return {object}    An action object with a type of SPECIALTIES
 */
export function setSpecialties(specialties) {
  return {
    type: SPECIALTIES,
    specialties
  };
}

/**
 * Save complications list
 *
 * @param  {array} complications list of complications
 *
 * @return {object}    An action object with a type of SPECIALTIES
 */
export function setComplications(complications) {
  return {
    type: COMPLICATIONS,
    complications
  };
}

export function showEMMReport(reportID) {
  return {
    type: SHOWEMMREPORT,
    reportID
  };
}

export function hideEMMReport() {
  return {
    type: HIDEEMMREPORT
  }
}