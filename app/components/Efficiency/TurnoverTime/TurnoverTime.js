import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import { Card as MaterialCard } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import { makeSelectToken, makeSelectUserFacility } from '../../../containers/App/selectors';
import { StyledSkeleton } from '../../../components/SharedComponents/SharedComponents';
import Header from '../Header';
import FooterText from '../FooterText';
import HorizontalBar from '../../Charts/HorizontalBar';
import useFilter from '../../../hooks/useFilter';
import useLocalStorage from '../../../hooks/useLocalStorage';
import DistributionTile from './DistributionTile';
import TimeCard from '../TimeCard';
import TrendTile from '../TrendTile';
import OvertimeCard from '../OvertimeCard';
import { getPresetDates } from '../../SharedComponents/CustomDateRangePicker';

const INITIAL_STATE = {
  tabIndex: 0,
  startDate: moment().subtract(8, 'month').startOf('month'),
  endDate: moment().subtract(8, 'month').endOf('month'),
  loading: false,
  defaultPayload: {
    roomNames: [],
    specialtyNames: [],
  }
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
const TurnoverTime = () => {
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

  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const [chartData, setChartData] = React.useState('30-day moving average');
  const [filteredChartData, setFilteredChartData] = React.useState('monthTrend');
  const [trendLineData, setTrendLineData] = React.useState([]);
  const [orGraphData, setOrGraphData] = React.useState([]);
  const [tile, setTile] = React.useState({});

  const [trendStartDate, setTrendStartDate] = React.useState('');

  const colors = ['#97E7B3', '#FFB71B', '#3DB3E3'];
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const { getItemFromStore } = useLocalStorage();
  const config = getItemFromStore('efficiencyV2')?.efficiency ?? {};


  const {
    selectGracePeriod,
    rooms,
    defaultFilterConfig,
    defaultHandlerConfig,
    applyGlobalFilter,
    fetchConfigData,
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
        const { start, end } = getPresetDates(dateLabel, 'efficiencyV2')
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
        endpoint: process.env.TURNOVER_API,
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
    const trendTile = state.tiles.find(({ title }) => title.toLowerCase().includes('trend'));
    const orTile = state.tiles.find(({ title }) => title.toLowerCase().includes('room'));
    const overtimeTile = state.tiles.find(({ title }) => title.toLowerCase().includes('overtime'));
    const timeTile = state.tiles.find(({ title }) => title.toLowerCase().includes('time'));
    const durationTile = state.tiles.find(({ title }) => title.toLowerCase().includes('duration'));
    const electiveDaysTile = state.tiles.find(({ title }) => title.toLowerCase().includes('elective'));
    const formattedData = formatLineData(trendTile?.data[filteredChartData]);
    setTrendLineData(formattedData);
    setTrendStartDate(trendTile?.data?.startDate);
    const formattedHorizontalBarData = formatBarGraphData(orTile?.data);
    setOrGraphData(formattedHorizontalBarData);
    setTile({
      time: timeTile,
      overtime: overtimeTile,
      trend: trendTile,
      duration: durationTile,
      or: orTile,
      elective: electiveDaysTile
    });
  }, [state.tiles]);

  React.useEffect(() => {
    const trendTile = state?.tiles?.find(({ title }) => title.toLowerCase().includes('trend'));
    const formattedData = formatLineData(trendTile?.data[filteredChartData]);
    setTrendLineData(formattedData);
  }, [trendStartDate, filteredChartData]);

  const toggleChartData = (e) => {
    setChartData(e.target.value);
    setFilteredChartData(e.target.value.includes('7') ? 'weekTrend' : 'monthTrend');
  };

  const formatLineData = (dataset) => dataset?.map((percentage, idx) => ({
    date: moment(trendStartDate).add(idx, 'days').valueOf(),
    percentage
  }));

  const formatBarGraphData = (dataset) => dataset?.room.map((room, i) => ({
    room,
    cleanup: dataset?.cleanup[i],
    setup: dataset?.setup[i],
    turnover: dataset?.turnover[i],
    idle: dataset?.idle[i],
    display: dataset?.display[i],
  }));

  const get30DayTooltip = () => {
    const endRange = moment(state.endDate);
    const startRange = endRange.clone().add(-29, 'day');
    return `Change in 30 day moving average from ${startRange.format('MMM D YYYY')} to ${endRange.format('MMM D YYYY')}`
  }

  const Card = loading ? StyledSkeleton : MaterialCard;
  const [cleanup, idle, setup] = tile?.or?.toolTip ?? [];
  return (
    <div className="page-container">
      <Header
        loading={loading} isApplied={isApplied}
        config={{
          ...defaultFilterConfig
        }}
        applyGlobalFilter={() => applyGlobalFilter({
          endpoint: process.env.TURNOVER_API,
          userToken,
          cancelToken: axios.CancelToken.source()
        }, {
          startDate: moment(getItemFromStore('globalFilter')?.startDate).format('YYYY-MM-DD') ?? state.startDate.format('YYYY-MM-DD'),
          endDate: moment(getItemFromStore('globalFilter')?.endDate).format('YYYY-MM-DD') ?? state.endDate.format('YYYY-MM-DD'),
          facilityName: userFacility,
          roomNames: rooms
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
          ...defaultHandlerConfig,
          grace: {
            selectGracePeriod
          }
        }}
      />
      <div className='tile-container'>
        <Grid container spacing={4} className="efficiency-container">
          <Grid item xs={12} className="efficiency-dashboard-header header-2">
            Turnover Time
          </Grid>
          <Grid item xs={3}>
            <Card className='tile-card' id='turnover-time'>
              <CardContent>
                {tile?.time && (
                  <TimeCard data={tile.time} suffix=" min" hideGoal />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card className='tile-card' id='overtime'>
              <CardContent>
                {tile?.overtime && (
                  <OvertimeCard data={tile.overtime} trendTooltip={get30DayTooltip()} reverse />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className='tile-card' id='trend'>
              <CardContent>
                {tile?.trend && (
                  <TrendTile
                    data={tile.trend}
                    trendLineData={trendLineData}
                    chartData={chartData}
                    toggleChartData={toggleChartData}
                    options={options}
                    unitTitle={'Minutes'}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="efficiency-container">
          <Grid item xs={6}>
            <Card className='tile-card' style={{ height: '375px' }} id='turnover-time-by-room'>
              <CardContent>
                {tile?.or && (
                  <React.Fragment>
                    <div className='tile-title' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                      {tile?.or?.title}
                    </div>
                    <HorizontalBar
                      legend
                      legendTooltip={{ cleanup, idle, setup }}
                      data={orGraphData}
                      xAxisLabel={{ value: 'Time (min)', offset: -10, position: 'insideBottom' }}
                      yAxisLabel={{
                        value: 'Room', angle: -90, offset: -5, position: 'insideLeft'
                      }}
                      dataKeys={['cleanup', 'idle', 'setup']}
                      colors={colors}
                      height={300}
                      margin={{
                        top: 20, right: 30, left: 20, bottom: 20
                      }}
                    />
                  </React.Fragment>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className='tile-card' style={{ height: '375px' }} id='duration-distribution'>
              <CardContent>
                {tile?.duration && (
                  <DistributionTile {...tile?.duration} />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid spacing={4} container className="efficiency-container">
            <Grid item xs={12} style={{ paddingLeft: '0px' }}>
              <FooterText
                days={tile?.elective?.value}
                facilityName={config?.facilityName}
                turnoverThreshold={config?.turnoverThreshold} />
            </Grid>
          </Grid>
        </Grid>
      </div>

    </div>
  );
};

export default TurnoverTime;
