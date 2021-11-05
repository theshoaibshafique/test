import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EfficiencySettings from './EfficiencySettings';
import { makeSelectToken, makeSelectUserFacility, makeSelectID, makeSelectLogger } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  facilityName : makeSelectUserFacility(),
  userId: makeSelectID(),
  logger: makeSelectLogger()
});

export default connect(mapStateToProps, null)(EfficiencySettings);
