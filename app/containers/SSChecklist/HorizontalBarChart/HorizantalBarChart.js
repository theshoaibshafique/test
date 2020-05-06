import React from 'react';
import { Grid, withStyles, LinearProgress } from '@material-ui/core';


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
            <Grid container spacing={0} justify='space-between' style={{ textAlign: 'justify' }}>
                <Grid item xs={6}>
                    General Surgery
                  </Grid>
                <Grid item xs={6}>
                    89
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