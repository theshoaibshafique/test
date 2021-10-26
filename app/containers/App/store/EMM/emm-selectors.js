/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectEMM = (state) => state.get('emm');

const selectEMMReportID = () => createSelector(
  selectEMM,
  (emmState) => emmState.get('emmReportID')
);

const selectEMMReportData = () => createSelector(
  selectEMM,
  (emmState) => emmState.get('emmReportData')
);

const selectEMMTab = () => createSelector(
  selectEMM,
  (emmState) => emmState.get('emmTab')
);

const selectEMMPhaseIndex = () => createSelector(
  selectEMM,
  (emmState) => emmState.get('emmPhaseIndex')
);

const selectEMMVidoeTime = () => createSelector(
  selectEMM,
  (emmState) => emmState.get('emmVideoTime')
);

const selectEMMPublishAccess = () => createSelector(
  selectEMM,
  (emmState) => emmState.get('emmPublishAccess')
);

const selectEMMPresenterMode = () => createSelector(
  selectEMM,
  (emmState) => emmState.get('emmPresenterMode')
);

const selectEMMPresenterDialog = () => createSelector(
  selectEMM,
  (emmState) => emmState.get('emmPresenterDialog')
);

export {
  selectEMMTab,
  selectEMMReportID,
  selectEMMReportData,
  selectEMMPhaseIndex,
  selectEMMVidoeTime,
  selectEMMPublishAccess,
  selectEMMPresenterMode,
  selectEMMPresenterDialog
};
