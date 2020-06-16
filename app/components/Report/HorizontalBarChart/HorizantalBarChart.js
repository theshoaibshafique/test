import React from 'react';
import { Grid, withStyles, LinearProgress, Tooltip } from '@material-ui/core';
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

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    fontSize: '14px',
    lineHeight: '19px',
    font: 'Noto Sans',
    maxWidth: 200
  }
}))(Tooltip);

export default class HorizontalBarChart extends React.PureComponent {
  constructor(props) {
    super(props);
  };

  getName(searchList, key) {
    let index = searchList.findIndex(item => item.value.toLowerCase() == key.toLowerCase());
    if (index >= 0) {
      return searchList[index].name;
    }
    return key;
  }

  renderTooltip(point) {

    return <Grid container spacing={0} >
      <Grid item xs={12}>
        {`Average Score: ${point.description}`}
      </Grid>
      <Grid item xs={12}>
        {point.valueX}
      </Grid>
      <Grid item xs={12}>
        {point.valueY}
      </Grid>
      <Grid item xs={12}>
        {point.valueZ}
      </Grid>
    </Grid>
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
        <div style={{ minHeight: 421 }}>
          <Grid container spacing={0} className="horizontal-chart" style={{ marginBottom: 34 }}>
            <Grid item xs={12} style={{ textAlign: 'center',whiteSpace:'nowrap' }}>
              <StarsIcon style={{ color: '#FFB71B', fontSize: 26, marginBottom: 8 }} />
              <span className="chart-title">{this.props.title}</span>
            </Grid>
            <Grid item xs={12} className="chart-subtitle" style={{ textAlign: 'center', marginBottom: 40 }}>
              {this.props.subTitle}
            </Grid>
            {this.props.dataPoints && this.props.dataPoints.map((point) => {
              return (
                <Grid container key={point.title}>
                  <Grid item xs={8}>
                    {this.getName(this.props.specialties, point.title || "")}
                  </Grid>
                  <Grid item xs={4} className="chart-score">
                    {point.description}
                  </Grid>
                  <Grid item xs={12} className="horizontal-bar" style={{ marginBottom: 40 }}>
                    <LightTooltip title={this.renderTooltip(point)} placement="top" fontSize="small">
                      <BorderLinearProgress
                        variant="determinate"
                        value={parseInt(point.description)}
                      />
                    </LightTooltip>
                  </Grid>
                </Grid>)
            })}
          </Grid>
          <div className="horizontal-footer">
            {this.props.footer}
          </div>
        </div>
      </LoadingOverlay >
    );
  }
}