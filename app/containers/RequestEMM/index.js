import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import RequestEMM from './RequestEMM';
import { makeSelectToken, makeSelectUserFacility } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  userFacility: makeSelectUserFacility()
});

export default connect(mapStateToProps, null)(RequestEMM);
