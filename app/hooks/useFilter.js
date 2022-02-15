import React from 'react';
import { request } from '../utils/global-functions';
import useLocalStorage from './useLocalStorage';

const defaultPayload = {
  roomNames: [],
  specialtyNames: []
};

const useFilter = () => {
  const [loading, setLoading] = React.useState(false);
  //rooms are Room IDs - they're translated to displays values on using an orMap
  const [rooms, setRooms] = React.useState([]);
  const [viewFirstCase, setViewFirstCase] = React.useState(false);

  const selectOrs = React.useCallback(( event) => {
    const {
      target: { value },
    } = event;
    setRooms(value);
  }, []);

  React.useEffect(() => () => {
    setRooms([]);
  }, []);

  const clearFilters = () => {
    setRooms([]);
  };

  const applyGlobalFilter = async ({ endpoint, userToken, cancelToken }, payload, cb) => {
    setLoading(true);
    let data = null;
    try {
      const requestPayload = {
        ...defaultPayload,
        ...payload
      };
      const retrieveTileData = request('post');
      data = await retrieveTileData(endpoint, userToken, requestPayload, cancelToken);
      if (data?.tiles?.length) {
        return cb(data);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
    return cb(data);
  };

  const toggleFirstCaseOnTime = React.useCallback(() => {
    setViewFirstCase((prev) => !prev);
  }, [viewFirstCase]);

  const defaultFilterConfig = {
    date: true,
    room: true
  };

  const defaultHandlerConfig = {
    clearFilters,
    room: {
      selectOrs,
      orFilterVal: rooms
    }
  };

  return {
    loading,
    rooms,
    selectOrs,
    clearFilters,
    applyGlobalFilter,
    toggleFirstCaseOnTime,
    viewFirstCase,
    defaultFilterConfig,
    defaultHandlerConfig
  };
};

export default useFilter;
