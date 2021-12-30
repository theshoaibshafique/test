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
import Header from '../Header';

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
const TurnoverTime = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const [reload, setReload] = React.useState(false);
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());

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
          threshold: 3600
        };
        const retrieveTileData = request('post');
        const data = await retrieveTileData(process.env.TURNOVER_API, userToken, requestData, axios.CancelToken.source());
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

  const toggleInformationModal = React.useCallback(() => {
    dispatch({ type: 'TOGGLE_INFORMATION_MODAL', payload: !state.informationModalOpen });
  }, [state.informationModalOpen]);

  const getTile = (name, cb) => {
    const tile = state?.tiles?.find(({ title }) => title?.toLowerCase().includes(name.toLowerCase()));
    return cb(tile);
  };

  return (
    <div className="page-container">
      <Header onClick={toggleInformationModal}>
      </Header>
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={12} className="efficiency-dashboard-header" spacing={0}>
          <h3>Turnover Time</h3>
        </Grid>
        <Grid item xs={3}>
          <Card style={{ height: '365px' }}>
            <CardContent>
              {getTile('time', (tile) => (
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
                    <sup className="superscript-text">min</sup>
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
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card style={{ height: '365px' }}>
            <CardContent>
              {getTile('ot', (tile) => (
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
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              {getTile('Trend', (tile) => (
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
                    {/* <RadioButtonGroup value={chartData} onChange={toggleChartData} options={options} /> */}
                  </div>
                  {/* {!!tile && <LineGraph data={formatLineData(tile?.data[filteredChartData])} />} */}
                  <Grid item xs={12}>
                    {/* <RangeSlider
                      id="trend"
                      min={0}
                      max={dateDiff.trend}
                      onChange={filterTrend}
                      value={trendSlider}
                      startLabel={moment(trendDate.end).format('MMM D YYYY')}
                      endLabel={moment(trendDate.start).format('MMM D YYYY')}
                      onChangeCommitted={fetchNewDataset}
                    /> */}
                  </Grid>
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={6}>
          <Card>
            <CardContent>
                      Turnover Time By OR
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
                      Turnover Duration Distribution
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default TurnoverTime;
