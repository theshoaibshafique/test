import { connect } from 'react-redux';
import { setUserInfo, setFacilityRooms, setSpecialties, setComplications, setOperatingRoom,  setLogger, setUserToken, setProfile, setUserStatus } from '../../containers/App/actions';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectID, makeSelectLogger, makeSelectToken } from '../App/selectors';

import Login from './Login';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  userID: makeSelectID(),
  logger: makeSelectLogger()
});

const mapDispatchToProps = (dispatch) => {
  return {
    userInfo: (token) => {
      dispatch(setUserInfo(token));
    },
    setUserToken: (token) => {
      dispatch(setUserToken(token));
    },
    setProfile: (profile) => {
      dispatch(setProfile(profile));
    },
    setUserStatus: (status) => {
      dispatch(setUserStatus(status))
    },
    // setUserFacility: (facility) => {
    //   dispatch(setUserFacility(facility))
    // },
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
    // setUserRoles: (userRoles) => {
    //   dispatch(setUserRoles(userRoles))
    // },
    setLogger: (logger) => {
      dispatch(setLogger(logger))
    },
    pushUrl: (url) => {
      dispatch(push(url));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);