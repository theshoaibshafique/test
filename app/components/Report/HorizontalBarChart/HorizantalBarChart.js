import React from 'react';
import { Grid, withStyles, LinearProgress } from '@material-ui/core';
import StarsIcon from '@material-ui/icons/Stars';

import './style.scss';

const BorderLinearProgress = withStyles({
  root: {
    height: 32,
    backgroundColor: 'white',
  },
  bar: {
    backgroundColor: '#FFDB8C',
  },
})(LinearProgress);

export default class HorizontalBarChart extends React.PureComponent {
  constructor(props) {
    super(props);
  };


  render() {
    return (
      <Grid container spacing={0} justify='center' style={{ textAlign: 'center' }}>
        <Grid item xs={12}>
          <StarsIcon style={{ color: '#FFB71B',fontSize:26, marginBottom:8 }} /> <span className="chart-title">Top 3 Specialties</span>
        </Grid>
        <Grid item xs={12} className="chart-subtitle">
          by Average Score
        </Grid>
        <Grid item xs={6}>
          General Surgery
        </Grid>
        <Grid item xs={6} className="chart-score">
          89%
        </Grid>
        <Grid item xs={12}>
          <BorderLinearProgress
            variant="determinate"
            value={89}
          />
        </Grid>

      </Grid>
    );
  }
}