import { connect } from 'react-redux';
import { setUserInfo, setUserFacility, setFacilityRooms } from '../App/actions';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectID, makeSelectToken } from '../App/selectors';

import Login from './Login';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  userID: makeSelectID()
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
    pushUrl: (url) => {
      dispatch(push(url));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);