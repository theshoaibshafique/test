import { connect } from 'react-redux';
import { setUserInfo, setUserFacility, setFacilityRooms, setProcedures, setPublishedSurveys, setMostRecentPublishedSurvey } from '../../containers/App/actions';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectID, makeSelectToken } from '../../containers/App/selectors';

import AzureLogin from './AzureLogin';

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
    },
    pushUrl: (url) => {
      dispatch(push(url));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AzureLogin);