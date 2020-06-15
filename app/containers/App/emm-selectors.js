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

const selectEMMPhase = () => createSelector(
  selectEMM,
  (emmState) => emmState.get('emmPhase')
);

export {
  selectEMMTab,
  selectEMMReportID,
  selectEMMReportData,
  selectEMMPhase
};
