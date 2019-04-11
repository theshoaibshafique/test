import { connect } from 'react-redux';
import RoomTraffic from './RoomTraffic';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  usertoken: makeSelectToken()
});

export default connect(mapStateToProps, null)(RoomTraffic);