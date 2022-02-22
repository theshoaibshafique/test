import React from 'react';
import { request } from '../utils/global-functions';
import useLocalStorage from './useLocalStorage';

const defaultPayload = {
  roomNames: [],
  specialtyNames: []
};
const defaultDate = 'Most recent month';
const useFilter = () => {
  const [loading, setLoading] = React.useState(false);
  //rooms are Room IDs - they're translated to displays values on using an orMap
  const [rooms, setRooms] = React.useState([]);
  const [viewFirstCase, setViewFirstCase] = React.useState(false);
  const [dateLabel, setDateLabel] = React.useState(defaultDate);
  const { setItemInStore } = useLocalStorage();

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
    setDateLabel(defaultDate);
  };
  const fetchConfigData = async ({ userFacility, userToken, cancelToken }, payload, cb) => {
    // @TODO: hook up loading animation if necessary, not currently hooked up in any way
    setLoading(true);
    try {
      const retrieveConfiguration = request('get');
      const configData = await retrieveConfiguration(`${process.env.CONFIGURATION_API}?facility_id=${userFacility}`, userToken, null, cancelToken);
      if (configData) {
        setItemInStore('efficiencyV2', {
          efficiency: configData
        });
        setItemInStore('globalFilter', {
          startDate: configData.startDate,
          endDate: configData.endDate,
          fcotsThreshold: configData.fcotsThreshold,
          otsThreshold: configData.otsThreshold,
          turnoverThreshold: configData.turnoverThreshold
        });
        
      }

      setLoading(false);
      return configData;
    } catch (err) {
      setLoading(false);
    }
    
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
    },
    date: {
      dateLabel, setDateLabel
    }
  };

  return {
    loading,
    rooms,
    selectOrs,
    clearFilters,
    applyGlobalFilter,
    fetchConfigData,
    toggleFirstCaseOnTime,
    viewFirstCase,
    defaultFilterConfig,
    defaultHandlerConfig
  };
};

export default useFilter;
