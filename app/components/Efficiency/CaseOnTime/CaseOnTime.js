import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Header from '../Header';
import FooterText from '../FooterText';
import { makeSelectToken, makeSelectUserFacility } from '../../../containers/App/selectors';
import { LightTooltip } from '../../../components/SharedComponents/SharedComponents';
import useSelectData from '../../../hooks/useSelectData';
import useFilter from '../../../hooks/useFilter';
import useLocalStorage from '../../../hooks/useLocalStorage';
import RadioButtonGroup from '../../SharedComponents/RadioButtonGroup';
import TimeCard from '../TimeCard';
import TrendTile from '../TrendTile';
import OvertimeCard from '../OvertimeCard';
import DistributionTile from './DistributionTile';

const INITIAL_STATE = {
  tabIndex: 0,
  informationModalOpen: false,
  // startDate: moment().subtract(7, 'days').startOf('week'),
  // endDate: moment().subtract(7, 'days').endOf('week'),
  startDate: moment().subtract(3, 'months').startOf('month'),
  endDate: moment().subtract(3, 'months').endOf('month'),
  loading: false,
  defaultPayload: {
    roomNames: [],
    specialtyNames: [],
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_INFORMATION_MODAL':
      return {
        ...state,
        informationModalOpen: action.payload
      };
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

const CaseOnTime = () => {
  const options = [
    {
      id: 1,
      value: 'By Specialty',
    },
    {
      id: 2,
      value: 'By Room'
    }
  ];

  const lineOptions = [
    {
      id: 1,
      value: '30-day moving average',
    },
    {
      id: 2,
      value: '7-day moving average'
    }
  ];

  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  // const [rooms, setRooms] = React.useState([]);
  // const [orFilterVal, setOrFilterVal] = React.useState([]);
  // const [label, setLabel] = React.useState('Most recent week');
  const [chartData, setChartData] = React.useState('30-day moving average');
  const [trendLineData, setTrendLineData] = React.useState([]);
  const [trendStartDate, setTrendStartDate] = React.useState('');
  const [filteredChartData, setFilteredChartData] = React.useState('month_trend');
  const [maxData, setMaxData] = React.useState(0);
  const [specialty, setSpecialty] = React.useState('By Specialty');
  // const [viewFirstCase, setViewFirstCase] = React.useState(false);
  const [tile, setTile] = React.useState({
    overtime: null,
    room: null,
    specialty: null,
    percentage: null,
    first: null,
    distribution: null,
    trend: null,
  });

  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const { getItemFromStore, setItemInStore } = useLocalStorage();
  const { data } = useSelectData(process.env.ONTIMESTART_API, userToken, {
    ...state.defaultPayload, facilityName: userFacility, otsThreshold: 3600, fcotsThreshold: 3600, startDate: state.startDate.format('YYYY-MM-DD'), endDate: state.endDate.format('YYYY-MM-DD')
  }, axios.CancelToken.source());

  const {
    defaultFilterConfig,
    defaultHandlerConfig,
    toggleFirstCaseOnTime,
    viewFirstCase,
  } = useFilter();

  React.useEffect(() => {
    if (!data) return;
    dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data } });
  }, [data]);

  const formatLineData = (dataset) => dataset?.map((percentage, idx) => ({
    date: moment(trendStartDate).add(idx, 'days').valueOf(),
    percentage
  }));

  React.useEffect(() => {
    const trendTile = tile?.trend;
    let formattedData;
    if (!viewFirstCase) {
      formattedData = formatLineData(trendTile?.data[filteredChartData].ots_cases);
    } else {
      formattedData = formatLineData(trendTile?.data[filteredChartData].fcots_cases);
    }
    setTrendLineData(formattedData);
    setTrendStartDate(trendTile?.data?.start_date);
  }, [tile, viewFirstCase]);

  React.useEffect(() => {
    const trendTile = tile?.trend;
    let formattedData;
    if (!viewFirstCase) {
      formattedData = formatLineData(trendTile?.data[filteredChartData].ots_cases);
    } else {
      formattedData = formatLineData(trendTile?.data[filteredChartData].fcots_cases);
    }
    setTrendLineData(formattedData);
  }, [filteredChartData, tile, viewFirstCase]);

  React.useEffect(() => {
    if (!state.tiles) return;
    const specialtyTile = state.tiles.find(({ title }) => title.toLowerCase().includes('specialty'));
    const onTimeTile = state.tiles.find(({ title }) => title.toLowerCase().includes('on-time'));
    // const percentageTile = state.tiles.find(({ title }) => title.toLowerCase().includes('specialty'));
    const otTile = state.tiles.find(({ title }) => title.toLowerCase().includes('ot'));
    const trendTile = state.tiles.find(({ title }) => title.toLowerCase().includes('trend'));
    const firstCaseTile = state.tiles.find(({ title }) => title.toLowerCase().includes('first case'));
    const roomTile = state.tiles.find(({ title }) => title.toLowerCase().includes('room'));
    const electiveDaysTile = state.tiles.find(({ title }) => title.toLowerCase().includes('elective'));
    const distributionTile = state.tiles.find(({ title }) => title.toLowerCase().includes('distribution'));

    const max = specialtyTile.data.specialty.length + roomTile.data.room.length;
    setMaxData(max);
    setTrendStartDate(trendTile?.data?.start_date);
    setTile({
      specialty: specialtyTile,
      room: roomTile,
      trend: trendTile,
      firstCase: firstCaseTile,
      time: onTimeTile,
      overtime: otTile,
      elective: electiveDaysTile,
      distribution: distributionTile
    });
  }, [state.tiles, specialty]);

  React.useEffect(() => {
    const globalFilter = getItemFromStore('globalFilter');
    if (!!globalFilter) {
      setItemInStore('globalFilter', {
        ...globalFilter,
        viewFirstCase 
      });
    }
  }, [viewFirstCase]);

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
        otsThreshold: 0,
        fcotsThreshold: 0
      };
      const retrieveTileData = request('post');
      const data = await retrieveTileData(process.env.ONTIMESTART_API, userToken, requestPayload, axios.CancelToken.source());
      if (data?.tiles?.length) {
        dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data.tiles } });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  const toggleSpecialty = React.useCallback((e) => {
    setSpecialty(e.target.value);
  }, [specialty]);

  const transformData = (tileData, category, cb) => {
    let transformed;

    if (!viewFirstCase && category === 'By Specialty') {
      transformed = tileData?.ots.map((time, i) => ({
        start: time,
        change: tileData?.ots_momentum[i],
        specialty: tileData?.specialty[i]
      }));
    } else if (viewFirstCase && category === 'By Specialty') {
      transformed = tileData?.fcots.map((time, i) => ({
        start: time,
        change: tileData?.fcots_momentum[i],
        specialty: tileData?.specialty[i]
      }));
    }

    if (!viewFirstCase && category === 'By Room') {
      transformed = tileData?.ots?.map((time, i) => ({
        start: time,
        room: tileData?.room[i],
        change: tileData?.ots_momentum[i]
      }));
    } else if (viewFirstCase && category === 'By Room') {
      transformed = tileData?.fcots?.map((time, i) => ({
        start: time,
        room: tileData?.room[i],
        change: tileData?.fcots_momentum[i]
      }));
    }

    return cb(transformed);
  };

  const toggleChartData = (e) => {
    setChartData(e.target.value);
    setFilteredChartData(e.target.value.includes('7') ? 'week_trend' : 'month_trend');
  };

  return (
    <div className="page-container">
      <Header
        config={{
          ...defaultFilterConfig,
          specialty: true,
          grace: {
            threshold: false,
            period: true
          },
          case: true
        }}
        applyGlobalFilter={() => applyGlobalFilter({
          endpoint: process.env.ONTIMESTART_API,
          userToken,
          cancelToken: axios.CancelToken.source()
          }, {
            startDate: moment(getItemFromStore('globalFilter')?.startDate).format('YYYY-MM-DD') ?? state.startDate.format('YYYY-MM-DD'),
            endDate: moment(getItemFromStore('globalFilter')?.endDate).format('YYYY-MM-DD') ?? state.endDate.format('YYYY-MM-DD'),
            facilityName: userFacility,
            roomNames: rooms,
            otsThreshold: !viewFirstCase ? getItemFromStore('globalFilter')?.otsThreshold : 0,
            fcotsThreshold: viewFirstCase ? getItemFromStore('globalFilter')?.fcotsThreshold: 0,
          },
          (tileData) => {
            if (tileData?.tiles?.length) {
              dispatch({ type: 'SET_TILE_DATA', payload: { tiles: tileData.tiles } });
            }
          }
        )}
        handlers={{
          ...defaultHandlerConfig,
          case: {
            toggleFirstCaseOnTime,
            viewFirstCase
          }
        }}
      />
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={12} className="efficiency-dashboard-header">
          <h3 style={{ fontWeight: 'normal', color: '#000' }}>Case On Time</h3>
        </Grid>
        <Grid item xs={3} style={{ paddingRight: '0px' }}>
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={12} style={{ paddingRight: '0px' }}>
              <Card>
                <CardContent>
                  {!viewFirstCase ?
                    tile?.time && (
                    <TimeCard data={tile.time} />
                  )
                    :
                    tile?.firstCase && (
                    <TimeCard data={tile.firstCase} />
                  )
                  }
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} style={{ paddingRight: '0px' }}>
              <Card>
                <CardContent>
                  {tile?.overtime && (
                    <OvertimeCard data={tile.overtime} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent style={{ height: '760px', overflowY: 'auto' }}>
                {maxData > 12 ? (
                  <React.Fragment>
                    {specialty === 'By Specialty' && (
                      <React.Fragment>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}
                        >
                          <h4>{tile?.specialty?.title}</h4>
                          <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(tile?.specialty?.toolTip) ? tile?.specialty?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : tile?.specialty?.toolTip}>
                            <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.specialty?.toolTip?.toString()}`} />
                          </LightTooltip>
                        </div>
                        <Grid container>
                          <Grid item xs={12}>
                            <RadioButtonGroup style={{ display: 'flex', alignItems: 'flex-end' }} value={specialty} onChange={toggleSpecialty} options={options} highlightColour="#004F6E" />
                          </Grid>
                        </Grid>
                        <hr style={{ color: '#e0e0e0', marginTop: '12px' }} />
                        <Grid container spacing={5}>
                          <Grid item xs={4}>
                            {tile?.specialty?.independentVarTitle}
                          </Grid>
                          <Grid item xs={3}>
                            {tile?.specialty?.dependentVarTitle}
                          </Grid>
                          <Grid item xs={2}>
                        Change
                          </Grid>
                        </Grid>
                        <hr style={{ color: '#e0e0e0', marginTop: '12px' }} />
                        <div style={{ overflowY: 'auto', height: '100%' }}>
                          {transformData(tile?.specialty?.data, specialty, (rowData) => rowData?.map((row) => (
                            <Grid
                              container
                              key={row.specialty}
                              spacing={5}
                              className="room-data-container"
                            >
                              <Grid item xs={4}>
                                {row.specialty}
                              </Grid>
                              <Grid item xs={3}>
                                {row.start}%
                              </Grid>
                              <Grid item xs={3}>
                                {row.change}
                              </Grid>
                            </Grid>
                          )))}
                        </div>
                      </React.Fragment>
                    )}
                    {specialty === 'By Room' && (
                      <React.Fragment>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}
                        >
                          <h4>{tile?.room?.title}</h4>
                          <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(tile?.room?.toolTip) ? tile?.room?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : tile?.room?.toolTip}>
                            <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.room?.toolTip?.toString()}`} />
                          </LightTooltip>
                        </div>
                        <Grid container>
                          <Grid item xs={12}>
                            <RadioButtonGroup style={{ display: 'flex', alignItems: 'flex-end' }} value={specialty} onChange={toggleSpecialty} options={options} highlightColour="#004F6E" />
                          </Grid>
                        </Grid>
                        <hr style={{ color: '#e0e0e0', marginTop: '12px' }} />
                        <Grid container spacing={5}>
                          <Grid item xs={4}>
                            {tile?.room?.independentVarTitle}
                          </Grid>
                          <Grid item xs={3}>
                            {tile?.room?.dependentVarTitle}
                          </Grid>
                          <Grid item xs={3}>
                        Change
                          </Grid>
                        </Grid>
                        <hr style={{ color: '#e0e0e0', marginTop: '12px' }} />
                        <div style={{ overflowY: 'auto', height: '100%' }}>
                          {transformData(tile?.room?.data, specialty, (rowData) => rowData?.map((row) => (
                            <Grid
                              container
                              key={row.room}
                              spacing={5}
                              className="room-data-container"
                            >
                              <Grid item xs={5}>
                                {row.room}
                              </Grid>
                              <Grid item xs={3}>
                                {row.start}%
                              </Grid>
                              <Grid item xs={3}>
                                {row.change}
                              </Grid>
                            </Grid>
                          )))}
                        </div>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <React.Fragment>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <h4>{viewFirstCase ? 'First Case On Time Percentage' : 'Case On Time Percentage'}</h4>
                      </div>
                      <hr style={{ color: '#e0e0e0', marginTop: '12px' }} />
                      <Grid container spacing={5}>
                        <Grid item xs={4}>
                          {tile?.room?.independentVarTitle}
                        </Grid>
                        <Grid item xs={3}>
                          {tile?.room?.dependentVarTitle}
                        </Grid>
                        <Grid item xs={3}>
                        Change
                        </Grid>
                      </Grid>
                      <hr style={{ color: '#e0e0e0', marginTop: '12px' }} />
                      <div>
                        {transformData(tile?.room?.data, 'By Room', (rowData) => rowData?.map((row) => (
                          <Grid
                            container
                            key={row.room}
                            spacing={5}
                            className="room-data-container"
                          >
                            <Grid item xs={5}>
                              {row.room}
                            </Grid>
                            <Grid item xs={3}>
                              {row.start}%
                            </Grid>
                            <Grid item xs={3}>
                              {row.change}
                            </Grid>
                          </Grid>
                        )))}
                      </div>
                    </React.Fragment>
                    <React.Fragment>
                      <hr style={{ color: '#e0e0e0', marginTop: '12px' }} />
                      <Grid container spacing={5}>
                        <Grid item xs={4}>
                          {tile?.specialty?.independentVarTitle}
                        </Grid>
                        <Grid item xs={3}>
                          {tile?.specialty?.dependentVarTitle}
                        </Grid>
                        <Grid item xs={2}>
                        Change
                        </Grid>
                      </Grid>
                      <hr style={{ color: '#e0e0e0', marginTop: '12px' }} />
                      <div>
                        {transformData(tile?.specialty?.data, 'By Specialty', (rowData) => rowData?.map((row) => (
                          <Grid
                            container
                            key={row.specialty}
                            spacing={5}
                            className="room-data-container"
                          >
                            <Grid item xs={4} style={{ fontSize: 12 }}>
                              {row.specialty}
                            </Grid>
                            <Grid item xs={3}>
                              {row.start}%
                            </Grid>
                            <Grid item xs={3}>
                              {row.change}
                            </Grid>
                          </Grid>
                        )))}
                      </div>
                    </React.Fragment>
                  </React.Fragment>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <TrendTile
                    data={tile?.trend}
                    trendLineData={trendLineData}
                    toggleChartData={toggleChartData}
                    options={lineOptions}
                    chartData={chartData}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent style={{ height: 345 }}>
                  {tile?.distribution && (
                    <DistributionTile
                      data={tile.distribution}
                      viewFirstCase={viewFirstCase}
                      xAxisLabel={tile.distribution.independentVarTitle}
                      yAxisLabel={tile.distribution.dependentVarTitle}
                      dualColour
                    />
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

export default CaseOnTime;
