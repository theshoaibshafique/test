import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { makeSelectToken, makeSelectUserFacility } from '../../../containers/App/selectors';
import { LightTooltip } from '../../../components/SharedComponents/SharedComponents';
import Header from '../Header';
import FooterText from '../FooterText';
import HorizontalBar from '../../Charts/HorizontalBar';
import useSelectData from '../../../hooks/useSelectData';
import useFilter from '../../../hooks/useFilter';
import useLocalStorage from '../../../hooks/useLocalStorage';
import DistributionTile from './DistributionTile';
import TimeCard from '../TimeCard';
import TrendTile from '../TrendTile';
import OvertimeCard from '../OvertimeCard';

const INITIAL_STATE = {
  tabIndex: 0,
  startDate: moment().subtract(8, 'month').startOf('month'),
  endDate: moment().subtract(8, 'month').endOf('month'),
  loading: false,
  defaultPayload: {
    roomNames: [],
    specialtyNames: [],
    threshold: 3600
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
  const [filteredChartData, setFilteredChartData] = React.useState('month_trend');
  const [trendLineData, setTrendLineData] = React.useState([]);
  const [orGraphData, setOrGraphData] = React.useState([]);
  const [tile, setTile] = React.useState({});

  const [trendStartDate, setTrendStartDate] = React.useState('');

  const colors = ['#97E7B3', '#FFB71B', '#3DB3E3'];
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const { getItemFromStore } = useLocalStorage();
  const { data } = useSelectData(process.env.TURNOVER_API, 'post', userToken, {
    ...state.defaultPayload, facilityName: userFacility, startDate: state.startDate.format('YYYY-MM-DD'), endDate: state.endDate.format('YYYY-MM-DD')
  }, axios.CancelToken.source());

  const {
    selectGracePeriod,
    rooms,
    defaultFilterConfig,
    defaultHandlerConfig,
    applyGlobalFilter
  } = useFilter();

  React.useEffect(() => {
    if (data) {
      dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data } });
    }
  }, [data]);

  React.useEffect(() => {
    if (!state.tiles) return;
    const trendTile = state.tiles.find(({ title }) => title.toLowerCase().includes('trend'));
    const orTile = state.tiles.find(({ title }) => title.toLowerCase().includes('or'));
    const overtimeTile = state.tiles.find(({ title }) => title.toLowerCase().includes('ot'));
    const timeTile = state.tiles.find(({ title }) => title.toLowerCase().includes('time'));
    const durationTile = state.tiles.find(({ title }) => title.toLowerCase().includes('duration'));
    const electiveDaysTile = state.tiles.find(({ title }) => title.toLowerCase().includes('elective'));
    const formattedData = formatLineData(trendTile?.data[filteredChartData]);
    setTrendLineData(formattedData);
    setTrendStartDate(trendTile?.data?.start_date);
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
    setFilteredChartData(e.target.value.includes('7') ? 'week_trend' : 'month_trend');
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
    idle: dataset?.idle[i]
  }));

  return (
    <div className="page-container">
      <Header
        config={{
          ...defaultFilterConfig,
          grace: {
            threshold: true,
            period: true
          }
        }}
        applyGlobalFilter={() => applyGlobalFilter({
          endpoint: process.env.TURNOVER_API,
          userToken,
          cancelToken: axios.CancelToken.source()
          }, {
            startDate: moment(getItemFromStore('globalFilter')?.startDate).format('YYYY-MM-DD') ?? state.startDate.format('YYYY-MM-DD'),
            endDate: moment(getItemFromStore('globalFilter')?.endDate).format('YYYY-MM-DD') ?? state.endDate.format('YYYY-MM-DD'),
            facilityName: userFacility,
            roomNames: rooms,
            threshold: getItemFromStore('globalFilter')?.otsThreshold + getItemFromStore('globalFilter').fcotsThreshold
          },
          (tileData) => {
            if (tileData?.tiles?.length) {
              dispatch({ type: 'SET_TILE_DATA', payload: { tiles: tileData.tiles } });
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
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={12} className="efficiency-dashboard-header">
          <h3>Turnover Time</h3>
        </Grid>
        <Grid item xs={3}>
          <Card style={{ height: '365px' }}>
            <CardContent>
              {tile?.time && (
                <TimeCard data={tile.time} suffix="Min" />
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
          <Card>
            <CardContent>
              {tile?.trend && (
                <TrendTile
                  data={tile.trend}
                  trendLineData={trendLineData}
                  chartData={chartData}
                  toggleChartData={toggleChartData}
                  options={options}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={6}>
          <Card style={{ height: '375px' }}>
            <CardContent>
              {tile?.or && (
                <React.Fragment>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <h4>
                      {tile?.or?.title}
                      <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(tile?.or?.toolTip) ? tile?.or?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : tile?.or?.toolTip}>
                        <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.or?.toolTip?.toString()}`} />
                      </LightTooltip>
                    </h4>
                  </div>
                  <HorizontalBar
                    legend
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
          <Card style={{ height: '375px' }}>
            <CardContent>
              {tile?.duration && (
                <DistributionTile data={tile?.duration} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid spacing={5} container className="efficiency-container">
          <Grid item xs={12} style={{ paddingLeft: '0px' }}>
            <FooterText days={tile?.elective?.value} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default TurnoverTime;
