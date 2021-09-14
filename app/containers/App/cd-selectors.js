/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectCD = (state) => state.get('cd');

const selectDetailedCase = () => createSelector(
  selectCD,
  (cdState) => cdState.get('detailedCase')
);

const selectFlaggedClip = () => createSelector(
  selectCD,
  (cdState) => cdState.get('flaggedClip')
);


export {
  selectDetailedCase,
  selectFlaggedClip,
};
