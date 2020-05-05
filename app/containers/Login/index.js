import { connect } from 'react-redux';
import { setUserInfo, setUserFacility, setFacilityRooms, setPublishedSurveys, setMostRecentPublishedSurvey } from '../App/actions';
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
      dispatch(setUserFacility(facility.facilityName))
    },
    setFacilityRooms: (rooms) => {
      dispatch(setFacilityRooms(rooms))
    },
    setPublishedSurveys: (publishedSurveys) => {
      dispatch(setPublishedSurveys(publishedSurveys))
    },
    setMostRecentPublishedSurvey: (publishedSurvey) => {
      dispatch(setMostRecentPublishedSurvey(publishedSurvey))
    },
    pushUrl: (url) => {
      dispatch(push(url));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);