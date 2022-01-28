import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SSTNav from './SSTNav';
import { setFacilityDetails, setFacilitySwitch, setProfile } from '../../containers/App/actions';
import { makeSelectFacility } from '../../containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  userFacility: makeSelectFacility(),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setProfile: (profile) => {
      dispatch(setProfile(profile));
    },
    setFacilityDetails: (facilityDetails) => {
      dispatch(setFacilityDetails(facilityDetails));
    },
    setFacilitySwitch: (facilitySwitch) => {
      dispatch(setFacilitySwitch(facilitySwitch));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SSTNav);
