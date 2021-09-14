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
  CD_FLAGGED_CLIP
} from './constants';

// The initial state of the App
const initialState = fromJS({
  detailedCase:null,
  flaggedClip:null
});

function cdReducer(state = initialState, action) {
  console.log(action.type);
  switch (action.type) {
    case CD_DETAILED_CASE:
      return state
        .set('detailedCase', action.detailedCase)
    case CD_FLAGGED_CLIP:
      console.log('HERE', action)
      return state
        .set('flaggedClip', action.flaggedClip)
    default:
      return state;
  }
}

export default cdReducer;
