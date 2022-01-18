import React from 'react';

const defaultPayload  = {
  roomNames: [],
  specialtyNames: []
};

const useFilter = () => {
  const [rooms, setRooms] = React.useState([]);
  const [orFilterVal, setOrFilterVal] = React.useState([]);
  const [viewFirstCase, setViewFirstCase] = React.useState(false);

  const selectOrs = React.useCallback((_, value) => {
    setRooms(value.map(({ id }) => id));
    setOrFilterVal(value);
  }, []);

  const selectGracePeriod = React.useCallback((_, value) => {

  }, []);

  React.useEffect(() => () => {
    setRooms([]);
    setOrFilterVal([]);
  }, []);

  const clearFilters = () => {
    setRooms([]);
    setOrFilterVal([]);
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
    rooms,
    selectOrs,
    clearFilters,
    orFilterVal,
    selectGracePeriod,
    toggleFirstCaseOnTime,
    viewFirstCase,
    defaultFilterConfig,
    defaultHandlerConfig
  };
};

export default useFilter;
