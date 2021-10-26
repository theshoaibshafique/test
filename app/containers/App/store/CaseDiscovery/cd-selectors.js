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

const selectCases = () => createSelector(
  selectCD,
  (cdState) => cdState.get('cases')
);

const selectOverviewData = () => createSelector(
  selectCD,
  (cdState) => {
    return cdState.get('overviewTile') && {
      recentFlags: cdState.get('recentFlags'),
      recentClips: cdState.get('recentClips'),
      recommendations: cdState.get('recommendations'),
      recentSaved: cdState.get('recentSaved'),
      overview: cdState.get('overviewTile'),
    }
  }
);

const selectSavedCases = () => createSelector(
  selectCD,
  (cdState) => cdState.get('savedCases')
);

const selectFlagReport = () => createSelector(
  selectCD,
  (cdState) => cdState.get('flagReport')
);

const selectClipNotificationStatus = () => createSelector(
  selectCD,
  (cdState) => cdState.get('clipNotificationStatus')
);

export {
  selectDetailedCase,
  selectFlaggedClip,
  selectCases,
  selectOverviewData,
  selectSavedCases,
  selectFlagReport,
  selectClipNotificationStatus
};
