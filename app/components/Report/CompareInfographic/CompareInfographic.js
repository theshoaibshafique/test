import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import './style.scss';
import { LightTooltip } from '../../SharedComponents/SharedComponents';

export default class CompareInfographic extends React.PureComponent {
  constructor(props) {
    super(props);
  };

  renderData() {
    const { dataPoints } = this.props;
    return (
      dataPoints && dataPoints.map((point,index) => (
        <Grid item xs key={index}>
          <div className="score">
            {point.valueX}
          </div>
          <div className="subtitle subtle-text">
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
        <Grid item xs={12} className="title normal-text">
          {title}{this.props.toolTip && <LightTooltip interactive arrow title={Array.isArray(this.props.toolTip) ? this.props.toolTip.map((line,index) => { return <div key={index}>{line}</div> }) : this.props.toolTip} placement="top" fontSize="small">
            <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} className="log-mouseover" id={`info-tooltip-${title}`}/>
          </LightTooltip>}
        </Grid>
        {this.renderData()}
      </Grid>
    );
  }
}