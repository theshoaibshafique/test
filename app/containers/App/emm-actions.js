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
  SHOWEMMREPORT,
  HIDEEMMREPORT,
  SETEMMREPORT,
  EMM_SWITCH_TAB,
  EMM_SWITCH_PHASE,
  EMM_SET_VIDEO_TIME
} from './constants';

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

export function setEMMReport(reportData) {
  return {
    type: SETEMMREPORT,
    reportData
  }
}

export function setEMMTab(emmTab) {
  return {
    type: EMM_SWITCH_TAB,
    emmTab
  }
}

export function setEMMPhaseIndex(emmPhaseIndex) {
  return {
    type: EMM_SWITCH_PHASE,
    emmPhaseIndex
  }
}

export function setEMMVideoTime(videoTime) {
  return {
    type: EMM_SET_VIDEO_TIME,
    videoTime
  }
}