import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SSTNav from './SSTNav';
import { setFacilityDetails, setProfile } from '../../containers/App/actions';
import { makeFacilityDetails, makeSelectUserFacility } from '../../containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  userFacility: makeSelectUserFacility(),
  facilityDetails: makeFacilityDetails(),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setProfile: (profile) => {
      dispatch(setProfile(profile));
    },
    setFacilityDetails: (facilityDetails) => {
      dispatch(setFacilityDetails(facilityDetails));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SSTNav);
