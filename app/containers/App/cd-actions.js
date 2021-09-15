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
  CD_DETAILED_CASE,
  CD_CASES,
  CD_FLAGGED_CLIP,
  CD_OVERVIEW,
  CD_SAVED_CASES,
  CD_RECOMMENDATIONS,
  CD_RECENT_SAVED,
  CD_RECENT_FLAGS,
  CD_OVERVIEW_DATA,
  CD_OVERVIEW_TILE
} from './constants';

export function showDetailedCase(detailedCase) {
  return {
    type: CD_DETAILED_CASE,
    detailedCase
  };
}

export function setCases(cases) {
  return {
    type: CD_CASES,
    cases
  }
}

export function setSavedCases(savedCases) {
  return {
    type: CD_SAVED_CASES,
    savedCases
  }
}

export function setFlaggedClip(flaggedClip) {
  return {
    type: CD_FLAGGED_CLIP,
    flaggedClip
  }
}

export function setOverviewData(overviewData){
  return {
    type: CD_OVERVIEW_DATA,
    overviewData
  }
}

export function setOverviewTile(overview){
  return {
    type: CD_OVERVIEW_TILE,
    overview
  }
}

export function setRecentFlags(recentFlags){
  return {
    type: CD_RECENT_FLAGS,
    recentFlags
  }
}

export function setRecommendations(recommendations){
  return {
    type: CD_RECOMMENDATIONS,
    recommendations
  }
}

export function setRecentSaved(recentSaved){
  return {
    type: CD_RECENT_SAVED,
    recentSaved
  }
}