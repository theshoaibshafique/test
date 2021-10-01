import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMPublish from './EMMPublish';
import { makeSelectToken, makeSelectUserFacility, makeSelectID, makeSelectSpecialties, makeSelectComplications, makeSelectLogger, makeSelectOperatingRoom } from '../App/selectors';
import { push } from 'react-router-redux';
import { showEMMReport } from '../App/emm-actions';
import { setCurrentProduct } from '../App/actions';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  facilityName : makeSelectUserFacility(),
  userId: makeSelectID(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications(),
  operatingRooms: makeSelectOperatingRoom(),
  logger: makeSelectLogger()
});

const mapDispatchToProps = (dispatch) => {
  return {
    showEMMReport: (reportID) => { dispatch(showEMMReport(reportID)) },
    pushUrl: (url) => { dispatch(push(url)); },
    setCurrentProduct: () => {
      dispatch(setCurrentProduct('emmRoles'))
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMPublish);
