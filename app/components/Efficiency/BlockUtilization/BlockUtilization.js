import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CardContent from '@material-ui/core/CardContent';
import Header from '../Header';
import FooterText from '../FooterText';
import { makeSelectToken, makeSelectUserFacility } from '../../../containers/App/selectors';
import { LightTooltip, StyledSkeleton } from '../../../components/SharedComponents/SharedComponents';
import Donut from '../../Charts/Donut';
import TrendTile from '../TrendTile';
import TimeCard from '../TimeCard';
import OvertimeCard from '../OvertimeCard';
import DistributionTile from './DistributionTile';
import './styles.scss';
import useLocalStorage from '../../../hooks/useLocalStorage';
import useSelectData from '../../../hooks/useSelectData';
import useFilter from '../../../hooks/useFilter';
import { mdiTrendingDown, mdiTrendingUp } from '@mdi/js';
import Icon from '@mdi/react'
import { Card as MaterialCard, Divider } from '@material-ui/core';

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

// filter out these keys from the payload so that they don't appear in the legend
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

// Note: only change the below if you know what you're doing / need to change this based on passing new props in or performing some logic to change how this is memoized, this function helps to memoize the component so it'll only re-render upon updates to its props changing
const equalProps = (props, prevProps) => props === prevProps;

const BlockUtilization = React.memo(() => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const { getItemFromStore } = useLocalStorage();
  // grab the rooms object, default filters, default handlers, and apply global filter function from the useFilter hook for use on the page - note: not all pages will need all of this
  const { rooms, defaultFilterConfig, defaultHandlerConfig, fetchConfigData, applyGlobalFilter, loading } = useFilter();
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
  React.useEffect(() => {
    const fetchData = async () => {
      const config = await fetchConfigData({ userFacility, userToken, cancelToken: axios.CancelToken.source() });
      //TODO: centralize default date selection
      const { endDate } = config ?? {};
      const startDate = moment(endDate)?.subtract(1, 'month');
      // GET data from the efficiency API using a POST request, passing in pieces of data that will be used to determine the initial response to populate the page    
      await applyGlobalFilter({
        endpoint: process.env.BLOCKUTILIZATION_API,
        userToken,
        cancelToken: axios.CancelToken.source()
      }, {
        ...state.defaultPayload, facilityName: userFacility, startDate: startDate.format('YYYY-MM-DD'), endDate: moment(endDate).format('YYYY-MM-DD')
      },
        (data) => {
          if (data?.tiles) {
            dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data?.tiles } });
          }
        }
      )
    }
    fetchData();
  }, []);

  const [chartData, setChartData] = React.useState('30-day moving average');
  const [filteredChartData, setFilteredChartData] = React.useState('month_trend');
  const [trendLineData, setTrendLineData] = React.useState([]);


  React.useEffect(() => {
    if (!!state.tiles) {
      const utilizationTile = state.tiles.find(({ identifier }) => identifier.toLowerCase().includes('main'));
      const trendTile = state.tiles.find(({ identifier }) => identifier.toLowerCase().includes('trend'));
      const otTile = state.tiles.find(({ identifier }) => identifier.toLowerCase().includes('overtime'));
      const compositionTile = state.tiles.find(({ identifier }) => identifier.toLowerCase().includes('composition'));
      const roomTile = state.tiles.find(({ identifier }) => identifier.toLowerCase().includes('room'));
      const endGapTile = state.tiles.find(({ identifier }) => identifier.toLowerCase().includes('end distribution'));
      const startGapTile = state.tiles.find(({ identifier }) => identifier.toLowerCase().includes('start distribution'));
      const electiveDaysTile = state.tiles.find(({ identifier }) => identifier.toLowerCase().includes('days'));

      setTrendStartDate(trendTile?.data?.start_date);
      const { toolTip } = compositionTile ?? {}
      const [CLEANUP, IDLE, SETUP, CASE] = toolTip;
      compositionTile.toolTip = { CLEANUP, IDLE, SETUP, CASE }
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

  // format the line data and set the start date when we have tile information
  React.useEffect(() => {
    const trendTile = tile?.trend;
    setTrendStartDate(trendTile?.data?.start_date)
    const formattedData = formatLineData(trendTile?.data[filteredChartData]);
    setTrendLineData(formattedData);
  }, [tile]);

  // format the data on toggle / update of which chart we're displaying
  React.useEffect(() => {
    const trendTile = tile?.trend;
    const formattedData = formatLineData(trendTile?.data[filteredChartData]);
    setTrendLineData(formattedData);
  }, [filteredChartData]);

  // tiny helper function to remove useless keys from the donut chart that we don't want to have present in the legend
  const filterKeys = ([key,]) => {
    return !filteredKeys.includes(key);
  };


  /*
  * @TODO: Remove this code if the backend returns data formatted as an array of objects
  *
  * Returns formatted data for a donut chart, taken from malformed backend data
  * @param {Array<object>} dataset - Data object retrieved from the API, specific to the "tile" utilizing the donut chart 
  * @returns {Array<object>} dataset (modified) - The data modified to suit a structure the charting library can use
  */
  const formatDonutData = (data) => Object.entries(data).filter(filterKeys).reduce((acc, [key, val], i) => acc.concat({
    name: key,
    value: val,
    color: DONUT_COLOURS[i % DONUT_COLOURS.length]
  }), []).filter((({ name, value }) => name !== 'hours' && value !== null));

  /*
  * @TODO: Remove this code if the backend returns data formatted as an array of objects
  *
  * Returns formatted data for a line chart, taken from malformed backend data
  * @param {Array<object>} dataset - Data object retrieved from the API, specific to the trend "tile"
  * @returns {Array<object>} dataset (modified) - The data modified to suit a structure the charting library can use
  */
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

  /*
  * @TODO: Remove the map function but keep the sorting / move the sorting logic somewhere else if the data being returned is an array of objects
  *
  * Returns formatted data for data presented in a table-esque format, taken from malformed backend data
  * @param {Array<object>} dataset - Data object retrieved from the API, specific to the donut "tile"
  * @returns {Array<object>} dataset (modified) - The data modified to suit a structure the charting library can use
  */
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

  // set current sort key to be reflected in sort arrows
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
  const UpArrow = <ArrowUpward style={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: 18 }} size="18px" />;
  const DownArrow = <ArrowDownward style={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: 18 }} size="18px" />;
  const renderChangeIcon = (diff) => {
    let tag = '';
    let className = ''
    let tooltip = '';
    if (diff === null || isNaN(diff) || diff == 0) {
      diff = `—`;
      tooltip = "No Change";
    } else if (diff < 0) {
      className = "trending-down";
      tooltip = "Negative Trend";
      tag = <Icon color="#FF0000" path={mdiTrendingDown} size={'32px'} />
    } else {
      tooltip = "Positive Trend";
      className = "trending-up";
      tag = <Icon color="#009483" path={mdiTrendingUp} size={'32px'} />
    }
    return (
      <LightTooltip interactive arrow
        title={tooltip}
        placement="top" fontSize="small"
      >
        <div className={`change-value ${className} log-mouseover`} >
          <span>{`${diff}%`}</span>
          <span>{tag}</span>
        </div>
      </LightTooltip>

    )
  }
  const Card = loading ? StyledSkeleton : MaterialCard;
  /*
   * Note: This Header component might be a little intimidating, so I'm leaving this comment here to hopefully help explain how everything is hooked up. Feel free to delete if you don't feel it's helpful / after understanding
   *
   * The Header component takes a config object, an applyGlobalFilter function as well as a handlers object which will allow it to render and re-use certain functions as necessary for the filtering options in the header. Each page will have a different configuration and the various configurations will determine which sections to render. The applyGlobalFilter function is a function that comes from the useFilter hook, which allows for passing in the data that's necessary for the filter to work properly. It returns a callback function with the data that it gets from making the request so that we can have access to it on this page (and the other pages that are using applyGlobalFilter).
   *
   */
  return (
    <div className="page-container">
      <Header
        config={{ ...defaultFilterConfig }}
        applyGlobalFilter={() => applyGlobalFilter({
          endpoint: process.env.BLOCKUTILIZATION_API,
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
            }
          }
        )}
        handlers={{
          ...defaultHandlerConfig
        }}
      />
      <Grid container spacing={4} className="efficiency-container">
        <Grid item xs={12} className="efficiency-dashboard-header header-2">
          Block Utilization
        </Grid>
        <Grid item xs={3}>
          <Card className='tile-card'>
            <CardContent>
              {tile?.blockUtilization && (
                <TimeCard data={tile.blockUtilization} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className='tile-card'>
            <CardContent>
              {tile?.overtime && (
                <OvertimeCard data={tile.overtime} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className='tile-card'>
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
      <Grid container spacing={4} className="efficiency-container">
        <Grid item xs={6}>
          <Card className='tile-card' >
            <CardContent>
              {tile?.room && (
                <Grid container spacing={0}>
                  <Grid item xs={12} className='tile-title'>
                    {tile?.room?.title}
                    <LightTooltip
                      placement="top"
                      fontSize="small"
                      interactive
                      arrow
                      title={tile?.room?.toolTip?.toString()}
                    >
                      <InfoOutlinedIcon style={{ fontSize: 16, margin: '4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.room?.toolTip?.toString()}`} />
                    </LightTooltip>
                  </Grid>
                  <Grid item xs={3} style={{ cursor: 'pointer' }} onClick={setUtilizationByRoomSort('room')}>
                    Room
                    {sort.key === 'room' ? (sort.order.room ? UpArrow : DownArrow) : ''}
                  </Grid>
                  <Grid item xs={4} style={{ cursor: 'pointer' }} onClick={setUtilizationByRoomSort('block')}>
                    Block Utilization
                    {sort.key === 'block' ? (sort.order.block ? UpArrow : DownArrow) : ''}
                  </Grid>
                  <Grid item xs={3} style={{ cursor: 'pointer' }} onClick={setUtilizationByRoomSort('change')}>
                    % Change
                    {sort.key === 'change' ? (sort.order.change ? UpArrow : DownArrow) : ''}
                  </Grid>
                  <Grid item xs={12} style={{ marginTop: 8, marginBottom: 12 }}>
                    <Divider style={{ color: '#e0e0e0' }} />
                  </Grid>

                  <Grid container spacing={3} style={{ overflowY: 'auto', overflowX: 'none', maxHeight: 267, paddingBottom: 16 }}>
                    {transformRoomData(tile?.room?.data?.room, tile?.room?.data?.momentum, tile?.room?.data?.percentage,
                      (data) => {
                        //No data view
                        if (!data.length) {
                          return <Grid style={{
                            color: '#828282', width: '100%', height: 230
                          }} item xs={12} className='header-1 flex vertical-center'>No Data</Grid>
                        }
                        return data?.map((row) => {
                          return (
                            <>
                              <Grid item xs={3}>
                                {row.or}
                              </Grid>
                              <Grid item xs={4}>
                                {row.percent}%
                              </Grid>
                              <Grid item xs={3} >
                                {renderChangeIcon(row.change)}
                              </Grid>
                            </>
                          );
                        })
                      }
                    )}
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className='tile-card'>
            <CardContent>
              {tile?.composition && (
                <React.Fragment>
                  <div
                    className='tile-title'
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    {tile?.composition?.title}
                    <LightTooltip
                      placement="top"
                      fontSize="small"
                      interactive
                      arrow
                      title={tile?.composition?.toolTip?.toString().replace(/\b.,\b/g, '. ')}
                    >
                      <InfoOutlinedIcon
                        style={{ fontSize: 16, margin: '4px', color: '#8282828' }}
                        className="log-mouseover"
                        id={`info-tooltip-${tile?.composition?.toolTip?.toString()}`}
                      />
                    </LightTooltip>
                  </div>
                  {!!tile?.composition && <Donut data={formatDonutData(tile.composition.data)} tooltips={tile.composition.toolTip}
                    label={{
                      title: 'Average Block Time', formattedValue: (
                        <>
                          {tile.composition.data.average_hours}
                          <tspan style={{ fontSize: 18, color: '#004F6E', fontWeight: 'normal' }}>hr</tspan>
                          {tile.composition.data.average_minutes}
                          <tspan style={{ fontSize: 18, color: '#004F6E', fontWeight: 'normal' }}>min</tspan>
                        </>
                      )
                    }} />}
                </React.Fragment>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={4} className="efficiency-container">
        <Grid item xs={6}>
          <Card className='tile-card'>
            <CardContent>
              <DistributionTile {...tile?.startGap} xAxisLabel={tile?.startGap?.independentVarTitle} yAxisLabel={tile?.startGap?.dependentVarTitle} singleColour />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className='tile-card'>
            <CardContent>
              <DistributionTile {...tile?.endGap} xAxisLabel={tile?.endGap?.independentVarTitle} yAxisLabel={tile?.startGap?.dependentVarTitle} singleColour />
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
}, equalProps);

export default BlockUtilization;
