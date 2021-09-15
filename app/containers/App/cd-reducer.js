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
  CD_DETAILED_CASE,
  CD_CASES,
  CD_FLAGGED_CLIP,
  CD_OVERVIEW_TILE,
  CD_SAVED_CASES,
  CD_RECENT_FLAGS,
  CD_RECOMMENDATIONS,
  CD_RECENT_SAVED,
  CD_OVERVIEW_DATA
} from './constants';

// The initial state of the App
const initialState = fromJS({
  detailedCase: null,
  flaggedClip: null,
  cases: [],

  recentFlags: null,
  recentClips: null,
  recommendations: null,
  recentSaved: null,
  overviewTile: null,
  savedCases: []
});

function cdReducer(state = initialState, action) {
  switch (action.type) {
    case CD_OVERVIEW_DATA:
      const { recentFlags, recentClips, recommendations,
        recentSaved, overview, savedCases } = action.overviewData;
      return state
        .set('recentFlags', recentFlags)
        .set('recentClips', recentClips)
        .set('recommendations', recommendations)
        .set('recentSaved', recentSaved)
        .set('overviewTile', overview)
        .set('savedCases', savedCases)
    case CD_OVERVIEW_TILE:
      return state
        .set('overviewTile', action.overview);
    case CD_RECENT_FLAGS:
      return state
        .set('recentFlags', action.recentFlags)
    case CD_RECOMMENDATIONS:
      return state
        .set('recommendations', action.recommendations)
    case CD_RECENT_SAVED:
      return state
        .set('recentSaved', action.recentSaved)
    case CD_SAVED_CASES:
      return state
        .set('savedCases', action.savedCases)
    case CD_DETAILED_CASE:
      return state
        .set('detailedCase', action.detailedCase)
    case CD_CASES:
      return state
        .set('cases', action.cases)
    case CD_FLAGGED_CLIP:
      return state
        .set('flaggedClip', action.flaggedClip)
    default:
      return state;
  }
}

export default cdReducer;
