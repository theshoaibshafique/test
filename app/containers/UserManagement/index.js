import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import UserManagement from './UserManagement';
import { makeSelectToken, makeSelectUserFacility } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  facilityName : makeSelectUserFacility()
});

export default connect(mapStateToProps, null)(UserManagement);
