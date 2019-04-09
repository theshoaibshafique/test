import { connect } from 'react-redux';
import DistractionsOR from './DistractionsOR';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken, makeSelectFacilityRooms } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  usertoken: makeSelectToken(),
  facilityRooms: makeSelectFacilityRooms(),
});

export default connect(mapStateToProps, null)(DistractionsOR);