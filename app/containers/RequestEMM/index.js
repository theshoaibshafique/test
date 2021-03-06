import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import RequestEMM from './RequestEMM';
import { makeSelectToken, makeSelectUserFacility, makeSelectSpecialties, makeSelectComplications, makeSelectOperatingRoom, makeSelectProductRoles } from '../App/selectors';
import { setCurrentProduct } from '../App/actions';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  userFacility: makeSelectUserFacility(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications(),
  operatingRooms: makeSelectOperatingRoom(),
  productRoles: makeSelectProductRoles()
});

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentProduct: () => {
      dispatch(setCurrentProduct('emmRoles'))
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestEMM);
