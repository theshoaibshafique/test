import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import AdminPanel from './AdminPanel';
import { makeSelectToken, makeSelectUserFacility, makeSelectID, makeSelectLogger } from '../App/selectors';
import { setCurrentProduct } from '../App/actions';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  facilityName : makeSelectUserFacility(),
  userId: makeSelectID(),
  logger: makeSelectLogger()
});

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentProduct: () => {
      dispatch(setCurrentProduct('umRoles'))
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);
