import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import './style.scss';
import LoadingOverlay from 'react-loading-overlay';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);

export default class CompareInfographic extends React.PureComponent {
  constructor(props) {
    super(props);
  };

  renderData() {
    const { dataPoints } = this.props;
    return (
      dataPoints && dataPoints.map((point) => (
        <Grid item xs>
          <div className="score">
            {point.valueX}
          </div>
          <div className="subtitle">
            {point.title}
          </div>
        </Grid>
      ))
    )
  }

  render() {
    const { title } = this.props;
    return (
      <Grid container spacing={0} className="compare-infographic">
        <Grid item xs={12} className="title">
          {title}
        </Grid>
        {this.renderData()}
      </Grid>
    );
  }
}