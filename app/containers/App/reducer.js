/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';
import {
  CD_PRODUCT_ID,
  EFF_PRODUCT_ID,
  EMM_PRODUCT_ID,
  SSC_PRODUCT_ID,
  SST_ADMIN_ID,
  UM_PRODUCT_ID,
} from '../../constants';

import {
  AUTH_LOGIN,
  COMPLICATIONS,
  CURRENT_PRODUCT,
  EXIT_SNACKBAR,
  FACILITY_DETAILS,
  FACILITY_ROOMS,
  LOGGER,
  OPERATING_ROOM,
  PROFILE,
  SPECIALTIES,
  TOGGLE_SNACKBAR,
  USER_FACILITY,
  USER_ROLES,
  USER_STATUS,
  USER_TOKEN,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  userToken: null,
  userName: null,
  userID: null,
  firstName: null,
  lastName: null,
  email: null,
  jobTitle: null,
  userFacility: null,
  facilityRooms: [],
  specialties: [],
  complications: [],
  operatingRoom: [],
  userRoles: [],
  snackbar: []
});



function emmReducer(state = initialState, action) {
  switch (action.type) {
    case USER_TOKEN:
      return state
        .set('userToken', action.token.jwtAccessToken)
        .set('userName', action.token.user.name)
        .set('userID', action.token.user.idToken.sub)
        .set('userLoggedIn', true)
        .set('firstName', action.token.user.idToken.given_name)
        .set('lastName', action.token.user.idToken.family_name)
        .set('email', action.token.user.idToken.email)
        .set('jobTitle', action.token.user.idToken.job_title);
    case USER_STATUS:
      return state
        .set('userStatus', action.status)
    case AUTH_LOGIN:
      return state
        .set('userToken', action.accessToken)
        .set('userLoggedIn', true);
    case PROFILE:
      return setProductRoles(state, action.profile.roles)
        .set('userID', action.profile.userId)
        .set('email', action.profile.email)
        .set('userFacility', action.profile.facilityId)
        .set('firstName', action.profile.firstName)
        .set('lastName', action.profile.lastName)
        .set('jobTitle', action.profile.title)
    case FACILITY_DETAILS:
      return state
        .set('facilityDetails', action.facilityDetails)
    case USER_FACILITY:
      return state
        .set('userFacility', action.facility)
    case FACILITY_ROOMS:
      return state
        .set('facilityRooms', action.rooms)
    case SPECIALTIES:
      return state
        .set('specialties', action.specialties)
    case COMPLICATIONS:
      return state
        .set('complications', action.complications)
    case OPERATING_ROOM:
      return state
        .set('operatingRoom', action.operatingRoom)
    case USER_ROLES:
      return state
        .set('userRoles', action.userRoles)
    case LOGGER:
      return state
        .set('logger', action.logger)
    case TOGGLE_SNACKBAR:
      return state
        .set('snackbar', [...state.get('snackbar'), action.snackbar])
    case EXIT_SNACKBAR:
      return state
        .set('snackbar', state.get('snackbar')?.slice?.(1))
    case CURRENT_PRODUCT:
      return state
        .set('currentProduct', { ...state.get(action.currentProduct) });
    default:
      return state;
  }
}

function setProductRoles(state, userRoles) {
  if (!userRoles) {
    return state;
  }
  const createProduct = (permissions) => {
    return {
      ...permissions,
      get all() {
        return Object.values(permissions);
      },
      get isAdmin() {
        return userRoles?.[this.admin];
      },
      get hasPublisher() {
        return userRoles?.[this.publisher]
      },
      get hasAccess() {
        return userRoles?.[this.reader];
      }
    }
  };
  return state
    .set('userRoles', userRoles)
    .set('isSSTAdmin', Boolean(userRoles?.[SST_ADMIN_ID]))
    .set('cdRoles', createProduct({
      name: "Case Discovery",
      productId: CD_PRODUCT_ID,
      admin: "b398657c-ee31-4ce6-8dda-941a600ea01a",
      publisher: "24d372e8-715a-47a7-ae64-dbacd377d0a6",
      reader: "d813f651-af9c-49e9-ad80-83246873d6f3"
    }))
    .set('effRoles', createProduct({
      name: "Efficiency",
      productId: EFF_PRODUCT_ID,
      admin: "c365cf5f-4993-4c1c-b4bb-cd5596fee06b",
      reader: "48ba6489-5d9b-4a19-8ea4-8ac624175f85"
    }))
    .set('sscRoles', createProduct({
      name: "Surgical Safety Checklist",
      productId: SSC_PRODUCT_ID,
      admin: "aaa17cff-b469-4989-baa0-283ebd82fc7b",
      reader: "df561f9b-b8fe-47a8-aa0a-bdc5db29a77f"
    }))
    .set('emmRoles', createProduct({
      name: "eM&M",
      productId: EMM_PRODUCT_ID,
      admin: "04cf63ff-4274-4271-b74d-bc71d0a210db",
      publisher: "eb1460d7-4b6d-4ce3-8bc4-b6d0eb1864f1",
      reader: "9467994d-4ad6-4ad9-9b4e-8ab2125c974f"
    }))
    .set('umRoles', createProduct({
      name: "User Management",
      productId: UM_PRODUCT_ID,
      sstAdmin: "5ec12e15-5ddc-4395-b0bf-1d5ae83fe0fa",
      reader: "7007d686-2b1d-461c-a258-e7737eaeae7d",
      admin: "d5e22d93-2cb3-49a5-b710-956b098ff28e",
      member: "333ee932-1f6a-4577-8266-a58b4e62b72e"
    }))
}

export default emmReducer;
