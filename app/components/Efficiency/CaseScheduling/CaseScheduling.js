import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
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

const INITIAL_STATE = {
  tabIndex: 0,
  // startDate: moment().subtract(1, 'weeks').startOf('week'),
  // endDate: moment().subtract(1, 'weeks').endOf('week'),
  startDate: moment().subtract(8, 'months').startOf('month'),
  endDate: moment().subtract(1, 'months').endOf('month'),
  loading: false,
  defaultPayload: {
    roomNames: ['2E8291AE-26A8-47FC-AA05-9F4424EDD03F'],
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
  const [filteredChartData, setFilteredChartData] = React.useState('month_trend');
  const [trendLineData, setTrendLineData] = React.useState([]);

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

  const { data } = useSelectData(process.env.SCHEDULING_API, userToken, {
    ...state.defaultPayload,
    facilityName: userFacility,
    startDate: state.startDate.format('YYYY-MM-DD'),
    endDate: state.endDate.format('YYYY-MM-DD')
  }, axios.CancelToken.source());

  const {
    defaultHandlerConfig,
    defaultFilterConfig
  } = useFilter();

  React.useEffect(() => {
    if (!data) return;
    dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data } });
  }, [data]);

  React.useEffect(() => {
    if (!state.tiles) return;

    const scheduleTile = state.tiles.find(({ title }) => title.toLowerCase().includes('schedule'));
    const overtimeTile = state.tiles.find(({ title }) => title.toLowerCase().includes('ot'));
    const trendTile = state.tiles.find(({ title }) => title.toLowerCase().includes('trend'));
    const electiveTile = state.tiles.find(({ title }) => title.toLowerCase().includes('elective'));
    const procedureTile = state.tiles.find(({ title }) => title.toLowerCase().includes('procedure'));
    const delaysTile = state.tiles.find(({ title }) => title.toLowerCase().includes('delays'));

    setTrendStartDate(trendTile?.data?.start_date);
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
    setTrendStartDate(trendTile?.data?.start_date);
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

  const toggleChartData = (e) => {
    setChartData(e.target.value);
    setFilteredChartData(e.target.value.includes('7') ? 'week_trend' : 'month_trend');
  };

  const applyGlobalFilter = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const startDate = getItemFromStore('globalFilterDates')?.startDate;
      const endDate = getItemFromStore('globalFilterDates')?.endDate;
      const requestPayload = {
        startDate: moment(startDate).format('YYYY-MM-DD') ?? state.startDate.format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD') ?? state.endDate.format('YYYY-MM-DD'),
        facilityName: userFacility,
        roomNames: rooms,
        specialtyNames: [],
      };
      const retrieveTileData = request('post');
      const data = await retrieveTileData(process.env.SCHEDULING_API, userToken, requestPayload, axios.CancelToken.source());
      if (data?.tiles?.length) {
        dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data.tiles } });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  return (
    <div className="page-container">
      <Header
        config={{ ...defaultFilterConfig }}
        applyGlobalFilter={applyGlobalFilter}
        handlers={{
          ...defaultHandlerConfig
        }}
      />
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={12} className="efficiency-dashboard-header">
          <h3 style={{ fontWeight: 'normal', color: '#000' }}>Case Scheduling</h3>
        </Grid>
        <Grid item xs={6} style={{ paddingRight: '0px' }}>
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  {tile?.schedule && (
                    <TimeCard data={tile.schedule} />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card style={{ height: '370px' }}>
                <CardContent>
                  {tile?.overtime && (
                    <OvertimeCard data={tile.overtime} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={12}>
              <Card>
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
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  {tile?.delays && (
                    <DistributionTile data={tile.delays} xAxisLabel={tile.delays.independentVarTitle} yAxisLabel={tile.delays.dependentVarTitle} dualColour/>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Card style={{ height: '1110px', overflowY: 'auto' }}>
                <CardContent>
                  {tile?.procedure && (
                    <ProcedureList data={tile.procedure} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
export default CaseScheduling;
