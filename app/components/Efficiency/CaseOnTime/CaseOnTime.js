import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import { Card as MaterialCard, Divider, Paper } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Header from '../Header';
import FooterText from '../FooterText';
import { makeSelectToken, makeSelectUserFacility } from '../../../containers/App/selectors';
import { ChangeIcon, LightTooltip, StyledSkeleton, StyledTable } from '../../../components/SharedComponents/SharedComponents';
import useSelectData from '../../../hooks/useSelectData';
import useFilter from '../../../hooks/useFilter';
import useLocalStorage from '../../../hooks/useLocalStorage';
import RadioButtonGroup from '../../SharedComponents/RadioButtonGroup';
import TimeCard from '../TimeCard';
import TrendTile from '../TrendTile';
import OvertimeCard from '../OvertimeCard';
import DistributionTile from './DistributionTile';
import { MTableBodyRow } from 'material-table';

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
  const [filteredChartData, setFilteredChartData] = React.useState('monthTrend');
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
  const [specialtyNames, setSpecialtyNames] = React.useState(getItemFromStore('globalFilter')?.specialtyNames ?? []);
  const selectSpecialty = (event) => {
    const {
      target: { value },
    } = event;
    setSpecialtyNames(value);
  }
  React.useEffect(() => {
    const globalFilter = getItemFromStore('globalFilter');
    setItemInStore('globalFilter', { ...globalFilter, specialtyNames });
  }, [specialtyNames])
  React.useEffect(() => {
    const fetchData = async () => {
      const defaultConfig = await fetchConfigData({ userFacility, userToken, cancelToken: axios.CancelToken.source() });
      const config = getItemFromStore('globalFilter');
      let body = null;
      if (config) {
        const { startDate, endDate, rooms, specialtyNames } = config;
        body = {
          ...state.defaultPayload,
          facilityName: userFacility,
          startDate: moment(startDate).format('YYYY-MM-DD'),
          endDate: moment(endDate).format('YYYY-MM-DD'),
          roomNames: rooms ?? [],
          specialtyNames: specialtyNames ?? []
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
        endpoint: process.env.ONTIMESTART_API,
        userToken,
        cancelToken: axios.CancelToken.source()
      }, 
      body,
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
    setTrendStartDate(trendTile?.data?.startDate);
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
    const otTile = state.tiles.find(({ title }) => title.toLowerCase().includes('overtime'));
    const trendTile = state.tiles.find(({ title }) => title.toLowerCase().includes('trend'));
    const roomTile = state.tiles.find(({ independentVarTitle }) => independentVarTitle?.toLowerCase().includes('room'));
    const electiveDaysTile = state.tiles.find(({ title }) => title.toLowerCase().includes('elective'));
    const distributionTile = state.tiles.find(({ title }) => title.toLowerCase().includes('distribution'));
    const max = specialtyTile?.data?.specialty?.length + roomTile?.data?.room?.length;
    setMaxData(max);
    setTrendStartDate(trendTile?.data?.startDate);
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
    if (!viewFirstCase && category === 'Specialty') {
      transformed = tileData?.ots.map((time, i) => ({
        start: time,
        change: tileData?.otsMomentum?.[i],
        specialty: tileData?.specialty?.[i],
        display: tileData?.displayOts?.[i],
      }));
    } else if (viewFirstCase && category === 'Specialty') {
      transformed = tileData?.fcots.map((time, i) => ({
        start: time,
        change: tileData?.fcotsMomentum?.[i],
        specialty: tileData?.specialty?.[i],
        ots: tileData?.otsMomentum?.[i],
        display: tileData?.displayFcots?.[i],
      }));
    }

    if (!viewFirstCase && category === 'Room') {
      transformed = tileData?.ots?.map((time, i) => ({
        start: time,
        room: tileData?.room?.[i],
        change: tileData?.otsMomentum?.[i],
        display: tileData?.displayOts?.[i],
      }));
    } else if (viewFirstCase && category === 'Room') {
      transformed = tileData?.fcots?.map((time, i) => ({
        start: time,
        room: tileData?.room[i],
        change: tileData?.fcotsMomentum?.[i],
        ots: tileData?.otsMomentum?.[i],
        display: tileData?.displayFcots?.[i],
      }));
    }

    return cb(transformed);
  };

  const toggleChartData = (e) => {
    setChartData(e.target.value);
    setFilteredChartData(e.target.value.includes('7') ? 'weekTrend' : 'monthTrend');
  };

  const renderTileData = (tile, hideRadio, hideTitle) => {
    return (
      <React.Fragment>
        {!hideTitle && <div
          className='tile-title'
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '16px 0 0 16px'
          }}
        >
          {tile?.title}
          <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(tile?.toolTip) ? tile?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : tile?.toolTip}>
            <InfoOutlinedIcon style={{ fontSize: 16, margin: '4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.toolTip?.toString()}`} />
          </LightTooltip>
        </div>}
        {!hideRadio && <Grid container>
          <Grid item xs={12}>
            <RadioButtonGroup style={{ display: 'flex', alignItems: 'flex-end' }} value={bySpecialty} onChange={toggleSpecialty} options={options} highlightColour="#004F6E" />
          </Grid>
        </Grid>}
        <Divider style={{ color: '#e0e0e0', marginTop: '12px' }} />
        <StyledTable

          columns={[
            {
              field: tile?.independentVarTitle?.toLowerCase(), title: tile?.independentVarTitle, defaultSort: 'desc',
              headerStyle:{maxWidth:70},cellStyle:{maxWidth:70, borderBottom:'none'},
              render: rowData => (
                <div style={{maxWidth:170}} className='ellipses' title={rowData?.[tile?.independentVarTitle?.toLowerCase()]} >
                  {rowData?.[tile?.independentVarTitle?.toLowerCase()]}
                </div>
              )
            }, {
              field: 'start', title: tile?.dependentVarTitle,
              render: rowData => <span >{rowData?.start !== null ? `${rowData?.start}%` : 'N/A'}</span>
            }, {
              field: 'display', title: 'display', hidden: true, defaultSort: 'desc'
            }, {
              field: 'change', title: 'Change',
              render: rowData => <ChangeIcon change={rowData?.change} style={{minWidth:69, textAlign:'center'}}/>,
              customSort: (a, b) => (a.change == null ? -.1 : a.change) - (b.change == null ? -.1 : b.change),
            }]}
          data={transformData(tile?.data, tile?.independentVarTitle,
            (data) => {
              return data;
            }
          )}
          style={{ overflowX: 'hidden' }}
          options={{
            search: false,
            paging: false,
            toolbar: false,
            sorting: true,
            maxBodyHeight: hideRadio ? 308 : 615,

            headerStyle: {
              fontFamily: "Noto Sans",
              fontSize: 16,
              color: '#333333',
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
              lineHeight: "22px",
              // width: 'unset',
              top: 0,
              padding: '8px 16px',
              whiteSpace: 'nowrap',
            },
            cellStyle: {
              padding: '8px 16px',
              borderBottom: 'none',
            },
            // tableLayout: "fixed",
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
            Container: props => <Paper {...props} elevation={0} />,
            Row: props => <MTableBodyRow className={props?.data?.display ? '' : 'faded'} {...props} />
          }}
        />
      </React.Fragment >
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
          roomNames: rooms,
          specialtyNames: specialtyNames
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
      <Grid container spacing={4} className="efficiency-container tile-container">
        <Grid item xs={12} className="efficiency-dashboard-header header-2">
          Case On Time
        </Grid>
        <Grid item xs={3} style={{ paddingRight: '0px' }}>
          <Grid container item xs={12} spacing={4}>
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
                    <OvertimeCard data={tile.overtime} reverse />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={4}>
          <Grid item xs={12}>
            <Card className='tile-card' style={{ height: '720px' }}>
              <CardContent style={{ overflowY: 'auto', padding: 0 }}>
                {maxData > 12 ? (
                  <React.Fragment>
                    {bySpecialty === 'By Room' && renderTileData(tile?.room)}
                    {bySpecialty === 'By Specialty' && renderTileData(tile?.specialty)}
                  </React.Fragment>
                ) : (
                  <>
                    {renderTileData(tile?.room, true)}
                    {renderTileData(tile?.specialty, true, true)}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={4}>
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
                      {...tile.distribution}
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
        <Grid spacing={4} container className="efficiency-container">
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
