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
import { UM_ASSIGNABLE_ROLES, UM_FILTERS, UM_LOCATION, UM_USERS } from '../../constants';

// The initial state of the App
const initialState = fromJS({
  filters: null,
  users: null,
  assignableRoles: {},
  locationLookups: {}
});

function umReducer(state = initialState, action) {
  switch (action.type) {
    case UM_FILTERS:
      return state
        .set('filters', { ...action.filters }) //This is done to trigger a rerender
    case UM_USERS:
      return state
        .set('users', action.users)
    case UM_ASSIGNABLE_ROLES:
      return state
        .set('assignableRoles', action.roles)
    case UM_LOCATION:
      const locations = action.locations || {}
      const locationLookups = {}
      //Create a lookups list for translation and dropdown generation
      //We hide onlyChilds in dropdowns
      const hospitals = Object.entries(locations)
      hospitals?.forEach(([hId, h]) => {
        locationLookups[hId] = { scopeId: 1, name: h?.name }
        const facilities = Object.entries(h?.facilities);
        facilities.forEach(([fId, f]) => {
          locationLookups[fId] = { scopeId: 2, name: f?.name }
          const departments = Object.entries(f?.departments);
          departments.forEach(([dId, d]) => {
            locationLookups[dId] = { scopeId: 3, name: d?.name }
            const rooms = Object.entries(d?.rooms)
            rooms.forEach(([rId, r]) => {
              locationLookups[rId] = { scopeId: 4, name: r?.name }
            })
          })
        })
      })
      return state
        .set('locations', locations)
        .set('locationLookups', locationLookups)

    default:
      return state;
  }
}

export default umReducer;
