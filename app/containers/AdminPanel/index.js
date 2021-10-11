import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import AdminPanel from './AdminPanel';
import { makeSelectToken, makeSelectUserFacility, makeSelectID, makeSelectLogger, makeSelectProductRoles } from '../App/selectors';
import { setCurrentProduct } from '../App/actions';
import { setUsers } from '../App/store/UserManagement/um-actions';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  facilityName : makeSelectUserFacility(),
  userId: makeSelectID(),
  logger: makeSelectLogger(),
  productRoles: makeSelectProductRoles()
});

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentProduct: () => {
      dispatch(setCurrentProduct('umRoles'))
    },
    setUsers: (users) => {
      dispatch(setUsers(users))
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);
