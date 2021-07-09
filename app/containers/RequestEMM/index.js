import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import RequestEMM from './RequestEMM';
import { makeSelectToken, makeSelectUserFacility, makeSelectSpecialties, makeSelectComplications, makeSelectOperatingRoom } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  userFacility: makeSelectUserFacility(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications(),
  operatingRooms: makeSelectOperatingRoom()
});

export default connect(mapStateToProps, null)(RequestEMM);
