/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');

const selectRoute = (state) => state.get('route');

const makeSelectToken = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('userToken')
);

const makeSelectUserStatus = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('userStatus')
);

const makeSelectID = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('userID')
);

const makeSelectUserLoggedIn = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('userLoggedIn')
);

const makeSelectRepos = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['userData', 'repositories'])
);

const makeSelectLocation = () => createSelector(
  selectRoute,
  (routeState) => routeState.get('location').toJS()
);

const makeSelectSpecialties = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('specialties')
);

const makeSelectComplications = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('complications')
);

const makeSelectOperatingRoom = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('operatingRoom')
);

const makeSelectFacilityRooms = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('facilityRooms')
);

const makeSelectUserFacility = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('userFacility')
);

const makeSelectFirstName = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('firstName')
);

const makeSelectLastName = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('lastName')
);

const makeSelectEmail = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('email')
);

const makeSelectJobTitle = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('jobTitle')
);

const makeSelectEMMPresenter = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('emmRoles')?.isAdmin
);

const makeSelectIsAdmin = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentProduct')?.isAdmin
);

const makeSelectRoles = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('userRoles')
);

const makeSelectIsSSTAdmin = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('isSSTAdmin')
);

const makeSelectLogger = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('logger')
);

const makeSelectProductRoles = (useProductId) => createSelector(
  selectGlobal,
  (globalState) => {
    const result = {};
    const products = ['cdRoles', 'effRoles', 'sscRoles', 'emmRoles', 'umRoles'];
    for (var product of products) {
      const roles = globalState.get(product);
      result[useProductId ? roles?.productId : product] = roles
    }
    return result
  }
)

const makeSelectSnackbar = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('snackbar')
)


export {
  selectGlobal,
  makeSelectToken,
  makeSelectUserStatus,
  makeSelectUserLoggedIn,
  makeSelectID,
  makeSelectRepos,
  makeSelectLocation,
  makeSelectSpecialties,
  makeSelectComplications,
  makeSelectOperatingRoom,
  makeSelectFacilityRooms,
  makeSelectUserFacility,
  makeSelectFirstName,
  makeSelectLastName,
  makeSelectEmail,
  makeSelectJobTitle,
  makeSelectEMMPresenter,
  makeSelectIsAdmin,
  makeSelectRoles,
  makeSelectIsSSTAdmin,
  makeSelectLogger,
  makeSelectProductRoles,
  makeSelectSnackbar
};
