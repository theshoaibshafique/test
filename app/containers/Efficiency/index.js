import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import Efficiency from './Efficiency';
import { makeSelectToken, makeSelectUserFacility, makeSelectEmail, makeSelectIsAdmin, makeSelectLogger } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  userFacility: makeSelectUserFacility(),
  userEmail: makeSelectEmail(),
  isAdmin: makeSelectIsAdmin(),
  logger: makeSelectLogger()
});

const mapDispatchToProps = (dispatch) => {
  return {
    pushUrl: (url) => {
      dispatch(push(url));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Efficiency);
