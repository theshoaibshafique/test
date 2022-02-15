/* eslint react/no-danger: 0 */
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
import TimeCard from './TimeCard';
import AreaGraph from '../Charts/AreaGraph';
import useLocalStorage from '../../hooks/useLocalStorage';
import useSelectData from '../../hooks/useSelectData';
import './styles.scss';

// @TODO: Possibly remove state as some of this is handled through a hook instead
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
// @TODO: Add more colours depending on what the decision is for rendering data for the donut chart (unless expectation is repeated colours for multiple additional categories)
const DONUT_COLOURS = ['#A7E5FD', '#FF7D7D', '#FF4D4D', '#CFB9E4', '#97E7B3', '#FFDB8C', '#A77ECD', '#97E7B3', '#A77ECD'];
// Horizontal bar chart colours
const colors = ['#FF7D7D'];

const Efficiency = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const { setItemInStore } = useLocalStorage();
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const [orGraphData, setOrGraphData] = React.useState([]);
  const [tile, setTile] = React.useState({});

  // GET data from the efficiency API using a POST request, passing in pieces of data that will be used to determine the initial response to populate the page
  const { data } = useSelectData(process.env.EFFICIENCYV2_API, 'post', userToken, {
    ...state.defaultPayload, facilityName: userFacility, startDate: state.startDate.format('YYYY-MM-DD'), endDate: state.endDate.format('YYYY-MM-DD')
  }, axios.CancelToken.source());

  React.useEffect(() => {
    if (!data) return;
    dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data } });
  }, [data]);

  // @TODO: This is somewhat duplicated (though still different) across multiple pages. If the time arises, consolidate to one function that can return this data to the FE with names the FE can use properly. Would be easier to not need to do a find to get each individual tile, but the structure of the payload being returned combined with the design will inhibit the ability to render these within a loop
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
      // @TODO: hook up loading animation if necessary, not currently hooked up in any way
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const retrieveConfiguration = request('get');
        const configData = await retrieveConfiguration(`${process.env.CONFIGURATION_API}?facility_id=${userFacility}`, userToken, null, axios.CancelToken.source());
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

  /*
  * @TODO: Remove this code if the backend returns data formatted as an array of objects
  *
  * Returns formatted data for a donut chart, taken from malformed backend data
  * @param {Array<object>} dataset - Data object retrieved from the API, specific to the donut "tile"
  * @returns {Array<object>} dataset (modified) - The data modified to suit a structure the charting library can use
  */
  const formatDonutData = (dataset) => dataset.specialties.map((specialty, i) => ({
    name: specialty,
    value: dataset.counts[i],
    color: DONUT_COLOURS[i]
  }));

  /*
  * @TODO: Remove this code if the backend returns data formatted as an array of objects
  *
  * Returns formatted data for a bar chart, taken from malformed backend data
  * @param {Array<object>} dataset - Data object retrieved from the API, specific to the donut "tile"
  * @returns {Array<object>} dataset (modified) - The data modified to suit a structure the charting library can use
  */
  const formatBarGraphData = (dataset) => dataset?.rooms.map((room, i) => ({
    room,
    time: dataset.counts[i]
  }));

  /*
  * @TODO: Remove this code if the backend returns more than two singular data points for use in creating a graph
  * @TODO: Possibly exchange this for a function we already have that can do this / other things as necessary. Disclaimer: I didn't write this.
  *
  * Returns an array of data points constructed from two singular data points for an area chart
  * @param {number} mean - The mean value returned from the API for the specific tile
  * @param {number} sd - The sd value returned from the API for the specific tile
  * @returns {Array<object>} dataset (modified) - The data modified to suit a structure the charting library can use
  */
  const formatAreaChartData = (mean, sd) => {
    const chartData = [];
    const lowerBound = mean - sd * 3;
    const upperBound = mean + sd * 3;

    for (let x = lowerBound; x < upperBound; x++) {
      chartData.push({ x, y: Math.exp(-0.5 * Math.pow((x - mean) / sd, 2)) });
    }
    return chartData;
  };


  return (
    <div className="page-container">
      <Header />
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={12} className="efficiency-dashboard-header header-2" spacing={0}>
          Efficiency Dashboard
        </Grid>
        <Grid item xs={3}>
          <Card className='tile-card'>
            <CardContent>
              {tile?.efficiency && (
                <React.Fragment>
                  <div
                    className='tile-title'
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    {tile.efficiency.title}
                    <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(tile?.efficiency?.toolTip) ? tile?.efficiency?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : tile?.efficiency?.toolTip}>
                      <InfoOutlinedIcon style={{ fontSize: 16, marginLeft: '4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.efficiency?.toolTip?.toString()}`} />
                    </LightTooltip>
                  </div>
                  <AreaGraph data={formatAreaChartData(tile.efficiency.network.mean, tile.efficiency.network.sd)} reference={tile.efficiency.network.mean} />
                  <div className="additional-scores" style={{ display: 'none' }}> {/* TODO: Change styles to avoid needing these empty divs */}
                    <div className="additional-scores-title"></div>
                    <div className="additional-scores-value"></div>
                  </div>
                  <div className="additional-scores" style={{ marginTop: 24 }}>
                    <div className="additional-scores-title">OR Black Box<sup>&reg;</sup> Network</div>
                    <div className="additional-scores-value">{tile.efficiency.value || 0}</div>
                  </div>
                </React.Fragment>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Card className='tile-card' >
            <CardContent>
              {tile?.headline && (
                <React.Fragment>
                  <div
                    className='tile-title'
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    {tile.headline.title}
                    <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(tile?.headline?.toolTip) ? tile?.headline?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : tile?.headline?.toolTip}>
                      <InfoOutlinedIcon style={{ fontSize: 16, marginLeft: '4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.headline?.toolTip?.toString()}`} />
                    </LightTooltip>
                  </div>
                  <div
                    style={{
                      display: 'flex', justifyContent: 'center', flexDirection: 'column', height: '300px'
                    }}
                  >
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
                            display: 'flex', left: 50, top: 0, justifyContent: 'flex-start', position: 'absolute', cursor: 'pointer'
                          }}
                        >
                          <ArrowBackIosIcon />
                        </div>
                      }
                      customRightArrow={
                        <div
                          style={{
                            display: 'flex', right: 50, top: 0, justifyContent: 'flex-end', position: 'absolute', cursor: 'pointer',
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
                            flexDirection: 'row',
                            flexWrap: 'wrap'
                          }}
                          dangerouslySetInnerHTML={{
                            __html: sentence.replace(/\[([^\]]+)\]/gm, '&nbsp;<strong style="display: inline-flex; color: #004F6E;">$1</strong>&nbsp;')
                          }}
                        />
                      ))}
                    </Carousel>
                  </div>
                </React.Fragment>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={3}>
          <Card className='tile-card'>
            <CardContent>
              {tile?.onTime && (
                <TimeCard data={tile.onTime} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className='tile-card'>
            <CardContent>
              {tile?.utilization && (
                <TimeCard data={tile.utilization} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className='tile-card'>
            <CardContent>
              {tile?.schedule && (
                <TimeCard data={tile.schedule} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className='tile-card'>
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
          <Card className='tile-card'>
            <CardContent>
              {tile?.overtime && (
                <React.Fragment>
                  <div className='tile-title' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {tile?.overtime?.title}
                    <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(tile?.overtime?.toolTip) ? tile?.overtime?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : tile?.overtime?.toolTip}>
                      <InfoOutlinedIcon style={{ fontSize: 16, margin: '4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.overtime?.toolTip?.toString()}`} />
                    </LightTooltip>
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
          <Card className='tile-card'>
            <CardContent style={{ height: 390 }}>
              {tile?.specialty && (
                <React.Fragment>
                  <div
                    className='tile-title'
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    {tile?.specialty?.title}
                    <LightTooltip
                      placement="top"
                      fontSize="small"
                      interactive
                      arrow
                      title={tile?.specialty?.toolTip?.toString().replace(/\b.,\b/g, '. ')}
                    >
                      <InfoOutlinedIcon
                        style={{ fontSize: 16, margin: '4px', color: '#8282828' }}
                        className="log-mouseover"
                        id={`info-tooltip-${tile?.specialty?.toolTip?.toString()}`}
                      />
                    </LightTooltip>
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
