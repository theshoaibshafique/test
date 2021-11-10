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
  AM_ASSIGNABLE_ROLES,
  AM_FILTERS,
  AM_CLIENTS,
  AM_EXIT
} from '../../constants';

export function setApiFilters(filters) {
  return {
    type: AM_FILTERS,
    filters
  };
}

export function setClients(clients) {
  return {
    type: AM_CLIENTS,
    clients
  };
}

export function setApiAssignableRoles(roles) {
  return {
    type: AM_ASSIGNABLE_ROLES,
    roles
  };
}

export function exitApiManagement(){
  return {
    type: AM_EXIT
  };
}