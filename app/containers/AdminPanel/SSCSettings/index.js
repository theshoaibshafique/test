import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SSCSettings from './SSCSettings';
import { makeSelectToken, makeSelectUserFacility, makeSelectID } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  facilityName : makeSelectUserFacility(),
  userId: makeSelectID()
});

export default connect(mapStateToProps, null)(SSCSettings);
