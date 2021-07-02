import { connect } from 'react-redux';
import { setUserInfo, setUserFacility, setFacilityRooms, setSpecialties, setComplications, setOperatingRoom, setUserRoles, setLogger } from '../../containers/App/actions';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectID, makeSelectToken, makeSelectSpecialties, makeSelectComplications, makeSelectUserFacility, makeSelectLogger } from '../../containers/App/selectors';

import AzureLogin from './AzureLogin';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  userID: makeSelectID(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications(),
  userFacility: makeSelectUserFacility(),
  logger: makeSelectLogger()
});

const mapDispatchToProps = (dispatch) => {
  return {
    userInfo: (token) => {
      dispatch(setUserInfo(token));
    },
    setUserFacility: (facility) => {
      dispatch(setUserFacility(facility))
    },
    setFacilityRooms: (rooms) => {
      dispatch(setFacilityRooms(rooms))
    },
    setSpecialtyList: (specialties) => {
      dispatch(setSpecialties(specialties))
    },
    setComplicationList: (complications) => {
      dispatch(setComplications(complications))
    },
    setOperatingRoom: (operatingRooms) => {
      dispatch(setOperatingRoom(operatingRooms))
    },
    setUserRoles: (userRoles) => {
      dispatch(setUserRoles(userRoles))
    },
    setLogger: (logger) => {
      dispatch(setLogger(logger))
    },
    pushUrl: (url) => {
      dispatch(push(url));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AzureLogin);