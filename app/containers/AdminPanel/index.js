import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import AdminPanel from './AdminPanel';
import { makeSelectToken, makeSelectUserFacility, makeSelectID } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  facilityName : makeSelectUserFacility(),
  userId: makeSelectID()
});

export default connect(mapStateToProps, null)(AdminPanel);
