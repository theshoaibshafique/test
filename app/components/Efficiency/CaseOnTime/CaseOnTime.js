import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import { Card as MaterialCard } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Header from '../Header';
import FooterText from '../FooterText';
import { makeSelectToken, makeSelectUserFacility } from '../../../containers/App/selectors';
import { LightTooltip, StyledSkeleton } from '../../../components/SharedComponents/SharedComponents';
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
  const [chartData, setChartData] = React.useState('30-day moving average');
  const [trendLineData, setTrendLineData] = React.useState([]);
  const [trendStartDate, setTrendStartDate] = React.useState('');
  const [filteredChartData, setFilteredChartData] = React.useState('month_trend');
  const [maxData, setMaxData] = React.useState(0);
  const [bySpecialty, setBySpecialty] = React.useState('By Specialty');
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
  const config = getItemFromStore('efficiencyV2')?.efficiency ?? {};

  const {
    rooms,
    fetchConfigData,
    defaultFilterConfig,
    defaultHandlerConfig,
    toggleFirstCaseOnTime,
    applyGlobalFilter,
    viewFirstCase,
    loading
  } = useFilter();
  const [specialtyNames, setSpecialtyNames] = React.useState([]);
  const selectSpecialty = (event) => {
    const {
      target: { value },
    } = event;
    setSpecialtyNames(value);
  }
  React.useEffect(() => {
    const fetchData = async () => {
      const config = await fetchConfigData({ userFacility, userToken, cancelToken: axios.CancelToken.source() });
      //TODO: centralize default date selection
      const { endDate } = config ?? {};
      const startDate = moment(endDate)?.subtract(1, 'month');
      // GET data from the efficiency API using a POST request, passing in pieces of data that will be used to determine the initial response to populate the page    
      await applyGlobalFilter({
        endpoint: process.env.ONTIMESTART_API,
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

  const formatLineData = (dataset) => dataset?.map((percentage, idx) => ({
    date: moment(trendStartDate).add(idx, 'days').valueOf(),
    percentage
  }));

  React.useEffect(() => {
    const trendTile = tile?.trend;
    let formattedData;
    if (!viewFirstCase) {
      formattedData = formatLineData(trendTile?.data[filteredChartData].ots);
    } else {
      formattedData = formatLineData(trendTile?.data[filteredChartData].fcots);
    }
    setTrendLineData(formattedData);
    setTrendStartDate(trendTile?.data?.start_date);
  }, [tile, viewFirstCase]);

  React.useEffect(() => {
    const trendTile = tile?.trend;
    let formattedData;
    if (!viewFirstCase) {
      formattedData = formatLineData(trendTile?.data[filteredChartData].ots);
    } else {
      formattedData = formatLineData(trendTile?.data[filteredChartData].fcots);
    }
    setTrendLineData(formattedData);
  }, [filteredChartData, tile, viewFirstCase]);

  React.useEffect(() => {
    if (!state.tiles) return;
    const specialtyTile = state.tiles.find(({ independentVarTitle }) => independentVarTitle?.toLowerCase().includes('specialty'));
    const onTimeTile = state.tiles.find(({ title }) => title.toLowerCase().includes('on-time'));
    // const percentageTile = state.tiles.find(({ title }) => title.toLowerCase().includes('specialty'));
    const otTile = state.tiles.find(({ title }) => title.toLowerCase().includes('ot'));
    const trendTile = state.tiles.find(({ title }) => title.toLowerCase().includes('trend'));
    const roomTile = state.tiles.find(({ independentVarTitle }) => independentVarTitle?.toLowerCase().includes('room'));
    const electiveDaysTile = state.tiles.find(({ title }) => title.toLowerCase().includes('elective'));
    const distributionTile = state.tiles.find(({ title }) => title.toLowerCase().includes('distribution'));
    const max = specialtyTile?.data?.specialty?.length + roomTile?.data?.room?.length;
    setMaxData(max);
    setTrendStartDate(trendTile?.data?.start_date);
    setTile({
      specialty: specialtyTile,
      room: roomTile,
      trend: trendTile,
      time: onTimeTile,
      overtime: otTile,
      elective: electiveDaysTile,
      distribution: distributionTile
    });
  }, [state.tiles, bySpecialty]);

  React.useEffect(() => {
    const globalFilter = getItemFromStore('globalFilter');
    if (!!globalFilter) {
      setItemInStore('globalFilter', {
        ...globalFilter,
        viewFirstCase
      });
    }
  }, [viewFirstCase]);

  const toggleSpecialty = React.useCallback((e) => {
    setBySpecialty(e.target.value);
  }, [bySpecialty]);

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
        specialty: tileData?.specialty[i],
        ots: tileData?.ots_momentum[i]
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
        change: tileData?.fcots_momentum[i],
        ots: tileData?.ots_momentum[i]
      }));
    }

    return cb(transformed);
  };

  const toggleChartData = (e) => {
    setChartData(e.target.value);
    setFilteredChartData(e.target.value.includes('7') ? 'week_trend' : 'month_trend');
  };

  const renderTileData = (tile) => {
    return (
      <React.Fragment>
        <div
          className='tile-title'
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {tile?.title}
          <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(tile?.toolTip) ? tile?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : tile?.toolTip}>
            <InfoOutlinedIcon style={{ fontSize: 16, margin: '4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.toolTip?.toString()}`} />
          </LightTooltip>
        </div>
        <Grid container>
          <Grid item xs={12}>
            <RadioButtonGroup style={{ display: 'flex', alignItems: 'flex-end' }} value={bySpecialty} onChange={toggleSpecialty} options={options} highlightColour="#004F6E" />
          </Grid>
        </Grid>
        <hr style={{ color: '#e0e0e0', marginTop: '12px' }} />
        <Grid container spacing={5}>
          <Grid item xs={4}>
            {tile?.independentVarTitle}
          </Grid>
          <Grid item xs={3}>
            {tile?.dependentVarTitle}
          </Grid>
          <Grid item xs={3}>
            Change
          </Grid>
        </Grid>
        <hr style={{ color: '#e0e0e0', marginTop: '12px' }} />
        <div style={{ overflowY: 'auto', height: '100%' }}>
          {transformData(tile?.data, bySpecialty, (rowData) => rowData?.map((row) => (
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
    );
  }
  const Card = loading ? StyledSkeleton : MaterialCard;
  return (
    <div className="page-container">
      <Header
        config={{
          ...defaultFilterConfig,
          specialty: true,
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
          roomNames: rooms
        },
          (tileData) => {
            if (tileData?.tiles?.length) {
              dispatch({ type: 'SET_TILE_DATA', payload: { tiles: tileData.tiles } });
            }
          }
        )}
        handlers={{
          ...defaultHandlerConfig,
          //Add custom handlers for Header that useFilter doesnt handle
          case: {
            toggleFirstCaseOnTime,
            viewFirstCase
          },
          specialty: {
            specialtyNames,
            selectSpecialty
          },
          clearFilters: () => {
            defaultHandlerConfig?.clearFilters?.();
            setSpecialtyNames([]);
          }
        }}
      />
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={12} className="efficiency-dashboard-header header-2">
          Case On Time
        </Grid>
        <Grid item xs={3} style={{ paddingRight: '0px' }}>
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={12} style={{ paddingRight: '0px' }}>
              <Card className='tile-card'>
                <CardContent>
                  {tile?.time && (
                    <TimeCard data={tile?.time} />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} style={{ paddingRight: '0px' }}>
              <Card className='tile-card'>
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
            <Card className='tile-card' style={{ height: '720px' }}>
              <CardContent style={{ overflowY: 'auto' }}>
                {maxData > 12 ? (
                  <React.Fragment>
                    {bySpecialty === 'By Room' && renderTileData(tile?.room)}
                    {bySpecialty === 'By Specialty' && renderTileData(tile?.specialty)}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <React.Fragment>
                      <div
                        className='tile-title'
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        {viewFirstCase ? 'First Case On Time Percentage' : 'Case On Time Percentage'}
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
              <Card className='tile-card'>
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
              <Card className='tile-card'>
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
            <FooterText
              days={tile?.elective?.value}
              facilityName={config?.facilityName}
              fcotsThreshold={config?.fcotsThreshold}
              otsThreshold={config?.otsThreshold} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default CaseOnTime;
