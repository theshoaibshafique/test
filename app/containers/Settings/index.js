import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Settings from './Settings';
import { makeSelectToken, makeSelectUserFacility, makeSelectID, makeSelectLogger, makeSelectProductRoles } from '../App/selectors';
import { setCurrentProduct } from '../App/actions';
import { exitUserManagement, setAssignableRoles, setLocationList, setUsers } from '../App/store/UserManagement/um-actions';

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
    setAssignableRoles: (roles) => {
      dispatch(setAssignableRoles(roles))
    },
    setLocations: (locations) => {
      dispatch(setLocationList(locations))
    },
    exitUserManagement: () => {
      dispatch(exitUserManagement())
    },
    setUsers: (users) => {
      dispatch(setUsers(users))
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
