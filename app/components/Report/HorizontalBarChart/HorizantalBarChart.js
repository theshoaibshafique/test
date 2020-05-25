import React from 'react';
import { Grid, withStyles, LinearProgress } from '@material-ui/core';
import StarsIcon from '@material-ui/icons/Stars';

import './style.scss';
import LoadingOverlay from 'react-loading-overlay';

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

  getName(searchList, key) {
    let index = searchList.findIndex(item => item.value.toLowerCase() == key.toLowerCase());
    if (index >= 0) {
      return searchList[index].name;
    }
  }


  render() {
    return (
      <LoadingOverlay
        active={!this.props.dataPoints}
        spinner
        // text='Loading your content...'
        className="overlays"
        styles={{
          overlay: (base) => ({
            ...base,
            background: 'none',
            color: '#000'
          }),
          spinner: (base) => ({
            ...base,
            '& svg circle': {
              stroke: 'rgba(0, 0, 0, 0.5)'
            }
          })
        }}
      >
      <Grid container spacing={0} justify='center' className="horizontal-chart" style={{ marginBottom: 34,minHeight:320 }}>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <StarsIcon style={{ color: '#FFB71B', fontSize: 26, marginBottom: 8 }} />
          <span className="chart-title">{this.props.title}</span>
        </Grid>
        <Grid item xs={12} className="chart-subtitle" style={{ textAlign: 'center', marginBottom: 40 }}>
          {this.props.subTitle}
        </Grid>
        {this.props.dataPoints && this.props.dataPoints.map((point) => {
          return (
            <Grid container justify='center' key={point.title}>
              <Grid item xs={8}>
                {this.getName(this.props.specialties, point.title || "")}
              </Grid>
              <Grid item xs={4} className="chart-score">
                {point.valueX}
              </Grid>
              <Grid item xs={12} style={{ marginBottom: 40 }}>
                <BorderLinearProgress
                  variant="determinate"
                  value={parseInt(point.valueX)}
                />
              </Grid>
            </Grid>)
        })}
      </Grid>
      </LoadingOverlay >
    );
  }
}