import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import SSChecklist from './SSChecklist';
import { makeSelectToken, makeSelectUserFacility, makeSelectEmail,  makeSelectIsAdmin, makeSelectLogger } from '../App/selectors';
import { setCurrentProduct } from '../App/actions';

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
    },
    setCurrentProduct: () => {
      dispatch(setCurrentProduct('sscRoles'))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SSChecklist);
