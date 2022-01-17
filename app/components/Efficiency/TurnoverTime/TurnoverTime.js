import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { request } from '../../../utils/global-functions';
import { makeSelectToken, makeSelectUserFacility } from '../../../containers/App/selectors';
import { LightTooltip } from '../../../components/SharedComponents/SharedComponents';
import RadioButtonGroup from '../../../components/SharedComponents/RadioButtonGroup';
import RangeSlider from '../../../components/SharedComponents/RangeSlider';
import LineGraph from '../../Charts/LineGraph';
import Header from '../Header';
import FooterText from '../FooterText';
import HorizontalBar from '../../Charts/HorizontalBar';
// import BarGraph from '../../Charts/Bar';
import useSelectData from '../../../hooks/useSelectData';
import useFilter from '../../../hooks/useFilter';
import DistributionTile from './DistributionTile';
import TimeCard from '../TimeCard';
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
  const [trendSlider, setTrendSlider] = React.useState([0, 100]);
  const [orGraphData, setOrGraphData] = React.useState([]);
  const [dateDiff, setDateDiff] = React.useState(0);
  // const [rooms, setRooms] = React.useState([]);
  const [tile, setTile] = React.useState({});

  const [trendEndDate, setTrendEndDate] = React.useState('');
  const [trendStartDate, setTrendStartDate] = React.useState('');

  const colors = ['#97E7B3', '#FFB71B', '#3DB3E3'];
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const { data } = useSelectData(process.env.TURNOVER_API, userToken, {...state.defaultPayload, facilityName: userFacility, startDate: state.startDate.format('YYYY-MM-DD'), endDate: state.endDate.format('YYYY-MM-DD')}, axios.CancelToken.source()); 

  const {
    selectGracePeriod,
    rooms,
    defaultFilterConfig,
    defaultHandlerConfig
  } = useFilter();

  React.useEffect(() => {
    if (!!data) {
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
    const formattedData = formatLineData(trendTile?.data[filteredChartData]);
    setTrendLineData(formattedData); 
    setTrendStartDate(trendTile?.data?.start_date),
    setTrendEndDate(trendTile?.data?.end_date)
    const startDate = moment(trendTile?.data?.start_date);
    const endDate = moment(trendTile?.data?.end_date);
    const diff = endDate.diff(startDate, 'days'); 
    setDateDiff(diff);
    setTrendSlider([0, diff]);
    const formattedHorizontalBarData = formatBarGraphData(orTile?.data);
    setOrGraphData(formattedHorizontalBarData);
    setTile({
      time: timeTile,
      overtime: overtimeTile,
      trend: trendTile,
      duration: durationTile, 
      or: orTile
    });
  }, [state.tiles]);

  React.useEffect(() => {
    const trendTile = state?.tiles?.find(({ title }) => title.toLowerCase().includes('trend'));
    const formattedData = formatLineData(trendTile?.data[filteredChartData]);
    setTrendLineData(formattedData); 
  }, [trendStartDate, trendEndDate, filteredChartData]);

  const filterTrend = React.useCallback((_, val) => {
    const [first, second] = trendSlider;
    if (val[0]) {
      if (val[0] > first) {
        setTrendStartDate((prev) => moment(prev).subtract(1, 'days'));
      } else if (val[0] < first) {
        setTrendStartDate((prev) => moment(prev).add(1, 'days'));
      }
    }
    if (val[1]) {
      if (val[1] > second) {
        setTrendEndDate((prev) => moment(prev).add(1, 'days'));
      } else if (val[1] < second) {
        setTrendEndDate((prev) => moment(prev).subtract(1, 'days'));
      }
    }
    setTrendSlider(val);
  }, [trendSlider]);

  const toggleChartData = (e) => {
    setChartData(e.target.value);
    setFilteredChartData(e.target.value.includes('7') ? 'week_trend' : 'month_trend');
  };

  const handleFilterDates = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    console.log('here');
    try {
      
      const requestPayload = {
        startDate: moment(trendStartDate).format('YYYY-MM-DD'),
        endDate: moment(trendEndDate).format('YYYY-MM-DD'),
        facilityName: userFacility,
        roomNames: rooms ?? [],
        specialtyNames: [],
      };
      const retrieveTileData = request('post');
      const data = await retrieveTileData(process.env.BLOCKUTILIZATION_API, userToken, requestPayload, axios.CancelToken.source());
      if (data?.tiles?.length) {
        dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data.tiles } });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (err) {
      console.log(err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  const formatLineData = (dataset) => {
    return dataset?.map((percentage, idx) => {
        return {
          date: moment(trendStartDate).add(idx, 'days').format('MMM'),
          percentage
      }
    });
  };

  const formatBarGraphData = (dataset) => {
    return dataset?.room.map((room, i) => {
      return {
        room,
        cleanup: dataset?.cleanup[i],
        setup: dataset?.setup[i],
        turnover: dataset?.turnover[i],
        idle: dataset?.idle[i]
      }
    });
  }

  const applyGlobalFilter = () => {

  }

  return (
    <div className="page-container">
      <Header
        config={{
          ...defaultFilterConfig,
          grace: true
        }}
        applyGlobalFilter={applyGlobalFilter}
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
                <React.Fragment>
                  <div
                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                  >
                    <h4>
                      { tile?.trend?.title }
                      <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(tile?.trend?.toolTip) ? tile?.trend?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : tile?.trend?.toolTip}>
                        <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.trend?.toolTip?.toString()}`} />
                      </LightTooltip>
                    </h4>
                  </div>
                  <div
                    style={{
                      display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-end'
                    }}
                  >
                    <RadioButtonGroup value={chartData} onChange={toggleChartData} options={options} highlightColour="#004F6E" />
                  </div>
                  <LineGraph data={trendLineData} xTickSize={0} interval={30} xAxisLabel={{ value: 'Date', offset: -5, position: 'insideBottom' }} yAxisLabel={{ value: 'Turnover Time (min)', angle: -90, offset: 15, position: 'insideBottomLeft'}} xTickMargin={8} />
                  <Grid item xs={12}>
                    <RangeSlider
                      id="trend"
                      min={0}
                      max={dateDiff}
                      onChange={filterTrend}
                      value={trendSlider}
                      startLabel={moment(trendStartDate).format('MMM D YYYY')}
                      endLabel={moment(trendEndDate).format('MMM D YYYY')}
                      onChangeCommitted={handleFilterDates}
                    />
                  </Grid>
                </React.Fragment>
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
                  <HorizontalBar data={orGraphData} xAxisLabel={{ value: 'Time (min)', offset: -10, position: 'insideBottom' }} yAxisLabel={{ value: 'Room', angle: -90, offset: -5, position: 'insideLeft' }} dataKeys={['cleanup', 'idle', 'setup']} colors={colors} height={300} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} />
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
            <FooterText />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default TurnoverTime;
