import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMPublish from './EMMPublish';
import { makeSelectToken, makeSelectUserFacility, makeSelectID } from '../App/selectors';
import { push } from 'react-router-redux';
import { showEMMReport } from '../App/actions';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  facilityName : makeSelectUserFacility(),
  userId: makeSelectID()
});

const mapDispatchToProps = (dispatch) => {
  return {
    showEMMReport: (reportID) => { dispatch(showEMMReport(reportID)) },
    pushUrl: (url) => { dispatch(push(url)); }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMPublish);
