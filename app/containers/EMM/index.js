import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import EMM from './EMM';
import { makeSelectToken, makeSelectUserFacility, makeSelectSpecialties, makeSelectComplications, makeSelectOperatingRoom } from '../App/selectors';
import { showEMMReport } from '../App/emm-actions';
import { setCurrentProduct } from '../App/actions';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  userToken: makeSelectToken(),
  requestId: () => ownProps.match.params.requestid,
  userFacility: makeSelectUserFacility(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications(),
  operatingRooms: makeSelectOperatingRoom(),
});

const mapDispatchToProps = (dispatch) => {
  return {
    showEMMReport: (reportID) => { dispatch(showEMMReport(reportID)) },
    pushUrl: (url) => { dispatch(push(url)) },
    setCurrentProduct: () => {
      dispatch(setCurrentProduct('emmRoles'))
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMM);