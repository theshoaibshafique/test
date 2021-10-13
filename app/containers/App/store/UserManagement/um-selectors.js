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

