import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import UserManagement from './UserManagement';
import { makeSelectToken, makeSelectUserFacility, makeSelectID } from 'containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  facilityName : makeSelectUserFacility(),
  userId: makeSelectID()
});

export default connect(mapStateToProps, null)(UserManagement);
