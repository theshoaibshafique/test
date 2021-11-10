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
import { AM_ASSIGNABLE_ROLES, AM_CLIENTS, AM_EXIT, AM_FILTERS } from '../../constants';

// The initial state of the App
const initialState = fromJS({
  filters: null,
  clients: null,
  assignableRoles: {}
});

function amReducer(state = initialState, action) {
  switch (action.type) {
    case AM_FILTERS:
      return state
        .set('filters', { ...action.filters }) //This is done to trigger a rerender
    case AM_CLIENTS:
      return state
        .set('clients', action.clients)
    case AM_ASSIGNABLE_ROLES:
      return state
        .set('assignableRoles', action.roles)
    case AM_EXIT:
      return state
        .set('clients', null)
        .set('filters', null)

    default:
      return state;
  }
}

export default amReducer;
