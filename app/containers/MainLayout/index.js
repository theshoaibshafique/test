import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MainLayout from './MainLayout';
import { makeSelectEmail, makeSelectToken, makeSelectUserFacility } from '../App/selectors';
import { selectEMMReportID } from '../App/emm-selectors';
import { setEMMPublishAccess, showEMMReport } from '../App/emm-actions';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  emmReportID: selectEMMReportID(),
  userEmail: makeSelectEmail(),
  userFacility: makeSelectUserFacility(),
});

const mapDispatchToProps = (dispatch) => {
  return {
    showEMMReport: (reportID) => { dispatch(showEMMReport(reportID)) },
    setEMMPublishAccess: (publishAccess) => { dispatch(setEMMPublishAccess(publishAccess)); }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);