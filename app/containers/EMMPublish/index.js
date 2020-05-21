import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMPublish from './EMMPublish';
import { makeSelectToken, makeSelectUserFacility, makeSelectID, makeSelectSpecialties, makeSelectComplications } from '../App/selectors';
import { push } from 'react-router-redux';
import { showEMMReport } from '../App/actions';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  facilityName : makeSelectUserFacility(),
  userId: makeSelectID(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications()
});

const mapDispatchToProps = (dispatch) => {
  return {
    showEMMReport: (reportID) => { dispatch(showEMMReport(reportID)) },
    pushUrl: (url) => { dispatch(push(url)); }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMPublish);
