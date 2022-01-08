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
import BarGraph from '../../Charts/Bar';
import useSelectData from '../../../hooks/useSelectData';

const INITIAL_STATE = {
  tabIndex: 0,
  informationModalOpen: false,
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

  const barGraphToggleOptions = [
    {
      id: 1,
      value: 'Turnover'
    },
    {
      id: 2,
      value: 'Cleanup'
    },
    {
      id: 3,
      value: 'Idle'
    },
    {
      id: 4,
      value: 'Setup'
    },
  ];
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const [chartData, setChartData] = React.useState('30-day moving average');
  const [graphData, setGraphData] = React.useState('Turnover');
  const [filteredChartData, setFilteredChartData] = React.useState('month_trend');
  const [trendLineData, setTrendLineData] = React.useState([]);
  const [trendSlider, setTrendSlider] = React.useState([0, 100]);
  const [orGraphData, setOrGraphData] = React.useState([]);
  const [dateDiff, setDateDiff] = React.useState(0);

  const [tile, setTile] = React.useState({});

  const [trendEndDate, setTrendEndDate] = React.useState('');
  const [trendStartDate, setTrendStartDate] = React.useState('');

  const colors = ['#97E7B3', '#FFB71B', '#3DB3E3'];
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const { data } = useSelectData(process.env.TURNOVER_API, userToken, {...state.defaultPayload, facilityName: userFacility, startDate: state.startDate.format('YYYY-MM-DD'), endDate: state.endDate.format('YYYY-MM-DD')}, axios.CancelToken.source()); 

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
    setDateDiff({ trend: diff });
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
    // setStartDistributionSlider([startGapTile?.data?.values[0].bin, startGapTile?.data?.values[startGapTile?.data?.values.length - 1].bin]);
    // start gap labels
    // setStartDistributionStartLabel(startGapTile?.data?.values[0].bin);
    // setStartDistributionEndLabel(startGapTile?.data?.values[startGapTile?.data?.values.length - 1].bin);

    //end gap labels
    // setEndDistributionStartLabel(endGapTile?.data?.values[0].bin);
    // setEndDistributionEndLabel(endGapTile?.data?.values[endGapTile?.data?.values.length - 1].bin);

    // setEndDistributionSlider([endGapTile?.data?.values[0].bin, endGapTile?.data?.values[endGapTile?.data?.values.length - 1].bin]);
  }, [state.tiles]);

  React.useEffect(() => {
    const trendTile = state?.tiles?.find(({ title }) => title.toLowerCase().includes('trend'));
    const formattedData = formatLineData(trendTile?.data[filteredChartData]);
    setTrendLineData(formattedData); 
  }, [trendStartDate, trendEndDate, filteredChartData]);

  const toggleInformationModal = React.useCallback(() => {
    dispatch({ type: 'TOGGLE_INFORMATION_MODAL', payload: !state.informationModalOpen });
  }, [state.informationModalOpen]);

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

  const toggleGraphData = (e) => {
    setGraphData(e.target.value);
  }

  const handleFilterDates = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const requestPayload = {
        startDate: trendStartDate.format('YYYY-MM-DD'),
        endDate: trendEndDate.format('YYYY-MM-DD'),
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

  return (
    <div className="page-container">
      <Header onClick={toggleInformationModal}>
      </Header>
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={12} className="efficiency-dashboard-header">
          <h3>Turnover Time</h3>
        </Grid>
        <Grid item xs={3}>
          <Card style={{ height: '365px' }}>
            <CardContent>
              {tile?.time && (
                <React.Fragment>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <h4>
                      {tile?.time?.title}
                      <LightTooltip placement="top" fontSize="small" interactive arrow title={tile?.time?.toolTip?.toString()}>
                        <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.time?.toolTip?.toString()}`} />
                      </LightTooltip>
                    </h4>
                  </div>
                  <span className="display-number">
                    {tile?.time?.previousPeriod}
                    <sup className="superscript-text">Min</sup>
                  </span>
                  <div className="additional-scores">
                    <div className="additional-scores-title">Previous Period </div>
                    <div className="additional-scores-value">{tile?.time?.previousPeriod}%</div>
                  </div>
                  <div className="additional-scores">
                    <div className="additional-scores-title">OR Black Box<sup>&reg;</sup> Network</div>
                    <div className="additional-scores-value">{tile?.time?.network}%</div>
                  </div>
                </React.Fragment>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card style={{ height: '365px' }}>
            <CardContent>
              {tile?.overtime && (
                <React.Fragment>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <h4 style={{ marginBottom: '32px' }}>
                      { tile?.overtime?.title }
                      <LightTooltip placement="top" fontSize="small" interactive arrow title={tile?.overtime?.toolTip?.toString()}>
                        <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.overtime?.toolTip?.toString()}`} />
                      </LightTooltip>
                    </h4>
                  </div>
                  <div className="overtime-rows">
                    <div className="overtime-block-number">{tile?.overtime?.value?.sum}
                      <sub>min</sub>
                    </div>
                    <div className="overtime-helper" style={{ flex: '1 0 20%' }}>
                      in total
                    </div>
                    <div className="overtime-block-number">{tile?.overtime?.value?.by_block}
                      <sub>min</sub>
                    </div>
                    <div className="overtime-helper">
                      Average per Block
                    </div>
                  </div>
                </React.Fragment>
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
                <React.Fragment>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <h4>
                      {tile?.duration?.title}
                      <LightTooltip placement="top" fontSize="small" interactive arrow title={tile?.duration?.toolTip?.toString()}>
                        <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.duration?.toolTip?.toString()}`} />
                      </LightTooltip>
                    </h4>
                  </div>
                  <div
                    style={{
                      display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-end'
                    }}
                  >
                    <RadioButtonGroup value={graphData} onChange={toggleGraphData} options={barGraphToggleOptions} highlightColour="#592D82" />
                  </div>
                  <BarGraph
                    height={200}
                    data={tile?.duration?.data[graphData.toLowerCase()]}
                    xAxisLabel={{
                      value: 'Turnover Duration (min)',
                      offset: -10,
                      position: 'insideBottom'
                    }}
                    yAxisLabel={{
                      value: 'Frequency',
                      angle: -90,
                      offset: 15,
                      position: 'insideBottomLeft'
                    }}
                    margin={{ bottom: 20 }}
                    colors={['#A77ECD']}
                  />
                  <Grid item xs={12} style={{ marginTop: 10 }}>
                    <RangeSlider
                      id="duration"
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
