import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import LoadingIndicator from '../LoadingIndicator';
import MonthRangePicker from '../MonthRangePicker/MonthRangePicker';
import { StyledTab, StyledTabs, TabPanel } from '../SharedComponents/SharedComponents';
import { request } from '../../utils/global-functions';
import Header from './Header';
import InformationModal from './InformationModal';
import Donut from '../Charts/Donut';
import { makeSelectToken, makeSelectUserFacility } from '../../containers/App/selectors';
import useLocalStorage from '../../hooks/useLocalStorage';
import './styles.scss';

const INITIAL_STATE = {
  tabIndex: 0,
  informationModalOpen: false,
  startDate: moment().subtract(1, 'month').startOf('month'),
  endDate: moment().subtract(1, 'month').endOf('month'),
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
        tiles: action.payload.tiles,
        globalTiles: action.payload.globalTiles
      };
    default:
      return state;
  }
};

const Efficiency = () => {
  const [state, localDispatch] = React.useReducer(reducer, INITIAL_STATE);
  const { setItemInStore } = useLocalStorage();
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  React.useEffect(() => {
    const fetchTileData = async () => {
      localDispatch({ type: 'SET_LOADING', payload: true });
      try {
        // const requestData = {
        //   dashboardName: 'efficiency',
        //   facilityName: userFacility,
        //   startDate: state.startDate.format('YYYY-MM-DD'),
        //   endDate: state.endDate.format('YYYY-MM-DD'),
        //   roomName: null,
        //   specialtyName: null,
        //   procedureName: '',
        //   threshold: null
        // };
        const retrieveConfiguration = request('get');
        // const retrieveTileData = request('post');
        const configData = await retrieveConfiguration(`${process.env.EFFICIENCY_API}/config?facility_id=${userFacility}`, userToken, null, axios.CancelToken.source());
        if (configData) {
          setItemInStore('efficiencyV2', {
            efficiency: configData
          });
          // dispatch({ type: 'SET_FILTERS', payload: { ors: configData.filters.ORs, specialties: configData.filters.Specialties } });
        }

        // const data = await retrieveTileData(process.env.EFFICIENCYTILE_API, userToken, requestData, axios.CancelToken.source());
        // if (data?.tiles?.length) {
        //   localDispatch({ type: 'SET_TILE_DATA', payload: { tiles: data.tiles, globalTiles: data.globalTiles } });
        // }
        localDispatch({ type: 'SET_LOADING', payload: false });
      } catch (err) {
        localDispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    fetchTileData();
  }, []);

  const toggleInformationModal = React.useCallback(() => {
    localDispatch({ type: 'TOGGLE_INFORMATION_MODAL', payload: !state.informationModalOpen });
  }, [state.informationModalOpen]);

  return (
    <div className="page-container">
      <Header onClick={toggleInformationModal}>
        <MonthRangePicker
          startDate={state.startDate}
          endDate={state.endDate}
          customArrowIcon={<span style={{ color: '#828282' }}>to</span>}
        />
      </Header>
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
            Headlines
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
      <InformationModal open={state.informationModalOpen} onToggle={toggleInformationModal} />
    </div>
  );
};

export default Efficiency;
