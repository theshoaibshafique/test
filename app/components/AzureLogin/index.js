import { connect } from 'react-redux';
import { setUserInfo, setUserFacility, setFacilityRooms, setSpecialties, setComplications, setPublishedSurveys, setMostRecentPublishedSurvey } from '../../containers/App/actions';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectID, makeSelectToken, makeSelectSpecialties, makeSelectComplications } from '../../containers/App/selectors';

import AzureLogin from './AzureLogin';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  userID: makeSelectID(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications()
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
    setSpecialtyList: (specialties) => {
      dispatch(setSpecialties(specialties))
    },
    setComplicationList: (complications) => {
      dispatch(setComplications(complications))
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