import React from 'react';
import './style.scss';
import { Grid, Paper } from '@material-ui/core';

export default class EMMOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

  }
  componentDidMount() {

  }
  render() {
    return (
      <div className="Emm-Reports-Overview">
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">xs=12</Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">
                  CASE INFORMATION
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Paper className="Emm-Paper">xs=12</Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className="Emm-Paper">xs=12</Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">SSC</Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">Phases Of Interest</Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}