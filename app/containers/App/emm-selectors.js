/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectEMM = (state) => state.get('emm');

const selectEMMTab = () => createSelector(
  selectEMM,
  (globalState) => globalState.get('emmTab')
);

const selectEMMReportID = () => createSelector(
  selectEMM,
  (globalState) => globalState.get('emmReportID')
);

const selectEMMReportData = () => createSelector(
  selectEMM,
  (globalState) => globalState.get('emmReportData')
);

export {
  selectEMMTab,
  selectEMMReportID,
  selectEMMReportData
};
