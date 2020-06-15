import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import EMM from './EMM';
import { makeSelectToken, makeSelectUserFacility, makeSelectSpecialties, makeSelectComplications } from '../App/selectors';
import { showEMMReport } from '../App/emm-actions';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  userToken: makeSelectToken(),
  requestId: () => ownProps.match.params.requestid,
  userFacility: makeSelectUserFacility(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications()
});

const mapDispatchToProps = (dispatch) => {
  return {
    showEMMReport: (reportID) => { dispatch(showEMMReport(reportID)) },
    pushUrl: (url) => { dispatch(push(url)) }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMM);