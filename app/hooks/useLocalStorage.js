import React from 'react';

/*
* Helper hook to access localStorage when necessary
*/
const useLocalStorage = () => {
  const [error, setError] = React.useState('');

  /*
  * getItemFromStore
  * @param {string} k - The key we want to retrieve from localStorage
  */
  const getItemFromStore = (k) => {
    try {
      if (window.localStorage) {
        const storageItem = JSON.parse(window.localStorage.getItem(k));
        return storageItem;
      }
    } catch (err) {
      setError(err);
    }
  };

  /*
  * setItemInStore
  * @param {string} k - The key we want to set in localStorage
  * @param {any} v - The data we want to set in local storage
  */
  const setItemInStore = (k, v) => {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(k, JSON.stringify(v));
      }
    } catch (err) {
      setError(err);
    }
  };

  return {
    error, getItemFromStore, setItemInStore
  };
};

export default useLocalStorage;
