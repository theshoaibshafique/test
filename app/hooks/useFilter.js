import React from 'react';
import { request } from '../utils/global-functions';

const defaultPayload = {
  roomNames: [],
  specialtyNames: []
};

const useFilter = () => {
  const [loading, setLoading] = React.useState(false);
  const [rooms, setRooms] = React.useState([]);
  const [orFilterVal, setOrFilterVal] = React.useState([]);
  const [viewFirstCase, setViewFirstCase] = React.useState(false);

  const selectOrs = React.useCallback((_, value) => {
    setRooms(value.map(({ id }) => id));
    setOrFilterVal(value);
  }, []);

  React.useEffect(() => () => {
    setRooms([]);
    setOrFilterVal([]);
  }, []);

  const clearFilters = () => {
    setRooms([]);
    setOrFilterVal([]);
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
      orFilterVal
    }
  };

  return {
    loading,
    rooms,
    selectOrs,
    clearFilters,
    orFilterVal,
    applyGlobalFilter,
    toggleFirstCaseOnTime,
    viewFirstCase,
    defaultFilterConfig,
    defaultHandlerConfig
  };
};

export default useFilter;
