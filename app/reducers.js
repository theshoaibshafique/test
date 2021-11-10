/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import globalReducer from 'containers/App/reducer';
import emmReducer from 'containers/App/store/EMM/emm-reducer';
import cdReducer from 'containers/App/store/CaseDiscovery/cd-reducer';
import umReducer from './containers/App/store/UserManagement/um-reducer';
import amReducer from './containers/App/store/ApiManagement/am-reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@5
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  location: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        location: action.payload,
      });
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
  return combineReducers({
    route: routeReducer,
    global: globalReducer,
    emm: emmReducer,
    cd: cdReducer,
    um: umReducer,
    am: amReducer,
    ...injectedReducers,
  });
}
