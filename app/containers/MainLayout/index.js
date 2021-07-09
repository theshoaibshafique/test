import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MainLayout from './MainLayout';
import { makeSelectEmail, makeSelectLogger, makeSelectToken, makeSelectUserFacility, makeSelectRoles } from '../App/selectors';
import { selectEMMReportID } from '../App/emm-selectors';
import { setEMMPublishAccess, showEMMReport } from '../App/emm-actions';
import { push } from 'react-router-redux';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  emmReportID: selectEMMReportID(),
  userEmail: makeSelectEmail(),
  userFacility: makeSelectUserFacility(),
  userRoles: makeSelectRoles(),
  logger: makeSelectLogger()
});

const mapDispatchToProps = (dispatch) => {
  return {
    showEMMReport: (reportID) => { dispatch(showEMMReport(reportID)) },
    setEMMPublishAccess: (publishAccess) => { dispatch(setEMMPublishAccess(publishAccess)); },
    pushUrl: (url) => {
      dispatch(push(url));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);