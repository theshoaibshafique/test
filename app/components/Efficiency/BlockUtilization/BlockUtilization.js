import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CardContent from '@material-ui/core/CardContent';
// import MonthRangePicker from '../../../components/MonthRangePicker/MonthRangePicker';
import { request } from '../../../utils/global-functions';
import Header from '../Header';
import InformationModal from '../InformationModal';
import { makeSelectToken, makeSelectUserFacility, selectFilters } from '../../../containers/App/selectors';
import { LightTooltip } from '../../../components/SharedComponents/SharedComponents';
import Donut from '../../Charts/Donut';
import BarGraph from '../../Charts/Bar';
import LineGraph from '../../Charts/LineGraph';
import MultiSelectFilter from '../../../components/SharedComponents/MultiSelectFilter';
import RangeSlider from '../../../components/SharedComponents/RangeSlider';
import RadioButtonGroup from '../../../components/SharedComponents/RadioButtonGroup';
import './styles.scss';

const INITIAL_STATE = {
  tabIndex: 0,
  informationModalOpen: false,
  startDate: moment().subtract(8, 'month').startOf('month'),
  endDate: moment().subtract(8, 'month').endOf('month'),
  loading: false,
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

const DONUT_COLOURS = ['#A77ECD', '#50CBFB', '#FFDB8C', '#97E7B3'];

const BlockUtilization = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const filters = useSelector(selectFilters());
  const [filter, setFilter] = React.useState({
    date: '',
    OR: ''
  });

  const [trendSlider, setTrendSlider] = React.useState([0, 100]);
  const [startDistributionSlider, setStartDistributionSlider] = React.useState([0, 100]);
  const [endDistributionSlider, setEndDistributionSlider] = React.useState([0, 100]);
  
  const [trendEndDate, setTrendEndDate] = React.useState('');
  const [trendStartDate, setTrendStartDate] = React.useState('');

  const [startDistributionStartLabel, setStartDistributionStartLabel] = React.useState('');
  const [endDistributionStartLabel, setEndDistributionStartLabel] = React.useState('');

  const [startDistributionEndLabel, setStartDistributionEndLabel] = React.useState('');
  const [endDistributionEndLabel, setEndDistributionEndLabel] = React.useState('');

  const [reload, setReload] = React.useState(false);
  const [dateDiff, setDateDiff] = React.useState({
    trend: 0,
  });
  const [options] = React.useState([
    {
      id: 1,
      value: '30-day moving average'
    },
    {
      id: 2,
      value: '7-day moving average'
    }
  ]);

  const [chartData, setChartData] = React.useState('30-day moving average');
  const [filteredChartData, setFilteredChartData] = React.useState('month_trend');
  const [trendLineData, setTrendLineData] = React.useState([]);
  const [rooms, setRooms] = React.useState([]);
  const [orFilterVal, setOrFilterVal] = React.useState([]); 

  React.useEffect(() => {
    const fetchTileData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const requestData = {
          startDate: state.startDate.format('YYYY-MM-DD'),
          endDate: state.endDate.format('YYYY-MM-DD'),
          facilityName: userFacility,
          roomNames: [],
          specialtyNames: [],
        };
        const retrieveTileData = request('post');
        const data = await retrieveTileData(process.env.BLOCKUTILIZATION_API, userToken, requestData, axios.CancelToken.source());
        if (data?.tiles?.length) {
          dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data.tiles } });
        }
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (err) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    fetchTileData();
  }, [reload]);

  React.useEffect(() => {
    if (!state.tiles) return;
    const trendTile = state.tiles.find(({ title }) => title.toLowerCase().includes('trend'));
    const endGapTile = state.tiles.find(({ title }) => title.toLowerCase().includes('end gap'));
    const startGapTile = state.tiles.find(({ title }) => title.toLowerCase().includes('start gap'));
    setTrendStartDate(trendTile?.data?.start_date),
    setTrendEndDate(trendTile?.data?.end_date)
    const startDate = moment(trendTile?.data?.start_date);
    const endDate = moment(trendTile?.data?.end_date);
    const diff = endDate.diff(startDate, 'days'); 
    setDateDiff({ trend: diff });
    setTrendSlider([0, diff]);
    setStartDistributionSlider([startGapTile?.data?.values[0].bin, startGapTile?.data?.values[startGapTile?.data?.values.length - 1].bin]);
    // start gap labels
    setStartDistributionStartLabel(startGapTile?.data?.values[0].bin);
    setStartDistributionEndLabel(startGapTile?.data?.values[startGapTile?.data?.values.length - 1].bin);

    //end gap labels
    setEndDistributionStartLabel(endGapTile?.data?.values[0].bin);
    setEndDistributionEndLabel(endGapTile?.data?.values[endGapTile?.data?.values.length - 1].bin);

    setEndDistributionSlider([endGapTile?.data?.values[0].bin, endGapTile?.data?.values[endGapTile?.data?.values.length - 1].bin]);
  }, [state.tiles]);

  React.useEffect(() => {
    const trendTile = state?.tiles?.find(({ title }) => title.toLowerCase().includes('trend'));
    const formattedData = formatLineData(trendTile?.data[filteredChartData]);
    setTrendLineData(formattedData); 
  }, [trendStartDate, trendEndDate, filteredChartData]);

  const getTile = (name) => {
    const tile = state?.tiles?.find(({ title }) => title?.toLowerCase().includes(name.toLowerCase()));
    switch (tile?.title) {
      case 'Block Utilization':
        return (
          <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <h4>
                {tile?.title}
                <LightTooltip placement="top" fontSize="small" interactive arrow title={tile?.toolTip?.toString()}>
                  <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.toolTip?.toString()}`} />
                </LightTooltip>
              </h4>
            </div>
            <span className="display-number">
              {tile?.previousPeriod}
              <sup className="superscript-text">%</sup>
            </span>
            <div className="additional-scores">
              <div className="additional-scores-title">Previous Period </div>
              <div className="additional-scores-value">{tile?.previousPeriod}%</div>
            </div>
            <div className="additional-scores">
              <div className="additional-scores-title">ORBB Network Score </div>
              <div className="additional-scores-value">{tile?.network}%</div>
            </div>
          </React.Fragment>
        )
      case 'Block Utilization Trend':
        return (
          <React.Fragment>
            <div
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            >
              <h4>
                { tile?.title }
                <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(tile?.toolTip) ? tile?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : tile?.toolTip}>
                  <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.toolTip?.toString()}`} />
                </LightTooltip>
              </h4>
            </div>
            <div
              style={{
                display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-end'
              }}
            >
              <RadioButtonGroup value={chartData} onChange={toggleChartData} options={options} />
            </div>
            {!!tile && <LineGraph xTickSize={0} interval={30} data={trendLineData} xAxisLabel={{ value: 'Date', offset: -5, position: 'insideBottom' }} yAxisLabel={{ value: 'On Time Start (%)', angle: -90, offset: 15, position: 'insideBottomLeft' }} xTickMargin={8} />}
            <Grid item xs={12} style={{ marginTop: 10 }}>
              <RangeSlider
                id="trend"
                min={0}
                max={dateDiff.trend}
                onChange={filterTrend}
                value={trendSlider}
                startLabel={moment(trendStartDate).format('MMM D YYYY')}
                endLabel={moment(trendEndDate).format('MMM D YYYY')}
                onChangeCommitted={handleFilterDates}
              />
            </Grid>
          </React.Fragment>
        );
      case 'Block Composition':
        return (
          <React.Fragment>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <h4>
                {tile?.title}
                <LightTooltip
                  placement="top"
                  fontSize="small"
                  interactive
                  arrow
                  title={tile?.toolTip?.toString().replace(/\b.,\b/g, '. ')}
                >
                  <InfoOutlinedIcon
                    style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }}
                    className="log-mouseover"
                    id={`info-tooltip-${tile?.toolTip?.toString()}`}
                  />
                </LightTooltip>
              </h4>
            </div>
            {!!tile && <Donut data={formatDonutData(tile?.data)} tooltips={tile?.toolTip} label={
                <React.Fragment>
                  <text x={150} y={95} style={{ fontSize: 14, color: '#333' }}>
                    Total Block Time
                  </text>
                  <text x={tile?.data?.hours > 999 ? 130 : 150} y={160} style={{ fontSize: 64, color: '#004F6E', fontWeight: 'bold' }}>
                    {tile?.data?.hours}
                    <tspan style={{ fontSize: 18, color: '#004F6E', fontWeight: 'normal' }}>hr</tspan>
                  </text>
                </React.Fragment>
            }/>}
          </React.Fragment>
        );
      case 'Block Utilization by Room':
        return (
          <React.Fragment>
            <div
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <h4>
                {tile?.title}
                <LightTooltip
                  placement="top"
                  fontSize="small"
                  interactive
                  arrow
                  title={tile?.toolTip?.toString()}
                >
                  <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.toolTip?.toString()}`} />
                </LightTooltip>
              </h4>
              <Grid container spacing={5}>
                <Grid item xs={3}>
                  OR
                </Grid>
                <Grid item xs={3}>
                  Block Utilization
                </Grid>
                <Grid item xs={3}>
                  % Change
                </Grid>
              </Grid>
              <hr style={{ color: '#e0e0e0', marginTop: '12px' }} />
              {transformRoomData(tile?.data?.room, tile?.data?.momentum, tile?.data?.percentage, (data) => data?.map((row) => {
                return (
                  <Grid
                    container
                    key={row.id}
                    spacing={5}
                    className="room-data-container"
                  >
                    <Grid item xs={3}>
                      {row.or}
                    </Grid>
                    <Grid item xs={3}>
                      {row.change}%
                    </Grid>
                    <Grid item xs={3}>
                      <span className={`change-percent-badge-${row.percent > 0 ? 'increase' : 'decrease'}`}>
                        <span className={`change-percent-text-${row.percent > 0 ? 'increase' : 'decrease'}`}>+{row.percent}%</span>
                        {row.percent > 0 ? 
<svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 0L16.29 2.29L11.41 7.17L7.41 3.17L0 10.59L1.41 12L7.41 6L11.41 10L17.71 3.71L20 6V0H14Z" fill="#009483"/>
</svg>
: 
<svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 12L16.29 9.71L11.41 4.83L7.41 8.83L0 1.41L1.41 0L7.41 6L11.41 2L17.71 8.29L20 6V12H14Z" fill="#EC2027"/>
</svg>
}
                      </span>
                    </Grid>
                  </Grid>
                );
              }))}
            </div>
          </React.Fragment>
        );
      case 'Block End Gap Distribution':
        return (
          <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <h4>
                {tile?.title}
              </h4>
              <LightTooltip
                placement="top"
                fontSize="small"
                interactive
                arrow
                title={tile?.toolTip?.toString()}
              >
                <InfoOutlinedIcon
                  style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }}
                  className="log-mouseover"
                  id={`info-tooltip-${tile?.toolTip?.toString()}`}
                />
              </LightTooltip>
            </div>
            {!!tile && <BarGraph height={200} data={tile?.data?.values} xAxisLabel={{ value: 'Block End Gap (min)', offset: -10, position: 'insideBottom' }} yAxisLabel={{ value: 'Frequency', angle: -90, offset: 15, position: 'insideBottomLeft' }} margin={{ bottom: 20 }} />}
            <Grid item xs={12}>
              <RangeSlider
                id="endDistribution"
                onChange={filterEndDistribution}
                value={endDistributionSlider}
                startLabel=""
                endLabel=""
                // onChangeCommitted={fetchNewDataset}
              />
            </Grid>
          </React.Fragment>
        );
      case 'Block Start Gap Distribution':
        return (
          <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <h4>
                {tile?.title}
                <LightTooltip
                  placement="top"
                  fontSize="small"
                  interactive
                  arrow
                  title={tile?.toolTip?.toString().replace(/\b.,\b/g, '. ')}
                >
                  <InfoOutlinedIcon
                    style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }}
                    className="log-mouseover"
                    id={`info-tooltip-${tile?.toolTip?.toString()}`}
                  />
                </LightTooltip>
              </h4>
            </div>
            {!!tile && <BarGraph interval={5} height={200} data={tile?.data?.values} xAxisLabel={{ value: 'Block Start Gap (min)', offset: -10, position: 'insideBottom' }} yAxisLabel={{ value: 'Frequency', angle: -90, offset: 15, position: 'insideBottomLeft' }} margin={{ bottom: 20 }} />}
            <Grid item xs={12}>
              <RangeSlider
                id="startDistribution"
                min={parseInt(startDistributionStartLabel)}
                max={parseInt(startDistributionEndLabel)}
                onChange={filterStartDistribution}
                value={startDistributionSlider}
                startLabel={startDistributionStartLabel}
                endLabel={startDistributionEndLabel}
              />
            </Grid>
          </React.Fragment>
        );
      case 'Preventable Overtime due to Block Start Gap':
        return (
          <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <h4 style={{ marginBottom: '32px' }}>
                { tile?.title }
                <LightTooltip placement="top" fontSize="small" interactive arrow title={tile?.toolTip?.toString()}>
                  <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${tile?.toolTip?.toString()}`} />
                </LightTooltip>
              </h4>
            </div>
            <div className="overtime-rows">
              <div className="overtime-block-number">{tile?.value?.sum}
                <sub>min</sub>
              </div>
              <div className="overtime-helper" style={{ flex: '1 0 20%' }}>
                in total
              </div>
              <div className="overtime-block-number">{tile?.value?.by_block}
                <sub>min</sub>
              </div>
              <div className="overtime-helper">
                Average per Block
              </div>
            </div>
          </React.Fragment>
        );
    }
  };

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

  const formatDonutData = (data) => Object.entries(data).reduce((acc, [key, val], i) => acc.concat({
    name: key,
    value: val,
    color: DONUT_COLOURS[i - 1] 
  }), []);

  const formatLineData = (dataset) => {
    return dataset?.map((percentage, idx) => {
        return {
          date: moment(trendStartDate).add(idx, 'days').format('MMM'),
          id: Math.floor(Math.random() * 10000),
          percentage
      }
    });
  };

  const toggleInformationModal = React.useCallback(() => {
    dispatch({ type: 'TOGGLE_INFORMATION_MODAL', payload: !state.informationModalOpen });
  }, [state.informationModalOpen]);

  const filterTrend = React.useCallback((_, val) => {
    const [first, second] = trendSlider;
    if (val[1] - val[0] <= 5) {
      return;
    }
    if (val[0]) {
      if (val[0] > first) {
        setTrendStartDate((prev) => moment(prev).subtract(1, "days"));
      } else if (val[0] < first) {
        setTrendStartDate((prev) => moment(prev).add(1, "days"));
      }
    }
    if (val[1]) {
      if (val[1] > second) {
        setTrendEndDate((prev) => moment(prev).add(1, "days"));
      } else if (val[1] < second) {
        setTrendEndDate((prev) => moment(prev).subtract(1, "days"));
      }
    }
    setTrendSlider(val);
  }, [trendSlider]);

  const filterStartDistribution = React.useCallback((e, val) => {
    const [first, second] = startDistributionSlider;
    if (val[1] - val[0] <= 5) {
      return;
    }
    if (val[0]) {
      if (val[0] > first) {
        setStartDistributionStartLabel(prev => prev - 1);
        // setTrendStartDate((prev) => moment(prev).subtract(1, "days"));
      } else if (val[0] < first) {
        setStartDistributionStartLabel(prev => prev + 1);
        // setTrendStartDate((prev) => moment(prev).add(1, "days"));
      }
    }
    if (val[1]) {
      if (val[1] > second) {
        setStartDistributionEndLabel(prev => prev + 1);
        // setTrendEndDate((prev) => moment(prev).add(1, "days"));
      } else if (val[1] < second) {
        setStartDistributionEndLabel(prev => prev - 1);
        // setTrendEndDate((prev) => moment(prev).subtract(1, "days"));
      }
    }
    setStartDistributionSlider(val);
  }, [startDistributionSlider]);

  const filterEndDistribution = React.useCallback((e, val) => {
    setEndDistributionSlider(val);
  }, []);

  // const fetchNewDataset = () => {
  //   setReload(true);
  // };

  const toggleChartData = (e) => {
    setChartData(e.target.value);
    setFilteredChartData(e.target.value.includes('7') ? 'week_trend' : 'month_trend');
  };

  const transformRoomData = (room, momentum, percentage, cb) => {
    const transformed = room?.map((or, i) => ({
      id: Math.floor(Math.random() * 25000),
      or,
      change: momentum[i],
      percent: percentage[i]
    }));
    return cb(transformed);
  };

  const applyGlobalFilter = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const requestPayload = {
        startDate: state.startDate.format('YYYY-MM-DD'),
        endDate: state.endDate.format('YYYY-MM-DD'),
        facilityName: userFacility,
        roomNames: rooms,
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

  const selectOrs = React.useCallback((_, value, reason) => {
    setRooms(value.map(({ id }) => id));
    setOrFilterVal(value);
  }, []);

  const clearFilters = () => {
    setRooms([]);
    setOrFilterVal([]);
  }

  return (
    <div className="page-container">
      <Header onClick={toggleInformationModal}>
        <Grid container spacing={3} style={{ margin: '14px 0px 16px 0px' }}>
          <Grid item xs={2} style={{ paddingLeft: '0px' }}>
            <MultiSelectFilter
              id="date"
              onChange={()=>{}}
              options={[]}
              placeholder="All Time"
            />
          </Grid>
          <Grid item xs={2}>
            <MultiSelectFilter
              id="OR"
              onChange={selectOrs}
              options={filters?.ors}
              placeholder="All ORs"
              value={orFilterVal}
            />
          </Grid>
          <Grid item xs={1} style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 1 }}>
            <button onClick={applyGlobalFilter} className="button primary">Apply</button>
          </Grid>
          <Grid item xs={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={clearFilters} className="button clear-btn">Clear Filters</button>
          </Grid>
        </Grid>
      </Header>
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={12} className="efficiency-dashboard-header">
          <h3 style={{ fontWeight: 'normal', color: '#000' }}>Block Utilization</h3>
        </Grid>
        <Grid item xs={3}>
          <Card style={{ height: '365px' }}>
            <CardContent>
              {getTile('Block Utilization')}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card style={{ height: '365px' }}>
            <CardContent>
              {getTile('Overtime')}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={{ height: '365px' }}>
            <CardContent>
              {getTile('Trend')}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={6}>
          <Card>
            <CardContent>
              {getTile('Room')}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              {getTile('composition')}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={6}>
          <Card>
            <CardContent>
              {getTile('block start')}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              {getTile('block end')}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <InformationModal open={state.informationModalOpen} onToggle={toggleInformationModal} />
    </div>
  );
};

export default BlockUtilization;
