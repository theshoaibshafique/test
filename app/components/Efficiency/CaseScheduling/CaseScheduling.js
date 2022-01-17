import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Header from '../Header';
// import FooterText from '../FooterText';
import { makeSelectToken, makeSelectUserFacility } from '../../../containers/App/selectors';
import useSelectData from '../../../hooks/useSelectData';

const INITIAL_STATE = {
  tabIndex: 0,
  // startDate: moment().subtract(1, 'weeks').startOf('week'),
  // endDate: moment().subtract(1, 'weeks').endOf('week'),
  startDate: moment().subtract(8, 'months').startOf('month'),
  endDate: moment().subtract(1, 'months').endOf('month'),
  loading: false,
  defaultPayload: {
    roomNames: ['2E8291AE-26A8-47FC-AA05-9F4424EDD03F'],
  },
};

const reducer = (state, action) => {
  switch (action.type) {
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

const CaseScheduling = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const userToken = useSelector(makeSelectToken());
  const userFacility = useSelector(makeSelectUserFacility());
  const [tile, setTile] = React.useState('');
  const { data } = useSelectData(process.env.SCHEDULING_API, userToken, {
    ...state.defaultPayload,
    facilityName: userFacility,
    startDate: state.startDate.format('YYYY-MM-DD'),
    endDate: state.endDate.format('YYYY-MM-DD')
  }, axios.CancelToken.source());
  React.useEffect(() => {
    if (!data) return;
    dispatch({ type: 'SET_TILE_DATA', payload: { tiles: data.tiles } });
  }, [data]);

  React.useEffect(() => {
    if (!state.tiles) return;
  }, [state.tiles]);
  return (
    <div className="page-container">
      <Header></Header>
      <Grid container className="efficiency-container">
        <Grid item xs={6} style={{ paddingRight: '0px' }}>
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={6} style={{ paddingRight: '0px' }}>
              <Card>
                <CardContent>
                                      Under-schedule percentage
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} style={{ paddingRight: '0px' }}>
              <Card>
                <CardContent>
                                      Preventable OT Minutes Due to Late First Case
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  Under-Schedule Trend
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  Change in Delays
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                                      Procedure Type List
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
export default CaseScheduling;
