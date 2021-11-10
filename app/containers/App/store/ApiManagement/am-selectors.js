/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectAM = (state) => state.get('am');

export const selectFilters = (filter) => createSelector(
  selectAM,
  (amState) => amState.get('filters')
);


export const selectClients = () => createSelector(
  selectAM,
  (amState) => amState.get('clients')
)

export const selectApiAssignableRoles = () => createSelector(
  selectAM,
  (amState) => amState.get('assignableRoles')
)
