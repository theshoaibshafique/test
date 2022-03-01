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
    loading
  } = useFilter();

  React.useEffect(() => {
    const fetchData = async () => {
      const config = await fetchConfigData({ userFacility, userToken, cancelToken: axios.CancelToken.source() });
      //TODO: centralize default date selection
      const { endDate } = config ?? {};
      const startDate = moment(endDate)?.subtract(1, 'month');
      // GET data from the efficiency API using a POST request, passing in pieces of data that will be used to determine the initial response to populate the page    
      await applyGlobalFilter({
        endpoint: process.env.SCHEDULING_API,
        userToken,
        cancelToken: axios.CancelToken.source()
      }, {
        ...state.defaultPayload,
        facilityName: userFacility,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD')
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


  React.useEffect(() => {
    if (!state.tiles) return;

    const scheduleTile = state.tiles.find(({ title }) => title.toLowerCase().includes('schedule'));
    const overtimeTile = state.tiles.find(({ title }) => title.toLowerCase().includes('overtime'));
    const trendTile = state.tiles.find(({ title }) => title.toLowerCase().includes('trend'));
    const electiveTile = state.tiles.find(({ title }) => title.toLowerCase().includes('elective'));
    const procedureTile = state.tiles.find(({ title }) => title.toLowerCase().includes('procedure'));
    const delaysTile = state.tiles.find(({ title }) => title.toLowerCase().includes('delays'));
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
      underscheduled: dataset?.underscheduledPercentage[idx],
      shape: dataset?.shape[idx],
      scale: dataset?.scale[idx],
    }
  });

  const toggleChartData = (e) => {
    setChartData(e.target.value);
    setFilteredChartData(e.target.value.includes('7') ? 'weekTrend' : 'monthTrend');
  };
  const Card = loading ? StyledSkeleton : MaterialCard;
  return (
    <div className="page-container">
      <Header
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
            }
          }
        )}
        handlers={{
          ...defaultHandlerConfig
        }}
      />
      <Grid container spacing={4} className="efficiency-container">
        <Grid item xs={12} className="efficiency-dashboard-header header-2">
          Case Scheduling
        </Grid>
        <Grid item container spacing={0} xs={6} style={{ paddingRight: '0px', paddingBottom:0 }} className="efficiency-container">
          <Grid container item xs={12} spacing={4} style={{paddingBottom:32}}>
            <Grid item xs={6} >
              <Card className='tile-card'>
                <CardContent>
                  {tile?.schedule && (
                    <TimeCard data={tile.schedule} />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} style={{paddingRight:0}} >
              <Card className='tile-card'>
                <CardContent>
                  {tile?.overtime && (
                    <OvertimeCard data={tile.overtime} reverse/>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={4} style={{paddingBottom:32}}>
            <Grid item xs={12} style={{paddingRight:0}}>
              <Card className='tile-card'>
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
          <Grid container item xs={12} spacing={4} style={{paddingBottom:32}}>
            <Grid item xs={12} style={{paddingRight:0}}>
              <Card className='tile-card'>
                <CardContent>
                  {tile?.delays && (
                    <DistributionTile {...tile.delays} xAxisLabel={tile.delays.independentVarTitle} yAxisLabel={tile.delays.dependentVarTitle} dualColour />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} >
          <Card className='tile-card' style={{ height: 1084 }}>
            <CardContent style={{padding:0, position:'relative'}}>
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
