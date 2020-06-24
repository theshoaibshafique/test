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
  EMM_SWITCH_TAB,
  SHOWEMMREPORT,
  HIDEEMMREPORT,
  SETEMMREPORT,
  EMM_SWITCH_PHASE,
  EMM_SET_VIDEO_TIME,
  EMM_PUBLISH_ACCESS
} from './constants';

// The initial state of the App
const initialState = fromJS({
  emmReportID: null,
  emmReportData: null,
  emmTab: 'overview',
  emmPhaseIndex: null,
  emmVideoTime: 0,
  emmPublishAccess: false
});

function emmReducer(state = initialState, action) {
  switch (action.type) {
    case SHOWEMMREPORT:
      return state
        .set('emmReportID', action.reportID)
    case HIDEEMMREPORT:
      return state
        .set('emmReportID', null)
        .set('emmReportData', null)
        .set('emmTab', 'overview')
        .set('emmPhaseIndex', null)
    case SETEMMREPORT:
      return state
        .set('emmReportData', action.reportData)
        .set('emmPhaseIndex', 0)
    case EMM_SWITCH_TAB:
      return state
        .set('emmTab', action.emmTab)
    case EMM_SWITCH_PHASE:
      return state
        .set('emmPhaseIndex', action.emmPhaseIndex)
    case EMM_SET_VIDEO_TIME:
      return state
        .set('emmVideoTime', action.videoTime)
    case EMM_PUBLISH_ACCESS:
      return state
        .set('emmPublishAccess', action.publishAccess)
    default:
      return state;
  }
}

export default emmReducer;
