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
  EMM_SWITCH_TAB, SHOWEMMREPORT, HIDEEMMREPORT, SETEMMREPORT
} from './constants';

// The initial state of the App
const initialState = fromJS({
  emmTab: 'overview',
  emmReportID: null,
  emmReportData: null,
});

function emmReducer(state = initialState, action) {
  switch (action.type) {
    case EMM_SWITCH_TAB:
      return state
        .set('emmTab', action.emmTab)
    case SHOWEMMREPORT:
      return state
        .set('emmReportID', action.reportID)
    case HIDEEMMREPORT:
      return state
        .set('emmReportID', null)
    case SETEMMREPORT:
      return state
        .set('emmReportData', action.reportData)
    default:
      return state;
  }
}

export default emmReducer;
