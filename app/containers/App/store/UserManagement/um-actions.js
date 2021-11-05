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
  UM_ASSIGNABLE_ROLES,
  UM_EXIT,
  UM_FILTERS, UM_FILTERS_FUNC, UM_LOCATION, UM_USERS
} from '../../constants';

export function setFilters(filters) {
  return {
    type: UM_FILTERS,
    filters
  };
}

export function setUsers(users) {
  return {
    type: UM_USERS,
    users
  };
}

export function setAssignableRoles(roles) {
  return {
    type: UM_ASSIGNABLE_ROLES,
    roles
  };
}

export function setLocationList(locations) {
  return {
    type: UM_LOCATION,
    locations
  };
}

export function exitUserManagement(){
  return {
    type: UM_EXIT
  };
}