import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MainLayout from './MainLayout';
import { makeSelectEmail, makeSelectLogger, makeSelectToken, makeSelectUserFacility, makeSelectRoles, makeSelectProductRoles } from '../App/selectors';
import { selectEMMReportID } from '../App/store/EMM/emm-selectors';
import { setEMMPublishAccess, showEMMReport } from '../App/store/EMM/emm-actions';
import { push } from 'react-router-redux';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  emmReportID: selectEMMReportID(),
  userEmail: makeSelectEmail(),
  userFacility: makeSelectUserFacility(),
  userRoles: makeSelectRoles(),
  productRoles: makeSelectProductRoles(),
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