import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Card from '@material-ui/core/Card';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CardContent from '@material-ui/core/CardContent';
import { request } from '../../../utils/global-functions';
import Header from '../Header';
import FooterText from '../FooterText';
import { makeSelectToken, makeSelectUserFacility } from '../../../containers/App/selectors';
import { LightTooltip } from '../../../components/SharedComponents/SharedComponents';
import Donut from '../../Charts/Donut';
import TrendTile from '../TrendTile';
import TimeCard from '../TimeCard';
import OvertimeCard from '../OvertimeCard';
import DistributionTile from './DistributionTile';
import './styles.scss';
import useLocalStorage from '../../../hooks/useLocalStorage';
import useSelectData from '../../../hooks/useSelectData';
import useFilter from '../../../hooks/useFilter';

const INITIAL_STATE = {
  tabIndex: 0,
  // startDate: moment().subtract(1, 'weeks').startOf('week'),
  // endDate: moment().subtract(1, 'weeks').endOf('week'),
  startDate: moment().subtract(8, 'months').startOf('month'),
  endDate: moment().subtract(1, 'months').endOf('month'),
  defaultPayload: {
    roomNames: [],
    specialtyNames: []
  },
  loading: false,
};

const filteredKeys = ['average_hours', 'average_minutes', 'days'];

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

const DONUT_COLOURS = ['#A77ECD', '#50CBFB', '#FFDB8C', '#97E7B3'];

const equalProps = (props, prevProps) => props === prevProps;

const BlockUtilization = React.memo(() => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const { getItemFromStore } = useLocalStorage();
  const { rooms, defaultFilterConfig, defaultHandlerConfig } = useFilter();
  const [tile, setTile] = React.useState({});
  const [trendStartDate, setTrendStartDate] = React.useState('');

  const [sort, setSort] = React.useState({
    key: 'block',
    order: {
      block: true,
      change: false,
      room: false
    }
  });

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

  const { data } = useSelectData(process.env.BLOCKUTILIZATION_API, userToken, {...state.defaultPayload, facilityName: userFacility, startDate: state.startDate.format('YYYY-MM-DD'), endDate: state.endDate.format('YYYY-MM-DD')}, axios.CancelToken.source())

  const [chartData, setChartData] = React.useState('30-day moving average');
  const [filteredChartData, setFilteredChartData] = React.useState('month_trend');
  const [trendLineData, setTrendLineData] = React.useState([]);

  React.useEffect(() => {
    if (!data) return;
    dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data } });
  }, [data]);

  React.useEffect(() => {
    if (!!state.tiles) {
      const utilizationTile = state.tiles.find(({ title }) => title.toLowerCase().includes('block utilization'));
      const trendTile = state.tiles.find(({ title }) => title.toLowerCase().includes('trend'));
      const otTile = state.tiles.find(({ title }) => title.toLowerCase().includes('overtime'));
      const compositionTile = state.tiles.find(({ title }) => title.toLowerCase().includes('composition'));
      const roomTile = state.tiles.find(({ title }) => title.toLowerCase().includes('room'));
      const endGapTile = state.tiles.find(({ title }) => title.toLowerCase().includes('end gap'));
      const startGapTile = state.tiles.find(({ title }) => title.toLowerCase().includes('start gap'));
      const electiveDaysTile = state.tiles.find(({ title }) => title.toLowerCase().includes('elective'));

      setTrendStartDate(trendTile?.data?.start_date);
      setTile({
        trend: trendTile,
        composition: compositionTile,
        overtime: otTile,
        blockUtilization: utilizationTile,
        endGap: endGapTile,
        startGap: startGapTile,
        room: roomTile,
        elective: electiveDaysTile,
      });
    }
  }, [state.tiles]);

  React.useEffect(() => {
    const trendTile = tile?.trend;
    setTrendStartDate(trendTile?.data?.start_date)
    const formattedData = formatLineData(trendTile?.data[filteredChartData]);
    setTrendLineData(formattedData); 
  }, [tile]);

  React.useEffect(() => {
    const trendTile = tile?.trend;
    const formattedData = formatLineData(trendTile?.data[filteredChartData]);
    setTrendLineData(formattedData); 
  }, [filteredChartData, tile]);

  const filterKeys = ([key,]) => {
    return !filteredKeys.includes(key);
  };

  const formatDonutData = (data) => Object.entries(data).filter(filterKeys).reduce((acc, [key, val], i) => acc.concat({
    name: key,
    value: val,
    color: DONUT_COLOURS[i - 1] 
  }), []);

  const formatLineData = (dataset) => {
    return dataset?.map((percentage, idx) => {
        return {
          date: moment(trendStartDate).add(idx, 'days').valueOf(),
          percentage
      }
    });
  };

  const toggleChartData = (e) => {
    setChartData(e.target.value);
    setFilteredChartData(e.target.value.includes('7') ? 'week_trend' : 'month_trend');
  };

  const transformRoomData = (room, momentum, percentage, cb) => {
    const transformed = room?.map((or, i) => ({
      id: Math.floor(Math.random() * 25000),
      or,
      change: momentum[i],
      percent: percentage[i]
    })).sort((a, b) => {
      switch (sort.key) {
        case 'block':
          return (sort.order.block ? a.percent - b.percent : b.percent - a.percent);
        case 'change':
          return (sort.order.change ? a.change - b.change : b.change - a.change);
        case 'room':
          return (sort.order.room ? a.or.localeCompare(b.or) : b.or.localeCompare(a.or));
      }
    });;
    return cb(transformed);
  };

  const applyGlobalFilter = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const startDate = getItemFromStore('globalFilter')?.startDate;
      const endDate = getItemFromStore('globalFilter')?.endDate;
      const requestPayload = {
        startDate: moment(startDate).format('YYYY-MM-DD') ?? state.startDate.format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD') ?? state.endDate.format('YYYY-MM-DD'),
        facilityName: userFacility,
        roomNames: rooms,
        specialtyNames: [],
      };
      const retrieveTileData = request('post');
      const data = await retrieveTileData(process.env.BLOCKUTILIZATION_API, userToken, requestPayload, axios.CancelToken.source());
      if (data?.tiles?.length) {
        dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data.tiles } });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }


  const setUtilizationByRoomSort = (key) => () => {
    setSort((prev) => ({
      ...prev,
      order: {
        ...prev.order,
        [key]: !prev.order[key]
      },
      key
    }));
  }

  return (
    <div className="page-container">
      <Header
        config={{...defaultFilterConfig}}
        applyGlobalFilter={applyGlobalFilter}
        handlers={{
          ...defaultHandlerConfig
        }}
      />
      <Grid container spacing={5} className="efficiency-container">
         <Grid item xs={12} className="efficiency-dashboard-header">
           <h3 style={{ fontWeight: 'normal', color: '#000' }}>Block Utilization</h3>
         </Grid>
         <Grid item xs={3}>
           <Card style={{ height: '365px' }}>
             <CardContent>
               {tile?.blockUtilization && (
                  <TimeCard data={tile.blockUtilization} />
               )}
             </CardContent>
           </Card>
         </Grid>
         <Grid item xs={3}>
           <Card style={{ height: '365px' }}>
             <CardContent>
               {tile?.overtime && (
                  <OvertimeCard data={tile.overtime} />
               )}
             </CardContent>
           </Card>
         </Grid>
        <Grid item xs={6}>
          <Card style={{ height: '365px' }}>
            <CardContent>
              <TrendTile
                data={tile?.trend}
                toggleChartData={toggleChartData}
                trendLineData={trendLineData}
                options={options}
                chartData={chartData}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={6}>
          <Card style={{ height: '365px' }}>
            <CardContent>
              {tile?.room && (
                <React.Fragment>
                  <div
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      overflowY: 'scroll'
                    }}
                  >
                    <h4>
                      {tile?.room?.title}
                      <LightTooltip
                        placement="top"
                        fontSize="small"
                        interactive
                        arrow
                        title={tile?.room?.toolTip?.toString()}
                      >
                        <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.room?.toolTip?.toString()}`} />
                      </LightTooltip>
                    </h4>
                    <Grid container spacing={5}>
                      <Grid item xs={3} style={{ cursor: 'pointer' }} onClick={setUtilizationByRoomSort('room')}>
                        Room

                        {sort.key === 'room' && sort.order.room ? <ArrowUpward size="small" /> : <ArrowDownward size="small" />}
                      </Grid>
                      <Grid item xs={4} style={{ cursor: 'pointer' }} onClick={setUtilizationByRoomSort('block')}>
                        Block Utilization
                        {sort.key === 'block' && sort.order.block ? <ArrowUpward size="small" /> : <ArrowDownward size="small" />}
                      </Grid>
                      <Grid item xs={3} style={{ cursor: 'pointer' }} onClick={setUtilizationByRoomSort('change')}>
                        % Change
                        {sort.key === 'change' && sort.order.change ? <ArrowUpward size="small" /> : <ArrowDownward size="small" />}
                      </Grid>
                    </Grid>
                    <hr style={{ color: '#e0e0e0', marginTop: '12px' }} />
                    <div style={{ overflowY: 'scroll' }}>
                      {transformRoomData(tile?.room?.data?.room, tile?.room?.data?.momentum, tile?.room?.data?.percentage, (data) => data?.map((row) => {
                        return (
                            <Grid
                              container
                              key={row.id}
                              spacing={5}
                              className="room-data-container"
                            >
                              <Grid item xs={3}>
                                {row.or}
                              </Grid>
                              <Grid item xs={4}>
                                {row.percent}%
                              </Grid>
                              <Grid item xs={3}>
                                {row.change === null && (
                                  <span className="change-percent-badge-neutral">
                                    <span className="change-percent-text-neutral">
                                      --%
                                    </span>
                                  </span>
                                )}
                                {!!row.change && (
                                  <span className={`change-percent-badge-${row.change >= 0 ? 'increase' : 'decrease'}`}>
                                    <span className={`change-percent-text-${row.change >= 0 ? 'increase' : 'decrease'}`}>{row.change >= 0 ? '+' : ''}{row.change}%</span>
                                    {row.change >= 0 ? 
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0L16.29 2.29L11.41 7.17L7.41 3.17L0 10.59L1.41 12L7.41 6L11.41 10L17.71 3.71L20 6V0H14Z" fill="#009483"/>
            </svg>
            : 
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 12L16.29 9.71L11.41 4.83L7.41 8.83L0 1.41L1.41 0L7.41 6L11.41 2L17.71 8.29L20 6V12H14Z" fill="#EC2027"/>
            </svg>
            }
                                  </span>
                                )}
                              </Grid>
                            </Grid>
                        );
                      }))}
                    </div>
                  </div>
                </React.Fragment>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={{ height: '365px' }}>
            <CardContent>
              {tile?.composition && (
                <React.Fragment>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <h4>
                      {tile?.composition?.title}
                      <LightTooltip
                        placement="top"
                        fontSize="small"
                        interactive
                        arrow
                        title={tile?.composition?.toolTip?.toString().replace(/\b.,\b/g, '. ')}
                      >
                        <InfoOutlinedIcon
                          style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }}
                          className="log-mouseover"
                          id={`info-tooltip-${tile?.composition?.toolTip?.toString()}`}
                        />
                      </LightTooltip>
                    </h4>
                  </div>
                  {!!tile?.composition && <Donut data={formatDonutData(tile.composition.data)} tooltips={tile.composition.toolTip} label={
                      <React.Fragment>
                        <text x={140} y={95} style={{ fontSize: 14, color: '#333' }}>
                          Average Block Time
                        </text>
                        <text x={tile.composition.data.average_hours >= 10 ? 110 : 140} y={160} style={{ fontSize: 60, color: '#004F6E', fontWeight: 'bold' }}>
                          {tile.composition.data.average_hours}
                          <tspan style={{ fontSize: 18, color: '#004F6E', fontWeight: 'normal' }}>hr</tspan>
                          {tile.composition.data.average_minutes}
                          <tspan style={{ fontSize: 18, color: '#004F6E', fontWeight: 'normal' }}>min</tspan>
                        </text>
                      </React.Fragment>
                  }/>}
                </React.Fragment>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={6}>
          <Card style={{ height: '365px' }}>
            <CardContent>
              <DistributionTile data={tile?.startGap} xAxisLabel={tile?.startGap?.independentVarTitle} yAxisLabel={tile?.startGap?.dependentVarTitle} singleColour />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={{ height: '365px' }}>
            <CardContent>
              <DistributionTile data={tile?.endGap} xAxisLabel={tile?.endGap?.independentVarTitle} yAxisLabel={tile?.startGap?.dependentVarTitle} singleColour />
            </CardContent>
          </Card>
        </Grid>
        <Grid spacing={5} container className="efficiency-container">
          <Grid item xs={12} style={{ paddingLeft: '0px' }}>
            <FooterText days={tile?.elective?.days} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}, equalProps);

export default BlockUtilization;
