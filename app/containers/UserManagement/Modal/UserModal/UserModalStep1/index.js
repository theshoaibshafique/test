import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import UserModalStep1 from './UserModalStep1';
import { makeSelectToken, makeSelectUserFacility } from '../../../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  facilityName : makeSelectUserFacility()
});

export default connect(mapStateToProps, null)(UserModalStep1);