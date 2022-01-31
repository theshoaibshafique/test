import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { request } from '../../utils/global-functions';
// import LoadingIndicator from '../LoadingIndicator';
import Header from './Header';
import Donut from '../Charts/Donut';
import HorizontalBar from '../Charts/HorizontalBar';
import { makeSelectToken, makeSelectUserFacility } from '../../containers/App/selectors';
import { LightTooltip } from '../../components/SharedComponents/SharedComponents';
import useLocalStorage from '../../hooks/useLocalStorage';
import useSelectData from '../../hooks/useSelectData';
import TimeCard from './TimeCard';
import './styles.scss';

const INITIAL_STATE = {
  tabIndex: 0,
  informationModalOpen: false,
  startDate: moment().subtract(1, 'month').startOf('month'),
  endDate: moment().subtract(1, 'month').endOf('month'),
  loading: false,
  defaultPayload: {
    roomNames: [],
    specialtyNames: []
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
        tiles: action.payload.tiles,
      };
    default:
      return state;
  }
};

const DONUT_COLOURS = ['#A7E5FD', '#FF7D7D', '#FF4D4D', '#CFB9E4', '#97E7B3', '#FFDB8C', '#A77ECD', '#97E7B3', '#A77ECD'];
const colors = ['#FF7D7D'];

const Efficiency = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const { setItemInStore } = useLocalStorage();
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const [orGraphData, setOrGraphData] = React.useState([]);
  const [tile, setTile] = React.useState({});
  const { data } = useSelectData(process.env.EFFICIENCYV2_API, userToken, {
    ...state.defaultPayload, facilityName: userFacility, startDate: state.startDate.format('YYYY-MM-DD'), endDate: state.endDate.format('YYYY-MM-DD')
  }, axios.CancelToken.source());

  React.useEffect(() => {
    if (!data) return;
    dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data } });
  }, [data]);

  React.useEffect(() => {
    if (!state.tiles) return;
    const efficiencyTile = state.tiles.find(({ title }) => title.toLowerCase().includes('efficiency index'));
    const headlineTile = state.tiles.find(({ title }) => title.toLowerCase() === 'efficiency');
    const onTimeTile = state.tiles.find(({ title }) => title.toLowerCase().includes('on-time'));
    const otTile = state.tiles.find(({ title }) => title.toLowerCase().includes('overtime'));
    const utilizationTile = state.tiles.find(({ title }) => title.toLowerCase().includes('block'));
    const turnoverTile = state.tiles.find(({ title }) => title.toLowerCase().includes('turnover'));
    const scheduleTile = state.tiles.find(({ title }) => title.toLowerCase().includes('under-schedule'));
    const specialtyTile = state.tiles.find(({ title }) => title.toLowerCase().includes('specialty'));
    const roomTile = state.tiles.find(({ title }) => title.toLowerCase().includes('room'));

    const formattedHorizontalBarData = formatBarGraphData(roomTile?.data);
    setOrGraphData(formattedHorizontalBarData);

    setTile({
      efficiency: efficiencyTile,
      headline: headlineTile,
      onTime: onTimeTile,
      overtime: otTile,
      utilization: utilizationTile,
      turnover: turnoverTile,
      schedule: scheduleTile,
      specialty: specialtyTile,
    });
  }, [state]);

  React.useEffect(() => {
    const fetchTileData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const retrieveConfiguration = request('get');
        const configData = await retrieveConfiguration(`${process.env.EFFICIENCY_API}/config?facility_id=${userFacility}`, userToken, null, axios.CancelToken.source());
        if (configData) {
          setItemInStore('efficiencyV2', {
            efficiency: configData
          });
          setItemInStore('globalFilter', {
            startDate: configData.startDate,
            endDate: configData.endDate,
            fcotsThreshold: configData.fcotsThreshold,
            otsThreshold: configData.turnoverThreshold
          });
        }

        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (err) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    fetchTileData();
  }, []);

  const formatDonutData = (dataset) => dataset.specialties.map((specialty, i) => ({
    name: specialty,
    value: dataset.counts[i],
    color: DONUT_COLOURS[i]
  }));

  const formatBarGraphData = (dataset) => dataset?.rooms.map((room, i) => ({
    room,
    time: dataset.counts[i]
  }));

  return (
    <div className="page-container">
      <Header />
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={12} className="efficiency-dashboard-header" spacing={0}>
          <h3>Efficiency Dashboard</h3>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
            Efficiency Index
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Card>
            <CardContent>
              {tile?.headline && (
                <React.Fragment>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <h4>{tile.headline.title}</h4>
                    <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(tile?.headline?.toolTip) ? tile?.headline?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : tile?.headline?.toolTip}>
                      <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.headline?.toolTip?.toString()}`} />
                    </LightTooltip>
                  </div>
                  <Carousel
                    responsive={{
                      desktop: {
                        breakpoint: { max: 3000, min: 1024 },
                        items: 1,
                      },
                      tablet: {
                        breakpoint: { max: 1024, min: 464 },
                        items: 1,
                      },
                      mobile: {
                        breakpoint: { max: 464, min: 0 },
                        items: 1,
                      }
                    }}
                    showDots
                    infinite
                    transitionDuration={500}
                    customLeftArrow={
                      <div
                        style={{
                          display: 'flex', left: 50, justifyContent: 'flex-start', position: 'absolute', cursor: 'pointer'
                        }}
                      >
                        <ArrowBackIosIcon />
                      </div>
                    }
                    customRightArrow={
                      <div
                        style={{
                          display: 'flex', right: 50, justifyContent: 'flex-end', position: 'absolute', cursor: 'pointer',
                        }}
                      >
                        <ArrowForwardIosIcon />
                      </div>
                    }
                  >
                    {tile.headline.data.sentences.map((sentence) => (
                      <div
                        key={uuidv4()}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '850px',
                          marginRight: 'auto',
                          marginLeft: 'auto',
                          marginBottom: 36,
                          flexDirection: 'row'
                        }}
                      >{sentence}
                      </div>
                    ))}
                  </Carousel>
                </React.Fragment>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={3}>
          <Card>
            <CardContent>
              {tile?.onTime && (
                <TimeCard data={tile.onTime} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              {tile?.utilization && (
                <TimeCard data={tile.utilization} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              {tile?.schedule && (
                <TimeCard data={tile.schedule} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              {tile?.turnover && (
                <TimeCard data={tile.turnover} />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={6}>
          <Card>
            <CardContent>
              {tile?.overtime && (
                <React.Fragment>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <h4>
                      {tile?.overtime?.title}
                      <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(tile?.overtime?.toolTip) ? tile?.overtime?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : tile?.overtime?.toolTip}>
                        <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.overtime?.toolTip?.toString()}`} />
                      </LightTooltip>
                    </h4>
                  </div>
                  <HorizontalBar
                    data={orGraphData}
                    xAxisLabel={{ value: 'Time (min)', offset: -10, position: 'insideBottom' }}
                    yAxisLabel={{
                      value: 'Room', angle: -90, offset: -5, position: 'insideLeft'
                    }}
                    dataKeys={['time']}
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
          <Card>
            <CardContent style={{ height: 390 }}>
              {tile?.specialty && (
                <React.Fragment>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <h4>
                      {tile?.specialty?.title}
                      <LightTooltip
                        placement="top"
                        fontSize="small"
                        interactive
                        arrow
                        title={tile?.specialty?.toolTip?.toString().replace(/\b.,\b/g, '. ')}
                      >
                        <InfoOutlinedIcon
                          style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }}
                          className="log-mouseover"
                          id={`info-tooltip-${tile?.specialty?.toolTip?.toString()}`}
                        />
                      </LightTooltip>
                    </h4>
                  </div>
                  {!!tile?.specialty && (
                    <Donut
                      data={formatDonutData(tile.specialty.data)}
                      tooltips={tile.specialty.toolTip}
                      label={
                        <React.Fragment>
                          <text x={160} y={95} style={{ fontSize: 14, color: '#333' }}>
                            Total Cases
                          </text>
                          <text x={150} y={160} style={{ fontSize: 60, color: '#004F6E', fontWeight: 'bold' }}>
                            {tile.specialty.data.total}
                          </text>
                        </React.Fragment>
                      }
                    />
                  )}
                </React.Fragment>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Efficiency;
