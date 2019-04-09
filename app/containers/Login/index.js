import { connect } from 'react-redux';
import { setUserInfo, setUserFacility, setFacilityRooms, setProcedures, setPublishedSurveys, setMostRecentPublishedSurvey } from '../App/actions';

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
    setProcedureList: (procedures) => {
      dispatch(setProcedures(procedures))
    },
    setPublishedSurveys: (publishedSurveys) => {
      dispatch(setPublishedSurveys(publishedSurveys))
    },
    setMostRecentPublishedSurvey: (publishedSurvey) => {
      dispatch(setMostRecentPublishedSurvey(publishedSurvey))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);