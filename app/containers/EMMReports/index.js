import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import EMMReports from './EMMReports';
import { makeSelectToken, makeSelectSpecialties, makeSelectComplications } from '../App/selectors';
import { selectEMMTab, selectEMMReportData, selectEMMReportID } from '../App/emm-selectors';
import { hideEMMReport, setEMMReport, setEMMTab } from '../App/emm-actions';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  userToken: makeSelectToken(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications(),
  emmReportData: selectEMMReportData(),
  emmReportID: selectEMMReportID(),
  emmReportTab: selectEMMTab()
});

const mapDispatchToProps = (dispatch) => {
  return {
    goBack: () => { dispatch(goBack()); },
    hideEMMReport: () => { dispatch(hideEMMReport()); },
    setEMMReport: (data) => { dispatch(setEMMReport(data)); },
    setEmmTab: (data) => { dispatch(setEMMTab(data)); },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMReports);