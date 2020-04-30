import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import EMM from './EMM';
import { makeSelectToken, makeSelectUserFacility } from '../App/selectors';
import { showEMMReport } from '../App/actions';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  userToken: makeSelectToken(),
  requestId: () => ownProps.match.params.requestid,
  userFacility: makeSelectUserFacility()
});

const mapDispatchToProps = (dispatch) => {
  return {
    setEMMReport: (reportID) => { dispatch(showEMMReport(reportID)) },
    pushUrl: (url) => { dispatch(push(url)) }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMM);