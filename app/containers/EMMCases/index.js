import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import EMMCases from './EMMCases';
import { makeSelectToken, makeSelectUserFacility, makeSelectEmail, makeSelectSpecialties, makeSelectComplications } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  userFacility: makeSelectUserFacility(),
  userEmail: makeSelectEmail(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications()
});

const mapDispatchToProps = (dispatch) => {
  return {
    pushUrl: (url) => {
      dispatch(push(url));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMCases);
