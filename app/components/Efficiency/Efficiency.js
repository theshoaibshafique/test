/* eslint react/no-danger: 0 */
import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import Grid from '@material-ui/core/Grid';
import { Card as MaterialCard } from '@material-ui/core';

import CardContent from '@material-ui/core/CardContent';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Header from './Header';
import Donut from '../Charts/Donut';
import HorizontalBar from '../Charts/HorizontalBar';
import { makeSelectToken, makeSelectUserFacility } from '../../containers/App/selectors';
import { LightTooltip, StyledSkeleton } from '../../components/SharedComponents/SharedComponents';
import TimeCard from './TimeCard';
import AreaGraph from '../Charts/AreaGraph';

import './styles.scss';
import useFilter from '../../hooks/useFilter';
import RadioButtonGroup from '../SharedComponents/RadioButtonGroup';
import globalFunctions from '../../utils/global-functions';

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
function normalCdf(value) {
  const z = (value - 50) / 12.5;  // mean and std. dev. of norm dist
  const t = 1 / (1 + .2315419 * Math.abs(z));
  const d =.3989423 * Math.exp( -z * z / 2);
  const prob = d * t * (.3193815 + t * ( -.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z < 0 ? prob : 1 - prob;
}
function normalPdf(value) {  // mean 50; std 12.5
  return (Math.E ** -((value - 50) ** 2 / (2 * 12.5 ** 2))) / (12.5 * Math.sqrt(2 * Math.PI));
}
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const [{ payload: { x, y } }] = payload;
    const percentile = `${globalFunctions.ordinal_suffix_of(Math.round(normalCdf(x) * 100))} percentile`;
    return (
      <div
        style={{ background: '#F2F2F2', borderRadius: 4, padding: 8 }}
      >
        <div><span className='bold'>{x}</span> Efficiency Index</div>
        <div><span className='bold'>{percentile}</span> percentile</div>
      </div>
    );
  }
  return null;
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
const DONUT_COLOURS = ['#A7E5FD', '#FF7D7D', '#CFB9E4', '#97E7B3', '#FFDB8C', '#A77ECD', '#97E7B3'];
// Horizontal bar chart colours
const colors = ['#FF7D7D'];

const Efficiency = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const [orGraphData, setOrGraphData] = React.useState([]);
  const [tile, setTile] = React.useState({});
  const [date, setDate] = React.useState({});
  const [fco, setFCO] = React.useState(false);
  const options = [
    {
      id: 1,
      value: 'By Specialty'
    },
    {
      id: 2,
      value: 'By Room'
    }
  ];
  const [caseCountsBy, setCaseCountsBy] = React.useState('By Specialty');
  const handleCaseToggle = (e) => {
    setCaseCountsBy(e.target.value);
  }
  const { fetchConfigData, applyGlobalFilter, loading } = useFilter();
  // const loading = true;
  React.useEffect(() => {
    const fetchData = async () => {
      const config = await fetchConfigData({ userFacility, userToken, cancelToken: axios.CancelToken.source() });
      //Dashboard page starts as 7 days
      const { endDate } = config ?? {};
      const startDate = moment(endDate)?.subtract(7, 'days')?.format('YYYY-MM-DD');
      setDate({ startDate, endDate });
      // GET data from the efficiency API using a POST request, passing in pieces of data that will be used to determine the initial response to populate the page    
      await applyGlobalFilter({
        endpoint: process.env.EFFICIENCYV2_API,
        userToken,
        cancelToken: axios.CancelToken.source()
      }, {
        ...state.defaultPayload, facilityName: userFacility, startDate, endDate
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



  // @TODO: This is somewhat duplicated (though still different) across multiple pages. If the time arises, consolidate to one function that can return this data to the FE with names the FE can use properly. Would be easier to not need to do a find to get each individual tile, but the structure of the payload being returned combined with the design will inhibit the ability to render these within a loop
  React.useEffect(() => {
    if (!state.tiles) return;
    const efficiencyTile = state.tiles.find(({ identifier }) => identifier?.toLowerCase() === 'index');
    const headlineTile = state.tiles.find(({ identifier }) => identifier?.toLowerCase() === 'headlines');
    const onTimeTile = state.tiles.find(({ identifier }) => identifier?.toLowerCase() === 'ots');
    const fcotTile = state.tiles.find(({ identifier }) => identifier?.toLowerCase() === 'fcots');
    const otTile = state.tiles.find(({ identifier }) => identifier?.toLowerCase() === 'overtime');
    const utilizationTile = state.tiles.find(({ identifier }) => identifier?.toLowerCase() === 'block utilization');
    const turnoverTile = state.tiles.find(({ identifier }) => identifier.toLowerCase() === 'turnover');
    const scheduleTile = state.tiles.find(({ identifier }) => identifier.toLowerCase() === 'scheduling');
    const specialtyTile = state.tiles.find(({ identifier }) => identifier.toLowerCase() === 'throughput specialty');
    const roomTile = state.tiles.find(({ identifier }) => identifier.toLowerCase() === 'throughput room');

    const formattedHorizontalBarData = formatBarGraphData(otTile?.data);
    setOrGraphData(formattedHorizontalBarData);

    setTile({
      efficiency: efficiencyTile,
      headline: headlineTile,
      onTime: onTimeTile,
      fcot: fcotTile,
      overtime: otTile,
      utilization: utilizationTile,
      turnover: turnoverTile,
      schedule: scheduleTile,
      specialty: specialtyTile,
      room: roomTile,
      totalCases: specialtyTile?.data?.total
    });
  }, [state]);

  /*
  * @TODO: Remove this code if the backend returns data formatted as an array of objects
  *
  * Returns formatted data for a donut chart, taken from malformed backend data
  * @param {Array<object>} dataset - Data object retrieved from the API, specific to the donut "tile"
  * @returns {Array<object>} dataset (modified) - The data modified to suit a structure the charting library can use
  */
  const formatDonutData = (dataset) => dataset?.[caseCountsBy === 'By Specialty' ? 'specialties' : 'rooms'].map((name, i) => ({
    name,
    value: dataset.counts[i],
    // color: DONUT_COLOURS[i % DONUT_COLOURS.length]
  }))?.sort((a, b) => a?.value - b?.value)?.map((data, i) => ({ ...data, color: DONUT_COLOURS[i % DONUT_COLOURS.length] }));

  /*
  * @TODO: Remove this code if the backend returns data formatted as an array of objects
  *
  * Returns formatted data for a bar chart, taken from malformed backend data
  * @param {Array<object>} dataset - Data object retrieved from the API, specific to the donut "tile"
  * @returns {Array<object>} dataset (modified) - The data modified to suit a structure the charting library can use
  */
  const formatBarGraphData = (dataset) => dataset?.rooms.map((room, i) => ({
    room,
    Time: dataset.overtime[i]
  }))?.sort((a, b) => a?.Time - b?.Time);

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
    const lowerBound = 0;
    const upperBound = 100;

    for (let x = lowerBound; x < upperBound; x++) {
      chartData.push({ x, y: normalPdf(x) });
    }
    return chartData;
  };

  const Card = loading ? StyledSkeleton : MaterialCard;
  const handleFCO = () => {
    setFCO(!fco)
  }
  const fcotToggle = { value: fco, onChange: handleFCO };
  return (
    <div className="page-container">
      <Header displayDate={date} />
      <div className='tile-container'>
        <Grid container spacing={4} className="efficiency-container">
          <Grid item xs={12} className="efficiency-dashboard-header header-2" spacing={0}>
            Efficiency Dashboard
          </Grid>
          <Grid item xs={3}>
            <Card className='tile-card' >
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
                    <AreaGraph
                      data={formatAreaChartData(tile.efficiency.network.mean, tile.efficiency.network.sd)}
                      reference={tile.efficiency.value}
                      topReference
                      CustomTooltip={CustomTooltip}
                    />
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
              <CardContent >
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
                        display: 'flex', justifyContent: 'center', flexDirection: 'column', height: '267px'
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
                              display: 'flex', left: 15, top: 86, justifyContent: 'flex-start', position: 'absolute', cursor: 'pointer'
                            }}
                          >
                            <ArrowBackIosIcon />
                          </div>
                        }
                        customRightArrow={
                          <div
                            style={{
                              display: 'flex', right: 15, top: 86, justifyContent: 'flex-end', position: 'absolute', cursor: 'pointer',
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
                              display: 'inline-block',
                              textAlign: 'center',
                              width: '100%'
                            }}
                          >
                            {renderFormattedText(sentence)}
                          </div>
                        ))}
                      </Carousel>
                    </div>
                  </React.Fragment>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="efficiency-container">
          <Grid item xs={3}>
            <Card className='tile-card'>
              <CardContent>
                {tile?.onTime && (
                  <TimeCard data={fco ? tile.fcot : tile.onTime} toggle={fcotToggle} />
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
                  <TimeCard data={tile.schedule} hideGoal />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card className='tile-card'>
              <CardContent>
                {tile?.turnover && (
                  <TimeCard data={tile.turnover} suffix=' min' />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="efficiency-container">
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
                      dataKeys={['Time']}
                      colors={colors}
                      height={250}
                      margin={{
                        top: 20, right: 30, left: 20, bottom: 20
                      }}

                      barCategoryGap={'10%'}
                    />
                    <div className='subtle-text' style={{ color: '#828282' }}>
                      {`Combined Total: ${tile?.overtime?.data?.total || 0} min (${tile?.overtime?.data?.annualized || 0} annualized)`}
                    </div>
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
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
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
                      <RadioButtonGroup value={caseCountsBy} onChange={handleCaseToggle} options={options} highlightColour="#004F6E" />
                    </div>
                    {!!tile?.specialty && (
                      <Donut
                        data={formatDonutData(caseCountsBy === 'By Specialty' ? tile.specialty.data : tile.room.data)}
                        tooltips={tile.specialty.toolTip}
                        label={{ title: 'Total Cases', value: tile.specialty.data.total }}
                      />
                    )}
                  </React.Fragment>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Efficiency;
//Given a sentence with words in brackets like "[Hey] everyone what [is happening]."
//Bold the words with brackets
function renderFormattedText(text) {
  if (!text) {
    return '';
  }
  const pattern = /\[(.*?)\]/g;
  const matches = text.matchAll(pattern);
  const placementMap = {}
  //Replace bracketed words with a single expression '{0}' (to handle spaces in brackets)
  for (const match of matches) {
    const brackets = match[0]
    const contents = match[1]
    const index = match.index
    const key = `{${index}}`
    text = text.replace(brackets, key)
    placementMap[key] = contents
  }
  //For every word we bracket those we have saved/matched
  const formattedText = text.split(" ").map((word, index) => {
    //Matches {0}, {1}, ... etc -(in case a matched replacement has a character attached "{0}.")
    const pattern = /{(\d+)}/g;
    const match = word.match(pattern);
    const brackets = match?.[0]
    if (placementMap[brackets]) {
      return <span style={{ fontWeight: 'bold', color: '#004F6E', margin: '0 4px' }} key={index}>{`${placementMap[brackets]} `}</span>
    } else {
      return `${word} `
    }
  });
  return formattedText;
}