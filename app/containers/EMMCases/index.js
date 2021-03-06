import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import EMMCases from './EMMCases';
import { makeSelectToken, makeSelectUserFacility, makeSelectEmail, makeSelectSpecialties, makeSelectComplications, makeSelectOperatingRoom, makeSelectLogger } from '../App/selectors';
import { showEMMReport } from '../App/store/EMM/emm-actions';
import { setCurrentProduct } from '../App/actions';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  userFacility: makeSelectUserFacility(),
  userEmail: makeSelectEmail(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications(),
  operatingRooms: makeSelectOperatingRoom(),
  logger: makeSelectLogger()
});

const mapDispatchToProps = (dispatch) => {
  return {
    pushUrl: (url) => {dispatch(push(url))},
    showEMMReport: (reportID) => {dispatch(showEMMReport(reportID))},
    setCurrentProduct: () => {
      dispatch(setCurrentProduct('emmRoles'))
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMCases);
