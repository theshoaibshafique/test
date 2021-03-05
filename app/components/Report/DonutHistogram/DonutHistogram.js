import React from 'react';
import { Grid, Tooltip, withStyles, Divider } from '@material-ui/core';
import './style.scss';
import DonutChart from './DonutChart/DonutChart';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Histogram from './Histogram/Histogram';
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);

const colors = {
  'other': '#F3F3F3',
  "Timeout Engagement": "#97E7B3",
  "Debriefing Engagement": '#FFDB8C',
  "Briefing Engagement": '#A7E5FD'
};
export default class DonutHistogram extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dataPoints } = this.props;
    this.state = {
      chartID: this.props.chartID || 'DonutHistogramChart',
    }
  };

  componentDidMount() {

  }

  componentDidUpdate() {

  }


  renderDonuts() {
    const { title, dataPoints } = this.props;
    if (!dataPoints) {
      return "";
    }
    return (
      <Grid item xs={12}>
        <Grid container spacing={0} justify="center">
          {dataPoints.map((point, index) => (
            <Grid item xs={4} key={index} >
              <DonutChart {...point} chartRef={this.state.chartRefs[index]} chartTitle={title} colors={colors} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }


  render() {
    const { title, dataPoints, toolTip } = this.props;
    return (
      <Grid container spacing={0} className="donut-histogram-chart">
        <Grid item xs={12} className="title">{title}{toolTip && <LightTooltip interactive arrow title={Array.isArray(toolTip) ? toolTip.map((line) => { return <div>{line}</div> }) : toolTip} placement="top" fontSize="small">
          <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
        </LightTooltip>}</Grid>

        <Grid item xs={4}>
          <DonutChart {...this.props} colors={colors} />
        </Grid>
        <Grid item xs={8}>
          <Histogram {...this.props} colors={colors[title]} />
        </Grid>
      </Grid>
    );
  }
}