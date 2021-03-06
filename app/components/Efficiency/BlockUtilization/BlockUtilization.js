import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CardContent from '@material-ui/core/CardContent';
import Header from '../Header';
import FooterText from '../FooterText';
import { makeSelectToken, makeSelectUserFacility } from '../../../containers/App/selectors';
import { LightTooltip, StyledSkeleton, ChangeIcon, StyledTable } from '../../../components/SharedComponents/SharedComponents';
import Donut from '../../Charts/Donut';
import TrendTile from '../TrendTile';
import TimeCard from '../TimeCard';
import OvertimeCard from '../OvertimeCard';
import DistributionTile from './DistributionTile';
import './styles.scss';
import useLocalStorage from '../../../hooks/useLocalStorage';
import useFilter from '../../../hooks/useFilter';
import { Card as MaterialCard, Paper } from '@material-ui/core';
import { MTableBodyRow } from 'material-table';
import globalFunctions from '../../../utils/global-functions';
import { getPresetDates } from '../../SharedComponents/CustomDateRangePicker';

const INITIAL_STATE = {
  tabIndex: 0,
  startDate: moment().subtract(8, 'months').startOf('month'),
  endDate: moment().subtract(1, 'months').endOf('month'),
  defaultPayload: {
    roomNames: [],
    specialtyNames: []
  },
  loading: false,
};

// filter out these keys from the payload so that they don't appear in the legend
const filteredKeys = ['averageHours', 'averageMinutes', 'days'];

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
const COLOR_MAP = {
  case: '#A77ECD', setup: '#50CBFB', cleanup: '#97E7B3', idle: '#FFDB8C'
}

// Note: only change the below if you know what you're doing / need to change this based on passing new props in or performing some logic to change how this is memoized, this function helps to memoize the component so it'll only re-render upon updates to its props changing
const equalProps = (props, prevProps) => props === prevProps;

const BlockUtilization = React.memo(() => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const { getItemFromStore } = useLocalStorage();
  // grab the rooms object, default filters, default handlers, and apply global filter function from the useFilter hook for use on the page - note: not all pages will need all of this
  const {
    rooms,
    defaultFilterConfig,
    defaultHandlerConfig,
    fetchConfigData,
    applyGlobalFilter,
    loading,
    isApplied
  } = useFilter();
  const [tile, setTile] = React.useState({});
  const [trendStartDate, setTrendStartDate] = React.useState('');

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
      const defaultConfig = await fetchConfigData({ userFacility, userToken, cancelToken: axios.CancelToken.source() });
      const config = getItemFromStore('globalFilter');
      const { rooms, dateLabel } = config ?? defaultConfig;
      
      let body = null;
      if (config) {
        const {start,end} = getPresetDates(dateLabel, 'efficiencyV2')
        body = {
          facilityName: userFacility,
          startDate: moment(start).format('YYYY-MM-DD'),
          endDate: moment(end).format('YYYY-MM-DD'),
          roomNames: rooms
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
        endpoint: process.env.BLOCKUTILIZATION_API,
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

  const [chartData, setChartData] = React.useState('30-day moving average');
  const [filteredChartData, setFilteredChartData] = React.useState('monthTrend');
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

      setTrendStartDate(trendTile?.data?.startDate);
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

  const CustomDonutTooltip = ({ active, payload, toTitleCase }) => {
    if (active && payload?.length) {
      const hours = tile.composition.data.averageHours;
      const mins = tile.composition.data.averageMinutes;
      //Get total minutes and break down what the # time of each
      const totalTime = (hours * 60 + mins) * 60;

      const [{ name, value, payload: { payload: { color } } }] = payload;
      return (
        <div className='subtle-subtext flex' style={{ background: '#F2F2F2', borderRadius: 4, padding: 8 }}>
          <div style={{ backgroundColor: color, width: 16, height: 16 }} />
          <div style={{ marginLeft: 4 }}>
            {globalFunctions.toTitleCase(name)}:
            <span style={{ marginLeft: 2 }} className='bold'>
              {`${globalFunctions.formatSecsToTime(totalTime * (value / 100), true, true)} (${value}%)`}
            </span>
          </div>
        </div>
      )
    }
    return null;
  }

  // format the line data and set the start date when we have tile information
  React.useEffect(() => {
    const trendTile = tile?.trend;
    setTrendStartDate(trendTile?.data?.startDate)
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
    color: COLOR_MAP[key]
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
    setFilteredChartData(e.target.value.includes('7') ? 'weekTrend' : 'monthTrend');
  };

  /*
  * Returns formatted data for data presented in a table-esque format, taken from malformed backend data
  * @param {Array<object>} dataset - Data object retrieved from the API, specific to the donut "tile"
  * @returns {Array<object>} dataset (modified) - The data modified to suit a structure the charting library can use
  */
  const transformRoomData = ({ room, momentum, percentage, display }, cb) => {
    const transformed = room?.map((or, i) => ({
      id: Math.floor(Math.random() * 25000),
      or,
      change: momentum[i],
      percent: percentage[i],
      display: display[i]
    }))
    return cb(transformed);
  };

  const get30DayTooltip = () => {
    const endRange = moment(state.endDate);
    const startRange = endRange.clone().add(-29, 'day');
    return `Change in 30 day moving average from ${startRange.format('MMM D YYYY')} to ${endRange.format('MMM D YYYY')}`
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
        loading={loading} isApplied={isApplied}
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
      <div className='tile-container'>
        <Grid container spacing={4} className="efficiency-container">
          <Grid item xs={12} className="efficiency-dashboard-header header-2">
            Block Utilization
          </Grid>
          <Grid item xs={3}>
            <Card className='tile-card' id='block-util'>
              <CardContent>
                {tile?.blockUtilization && (
                  <TimeCard data={tile.blockUtilization} />
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
            <Card className='tile-card' id='block-util-by-room'>
              <CardContent style={{ padding: 0 }}>
                {tile?.room && (
                  <Grid container spacing={0} className='efficiency-table'>
                    <Grid item xs={12} className='tile-title' style={{ padding: '16px 0 0 16px', marginBottom: 0 }}>
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
                    <StyledTable

                      columns={[{
                        field: 'id', title: 'id', hidden: true
                      },
                      {
                        field: 'display', title: 'display', hidden: true, defaultSort: 'desc'
                      },
                      {
                        field: 'or', title: 'Room', defaultSort: 'desc',
                        // render: rowData => <span className={`${rowData.display}`}>{rowData?.or}</span>
                      }, {
                        field: 'percent', title: 'Block Utilization',
                        render: rowData => <span >{rowData?.percent !== null ? `${rowData?.percent}%` : 'N/A'}</span>
                      }, {
                        field: 'change', title: 'Change',
                        render: rowData => <ChangeIcon
                          change={rowData?.change}
                          style={{ minWidth: 69, textAlign: 'center' }}
                          tooltip={get30DayTooltip()}
                        />,
                        customSort: (a, b) => (a.change == null ? -.1 : a.change) - (b.change == null ? -.1 : b.change),
                      }]}
                      data={transformRoomData(tile?.room?.data,
                        (data) => {
                          return data;
                        }
                      )}
                      options={{
                        search: false,
                        paging: false,
                        toolbar: false,
                        sorting: true,
                        maxBodyHeight: 294,
                        headerStyle: {
                          fontFamily: "Noto Sans",
                          fontSize: 16,
                          color: '#333333',
                          borderBottom: '1px solid rgba(224, 224, 224, 1)',
                          lineHeight: "22px",
                          width: 'unset',
                          top: 0
                        },
                        cellStyle: {
                          padding: '8px 16px',
                          borderBottom: 'none',
                        },
                        thirdSortClick: false,
                        draggable: false
                      }}
                      localization={{
                        body: {
                          emptyDataSourceMessage: (<div style={{
                            color: '#828282', width: '100%', height: 210
                          }} item xs={12} className='header-1 flex vertical-center'>No Data</div>)
                        }
                      }}
                      components={{
                        Container: props => <Paper {...props} style={{ width: '100%' }} elevation={0} />,
                        Row: props => <MTableBodyRow className={props?.data?.display ? '' : 'faded'} {...props} />
                      }}
                    />

                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className='tile-card' id='block-comp'>
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
                    </div>
                    {!!tile?.composition && (
                      <Donut
                        data={formatDonutData(tile.composition.data)}
                        tooltips={tile.composition.toolTip}
                        CustomTooltip={CustomDonutTooltip}
                        label={{
                          title: 'Average Block Time', formattedValue: (
                            <>
                              {tile.composition.data.averageHours}
                              <tspan style={{ fontSize: 18, color: '#004F6E', fontWeight: 'normal' }}>hr</tspan>
                              {tile.composition.data.averageMinutes}
                              <tspan style={{ fontSize: 18, color: '#004F6E', fontWeight: 'normal' }}>min</tspan>
                            </>
                          )
                        }}
                        toTitleCase
                      />)}
                  </React.Fragment>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="efficiency-container">
          <Grid item xs={6}>
            <Card className='tile-card' id='block-start-gap'>
              <CardContent>
                <DistributionTile
                  {...tile?.startGap}
                  xAxisLabel={tile?.startGap?.independentVarTitle}
                  yAxisLabel={tile?.startGap?.dependentVarTitle}
                  singleColour
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className='tile-card' id='block-end-gap'>
              <CardContent>
                <DistributionTile
                  {...tile?.endGap}
                  xAxisLabel={tile?.endGap?.independentVarTitle}
                  yAxisLabel={tile?.startGap?.dependentVarTitle}
                  singleColour
                />
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
    </div>
  );
}, equalProps);

export default BlockUtilization;

