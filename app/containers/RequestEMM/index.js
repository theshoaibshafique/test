import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import RequestEMM from './RequestEMM';
import { makeSelectToken, makeSelectUserFacility, makeSelectSpecialties, makeSelectComplications } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  userFacility: makeSelectUserFacility(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications()
});

export default connect(mapStateToProps, null)(RequestEMM);
