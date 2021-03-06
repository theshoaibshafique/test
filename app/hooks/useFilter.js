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
  const { setItemInStore, getItemFromStore } = useLocalStorage();
  const defaultState = getItemFromStore('globalFilter') ?? {}
  //rooms are Room IDs - they're translated to displays values on using an orMap
  const [rooms, setRooms] = React.useState(defaultState?.rooms ?? []);
  const [viewFirstCase, setViewFirstCase] = React.useState(defaultState?.viewFirstCase ?? false);
  const [dateLabel, setDateLabel] = React.useState(defaultState?.dateLabel ?? defaultDate);
  const [specialtyNames, setSpecialtyNames] = React.useState(defaultState?.specialtyNames ?? []);
  const [isApplied, setIsApplied] = React.useState(true)
  const selectSpecialty = (event) => {
    if (!event){
      setSpecialtyNames([])
      return;
    }
    const {
      target: { value },
    } = event;
    setSpecialtyNames(value);
  }
  React.useEffect(() => {
    const globalFilter = getItemFromStore('globalFilter');
    setItemInStore('globalFilter', { ...globalFilter, rooms, viewFirstCase, dateLabel, specialtyNames });
  }, [rooms, viewFirstCase, dateLabel, specialtyNames])
  React.useEffect(() => {
    setIsApplied(false);
  }, [rooms, dateLabel, specialtyNames])

  const selectOrs = React.useCallback((event) => {
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
    setDateLabel('All time');
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
        const globalFilter = getItemFromStore('globalFilter');
        setItemInStore('globalFilter', {
          ...globalFilter,
          fcotsThreshold: configData.fcotsThreshold,
          otsThreshold: configData.otsThreshold,
          turnoverThreshold: configData.turnoverThreshold
        });
        
      }
      // await new Promise(resolve => setTimeout(resolve, 300000))
      setIsApplied(true);
      setLoading(false);
      return configData;
    } catch (err) {
      setLoading(false);
      setIsApplied(true);
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
      setLoading(false);
      setIsApplied(true);
      if (data?.tiles?.length) {
        return cb(data);
      }

    } catch (err) {
      setLoading(false);
      setIsApplied(true);
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
    defaultHandlerConfig,
    specialtyNames, 
    selectSpecialty,
    isApplied
  };
};

export default useFilter;
