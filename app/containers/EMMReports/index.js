import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import EMMReports from './EMMReports';
import { makeSelectToken, makeSelectSpecialties, makeSelectComplications, makeSelectEmail } from '../App/selectors';
import { selectEMMTab, selectEMMReportData, selectEMMReportID, selectEMMPublishAccess } from '../App/emm-selectors';
import { hideEMMReport, setEMMReport, setEMMTab } from '../App/emm-actions';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  userToken: makeSelectToken(),
  userEmail: makeSelectEmail(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications(),
  emmReportData: selectEMMReportData(),
  emmReportID: selectEMMReportID(),
  emmReportTab: selectEMMTab(),
  emmPublishAccess: selectEMMPublishAccess()
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