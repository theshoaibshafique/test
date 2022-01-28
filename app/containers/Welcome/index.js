import { connect } from 'react-redux';
import Welcome from './Welcome';

import { createStructuredSelector } from 'reselect';
import {
  makeFacilityDetails,
  makeSelectFirstName,
  makeSelectLastName,
  makeSelectToken,
  makeSelectUserFacility,
} from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  firstName: makeSelectFirstName(),
  lastName: makeSelectLastName(),
  userFacility: makeSelectUserFacility(),
  facilityDetails: makeFacilityDetails(),
});

export default connect(mapStateToProps, null)(Welcome);
