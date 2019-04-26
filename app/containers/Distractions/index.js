import { connect } from 'react-redux';
import Distractions from './Distractions';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken, makeSelectFacilityRooms } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  usertoken: makeSelectToken(),
  rooms: makeSelectFacilityRooms()
});

export default connect(mapStateToProps, null)(Distractions);