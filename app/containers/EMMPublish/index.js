import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMPublish from './EMMPublish';
import { makeSelectToken, makeSelectUserFacility, makeSelectID, makeSelectSpecialties, makeSelectComplications, makeSelectLogger } from '../App/selectors';
import { push } from 'react-router-redux';
import { showEMMReport } from '../App/emm-actions';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  facilityName : makeSelectUserFacility(),
  userId: makeSelectID(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications(),
  logger: makeSelectLogger()
});

const mapDispatchToProps = (dispatch) => {
  return {
    showEMMReport: (reportID) => { dispatch(showEMMReport(reportID)) },
    pushUrl: (url) => { dispatch(push(url)); }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMPublish);
