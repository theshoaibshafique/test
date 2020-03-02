import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMCases from './EMMCases';
import { makeSelectToken, makeSelectUserFacility } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  userFacility: makeSelectUserFacility()
});

export default connect(mapStateToProps, null)(EMMCases);
