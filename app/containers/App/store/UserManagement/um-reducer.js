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
import { UM_FILTERS, UM_USERS } from '../../constants';

// The initial state of the App
const initialState = fromJS({
  filters:{},
  users: null
});

function umReducer(state = initialState, action) {
  switch (action.type) {
    case UM_FILTERS:
      return state
        .set('filters', action.filters)
    case UM_USERS:
      return state
        .set('users', action.users)

    default:
      return state;
  }
}

export default umReducer;
