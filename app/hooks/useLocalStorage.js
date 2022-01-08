import React from 'react';

const useLocalStorage = () => {
  const [error, setError] = React.useState('');

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
