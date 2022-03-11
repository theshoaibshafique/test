import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import { Card as MaterialCard } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Header from '../Header';
import FooterText from '../FooterText';
import TimeCard from '../TimeCard';
import TrendTile from '../TrendTile';
import OvertimeCard from '../OvertimeCard';
import DistributionTile from '../BlockUtilization/DistributionTile';
import ProcedureList from '../CaseScheduling/ProcedureList';
import { makeSelectToken, makeSelectUserFacility } from '../../../containers/App/selectors';
import useSelectData from '../../../hooks/useSelectData';
import useFilter from '../../../hooks/useFilter';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { StyledSkeleton } from '../../SharedComponents/SharedComponents';
import { getPresetDates } from '../../SharedComponents/CustomDateRangePicker';

const INITIAL_STATE = {
  tabIndex: 0,
  // startDate: moment().subtract(1, 'weeks').startOf('week'),
  // endDate: moment().subtract(1, 'weeks').endOf('week'),
  startDate: moment().subtract(8, 'months').startOf('month'),
  endDate: moment().subtract(1, 'months').endOf('month'),
  loading: false,
  defaultPayload: {
    roomNames: [],
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_TILE_DATA':
      return {
        ...state,
        tiles: action.payload.tiles
      };
    case 'SET_FILTER_DATE':
      return {
        ...state,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate
      };
    default:
      return state;
  }
};


const CaseScheduling = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const [tile, setTile] = React.useState('');
  const [trendStartDate, setTrendStartDate] = React.useState('');
  const [chartData, setChartData] = React.useState('30-day moving average');
  const [filteredChartData, setFilteredChartData] = React.useState('monthTrend');
  const [trendLineData, setTrendLineData] = React.useState([]);
  const [procedureListData, setProcedureListData] = React.useState([]);

  const options = [
    {
      id: 1,
      value: '30-day moving average'
    },
    {
      id: 2,
      value: '7-day moving average'
    }
  ];



  const { getItemFromStore } = useLocalStorage();

  const {
    defaultHandlerConfig,
    defaultFilterConfig,
    fetchConfigData,
    applyGlobalFilter,
    rooms,
    loading,
    isApplied
  } = useFilter();

  React.useEffect(() => {
    const fetchData = async () => {
      const defaultConfig = await fetchConfigData({ userFacility, userToken, cancelToken: axios.CancelToken.source() });
      const config = getItemFromStore('globalFilter');
      const { rooms, dateLabel } = config ?? defaultConfig;
      let body = null;
      if (config) {
        const {start,end} = getPresetDates(dateLabel)
        body = {
          ...state.defaultPayload,
          facilityName: userFacility,
          startDate: moment(start).format('YYYY-MM-DD'),
          endDate: moment(end).format('YYYY-MM-DD'),
          roomNames: rooms ?? [],
        }
      } else {
        const { endDate } = defaultConfig ?? {};
        const startDate = moment(endDate)?.subtract(1, 'month');
        body = {
          ...state.defaultPayload, facilityName: userFacility, startDate: startDate.format('YYYY-MM-DD'), endDate: moment(endDate).format('YYYY-MM-DD')
        }
      }
      // GET data from the efficiency API using a POST request, passing in pieces of data that will be used to determine the initial response to populate the page    
      await applyGlobalFilter({
        endpoint: process.env.SCHEDULING_API,
        userToken,
        cancelToken: axios.CancelToken.source()
      },
        body,
        (data) => {
          if (data?.tiles) {
            dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data?.tiles } });
            dispatch({ type: 'SET_FILTER_DATE', payload: body });
          }
        }
      )
    }
    fetchData();
  }, []);


  React.useEffect(() => {
    if (!state.tiles) return;

    const scheduleTile = state.tiles.find(({ identifier }) => identifier.toLowerCase() === 'main');
    const overtimeTile = state.tiles.find(({ identifier }) => identifier.toLowerCase() === 'overtime');
    const trendTile = state.tiles.find(({ identifier }) => identifier.toLowerCase().includes('trend'));
    const electiveTile = state.tiles.find(({ identifier }) => identifier.toLowerCase().includes('days'));
    const procedureTile = state.tiles.find(({ identifier }) => identifier.toLowerCase().includes('summary'));
    const delaysTile = state.tiles.find(({ identifier }) => identifier.toLowerCase().includes('absolute distribution'));
    setTrendStartDate(trendTile?.data?.startDate);
    setTile({
      schedule: scheduleTile,
      overtime: overtimeTile,
      trend: trendTile,
      elective: electiveTile,
      procedure: procedureTile,
      delays: delaysTile
    });
  }, [state.tiles]);

  React.useEffect(() => {
    const trendTile = tile?.trend;
    const procedureTile = tile?.procedure;
    const formattedProcedureListData = formatProcedureListData(procedureTile?.data);
    setProcedureListData(formattedProcedureListData);
    setTrendStartDate(trendTile?.data?.startDate);
    const formattedData = formatLineData(trendTile?.data[filteredChartData]);
    setTrendLineData(formattedData);
  }, [tile]);

  React.useEffect(() => {
    const trendTile = tile?.trend;
    const formattedData = formatLineData(trendTile?.data[filteredChartData]);
    setTrendLineData(formattedData);
  }, [filteredChartData, tile]);

  const formatLineData = (dataset) => dataset?.map((percentage, idx) => ({
    date: moment(trendStartDate).add(idx, 'days').valueOf(),
    percentage
  }));


  const formatProcedureListData = (dataset) => dataset?.procedure?.map((procedure, idx) => {
    return {
      id: uuidv4(),
      procedure,
      case: dataset?.cases[idx],
      percentage: dataset?.percentageChange[idx],
      mean: dataset?.mean[idx],
      allTimeMean: dataset?.allTimeMean[idx],
      allTimeMedian: dataset?.allTimeMedian[idx],
      allTimeSd: dataset?.allTimeSd[idx],
      allTimeCases: dataset?.allTimeCases[idx],
      underscheduled: dataset?.underscheduledPercentage[idx],
      shape: dataset?.shape[idx],
      scale: dataset?.scale[idx],
    }
  });

  const toggleChartData = (e) => {
    setChartData(e.target.value);
    setFilteredChartData(e.target.value.includes('7') ? 'weekTrend' : 'monthTrend');
  };

  const get30DayTooltip = () => {
    const endRange = moment(state.endDate);
    const startRange = endRange.clone().add(-30, 'day');
    return `Change in 30 day moving average from ${startRange.format('MMM D YYYY')} to ${endRange.format('MMM D YYYY')}`
  }

  const Card = loading ? StyledSkeleton : MaterialCard;
  return (
    <div className="page-container">
      <Header
        loading={loading} isApplied={isApplied}
        config={{ ...defaultFilterConfig }}
        applyGlobalFilter={() => applyGlobalFilter({
          endpoint: process.env.SCHEDULING_API,
          userToken,
          cancelToken: axios.CancelToken.source()
        }, {
          startDate: moment(getItemFromStore('globalFilter')?.startDate).format('YYYY-MM-DD') ?? state.startDate.format('YYYY-MM-DD'),
          endDate: moment(getItemFromStore('globalFilter')?.endDate).format('YYYY-MM-DD') ?? state.endDate.format('YYYY-MM-DD'),
          facilityName: userFacility,
          roomNames: rooms,
        },
          (tileData) => {
            if (tileData?.tiles?.length) {
              dispatch({ type: 'SET_TILE_DATA', payload: { tiles: tileData.tiles } });
              dispatch({
                type: 'SET_FILTER_DATE', payload: {
                  startDate: moment(getItemFromStore('globalFilter')?.startDate).format('YYYY-MM-DD') ?? state.startDate.format('YYYY-MM-DD'),
                  endDate: moment(getItemFromStore('globalFilter')?.endDate).format('YYYY-MM-DD') ?? state.endDate.format('YYYY-MM-DD'),
                }
              });
            }
          }
        )}
        handlers={{
          ...defaultHandlerConfig
        }}
      />
      <Grid container spacing={4} className="efficiency-container tile-container">
        <Grid item xs={12} className="efficiency-dashboard-header header-2">
          Case Scheduling
        </Grid>
        <Grid item container spacing={0} xs={6} style={{ paddingRight: '0px', paddingBottom: 0 }} className="efficiency-container">
          <Grid container item xs={12} spacing={4} style={{ paddingBottom: 32 }}>
            <Grid item xs={6} >
              <Card className='tile-card' id='case-underscheduled'>
                <CardContent>
                  {tile?.schedule && (
                    <TimeCard data={tile.schedule} hideGoal />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} style={{ paddingRight: 0 }} >
              <Card className='tile-card' id='overtime'>
                <CardContent>
                  {tile?.overtime && (
                    <OvertimeCard data={tile.overtime} reverse trendTooltip={get30DayTooltip()} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={4} style={{ paddingBottom: 32 }}>
            <Grid item xs={12} style={{ paddingRight: 0 }}>
              <Card className='tile-card' id='trend'>
                <CardContent>
                  {tile?.trend && (
                    <TrendTile
                      data={tile.trend}
                      toggleChartData={toggleChartData}
                      trendLineData={trendLineData}
                      options={options}
                      chartData={chartData}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={4} style={{ paddingBottom: 32 }}>
            <Grid item xs={12} style={{ paddingRight: 0 }}>
              <Card className='tile-card' id='change-in-delay'>
                <CardContent>
                  {tile?.delays && (
                    <DistributionTile
                      {...tile.delays}
                      xAxisLabel={tile.delays.independentVarTitle}
                      yAxisLabel={tile.delays.dependentVarTitle} singleColour
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} >
          <Card className='tile-card' style={{ height: 1084 }} id='procedure-list'>
            <CardContent style={{ padding: 0, position: 'relative' }}>
              {tile?.procedure && (
                <ProcedureList
                  title={tile.procedure.title}
                  networkAverage={tile.procedure.data?.networkAverage}
                  procedureData={procedureListData}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid spacing={4} container className="efficiency-container">
          <Grid item xs={12} style={{ paddingLeft: '0px' }}>
            <FooterText days={tile?.elective?.value} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
export default CaseScheduling;
