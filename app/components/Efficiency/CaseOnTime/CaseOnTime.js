import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { request } from '../../../utils/global-functions';
import Header from '../Header';
import FooterText from '../FooterText';
import InformationModal from '../InformationModal';
import { makeSelectToken, makeSelectUserFacility, selectFilters } from '../../../containers/App/selectors';
import { LightTooltip } from '../../../components/SharedComponents/SharedComponents';
import MultiSelectFilter from '../../../components/SharedComponents/MultiSelectFilter';
import CustomDateRangePicker from '../../../components/SharedComponents/CustomDateRangePicker';

const INITIAL_STATE = {
  tabIndex: 0,
  informationModalOpen: false,
  // startDate: moment().subtract(7, 'days').startOf('week'),
  // endDate: moment().subtract(7, 'days').endOf('week'),
  startDate: moment().subtract(3, 'months').startOf('month'),
  endDate: moment().subtract(3, 'months').endOf('month'),
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

const CaseOnTime = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const [rooms, setRooms] = React.useState([]);
  const [orFilterVal, setOrFilterVal] = React.useState([]);
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
        };
        const retrieveTileData = request('post');
        const data = await retrieveTileData(process.env.ONTIMESTART_API, userToken, requestData, axios.CancelToken.source());
        if (data?.tiles?.length) {
          dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data.tiles } });
        }
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (err) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    fetchTileData();
  }, []);

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
  };

  const clearFilters = () => {
    setRooms([]);
    setOrFilterVal([]);
  };

  return (
    <div className="page-container">
      <Header>
        <Grid container spacing={3} style={{ margin: '14px 0px 16px 0px' }}>
          <Grid item xs={2} style={{ paddingLeft: '0px' }}>
            <CustomDateRangePicker
              label="Most Recent Week"
              startDate={state.startDate}
              endDate={state.endDate}
            />
          </Grid>
          <Grid item xs={2}>
            {/* <MultiSelectFilter
              id="OR"
              onChange={selectOrs}
              options={filters?.ors}
              placeholder="All ORs"
              value={orFilterVal}
          /> */}
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
        <Grid item xs={3} style={{ paddingRight: '0px' }}>
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={12} style={{ paddingRight: '0px' }}>
              <Card>
                <CardContent>
                                    Case On Time
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} style={{ paddingRight: '0px' }}>
              <Card>
                <CardContent>
                                    Preventable OT Minutes Due to Late First Case
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={3}>
          <Grid item xs={12}>
            <Card style={{ height: '600px' }}>
              <CardContent>
                        Case On Time Percentage
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                                    Case On Time Start Trend
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                                    Case Delay Distribution
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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

export default CaseOnTime;
