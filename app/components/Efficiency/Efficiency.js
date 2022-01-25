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
// import Donut from '../Charts/Donut';
import { makeSelectToken, makeSelectUserFacility } from '../../containers/App/selectors';
import { LightTooltip } from '../../components/SharedComponents/SharedComponents';
import useLocalStorage from '../../hooks/useLocalStorage';
import useSelectData from '../../hooks/useSelectData';
import useFilter from '../../hooks/useFilter';
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

const Efficiency = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const { setItemInStore } = useLocalStorage();
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const { rooms, defaultFilterConfig, defaultHandlerConfig } = useFilter();
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

    setTile({
      efficiency: efficiencyTile,
      headline: headlineTile,
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
        }

        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (err) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    fetchTileData();
  }, []);

  return (
    <div className="page-container">
      <Header
        config={{ ...defaultFilterConfig }}
        // applyGlobalFilter={applyGlobalFilter}
        handlers={{
          ...defaultHandlerConfig
        }}
      />
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
              Case on Time
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <div>Block Utilization</div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              Case Scheduling
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              Turnover Time
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={5} className="efficiency-container">
        <Grid item xs={6}>
          <Card>
            <CardContent>
            Total Overtime Minutes
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
            Case Count By Specialty

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Efficiency;
