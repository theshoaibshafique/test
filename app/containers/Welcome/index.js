import { connect } from 'react-redux';
import Welcome from './Welcome';

import { createStructuredSelector } from 'reselect';
import {
  makeSelectFacility,
  makeSelectFacilitySwitch,
  makeSelectFirstName,
  makeSelectLastName,
  makeSelectToken,
} from '../App/selectors';
import { setFacilitySwitch } from '../App/actions';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  firstName: makeSelectFirstName(),
  lastName: makeSelectLastName(),
  facility: makeSelectFacility(),
  facilitySwitch: makeSelectFacilitySwitch(),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setFacilitySwitch: (facilitySwitch) => {
      dispatch(setFacilitySwitch(facilitySwitch));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
