import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import EMMReports from './EMMReports';
import { makeSelectToken, makeSelectSpecialties, makeSelectEmail, makeSelectLogger } from '../App/selectors';
import { selectEMMTab, selectEMMReportData, selectEMMReportID, selectEMMPublishAccess, selectEMMPresenterDialog, selectEMMPresenterMode } from '../App/emm-selectors';
import { hideEMMReport, setEMMPresenterDialog, setEMMPresenterMode, setEMMReport, setEMMTab } from '../App/emm-actions';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  userToken: makeSelectToken(),
  userEmail: makeSelectEmail(),
  specialties: makeSelectSpecialties(),
  emmReportData: selectEMMReportData(),
  emmReportID: selectEMMReportID(),
  emmReportTab: selectEMMTab(),
  emmPublishAccess: selectEMMPublishAccess(),
  emmPresenterMode: selectEMMPresenterMode(),
  emmPresenterDialog: selectEMMPresenterDialog(),
  logger: makeSelectLogger()
});

const mapDispatchToProps = (dispatch) => {
  return {
    goBack: () => { dispatch(goBack()); },
    hideEMMReport: () => { dispatch(hideEMMReport()); },
    setEMMReport: (data) => { dispatch(setEMMReport(data)); },
    setEmmTab: (data) => { dispatch(setEMMTab(data)); },
    setEMMPresenterMode: (data) => { dispatch(setEMMPresenterMode(data)); },
    setEMMPresenterDialog: (data) => { dispatch(setEMMPresenterDialog(data)); },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMReports);