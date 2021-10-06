import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import UserModalStep1 from './UserModalStep1';
import { makeSelectToken, makeSelectUserFacility,makeSelectLogger } from 'containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  facilityName : makeSelectUserFacility(),
  logger: makeSelectLogger()
});

export default connect(mapStateToProps, null)(UserModalStep1);