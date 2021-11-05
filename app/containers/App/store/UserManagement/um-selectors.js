/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectUM = (state) => state.get('um');

export const selectFilters = (filter) => createSelector(
  selectUM,
  (umState) => umState.get('filters')
);


export const selectUsers = () => createSelector(
  selectUM,
  (umState) => umState.get('users')
)

export const selectAssignableRoles = () => createSelector(
  selectUM,
  (umState) => umState.get('assignableRoles')
)

export const selectLocations = () => createSelector(
  selectUM,
  (umState) => umState.get('locations')
)
export const selectLocationLookups = () => createSelector(
  selectUM,
  (umState) => umState.get('locationLookups')
)