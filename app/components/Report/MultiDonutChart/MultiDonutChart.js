import React from 'react';
import { Grid } from '@material-ui/core';
import './style.scss';
import DonutChart from './DonutChart/DonutChart';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LightTooltip } from '../../SharedComponents/SharedComponents';

const colors = {
  'other': '#F3F3F3',
  "Incorrect Timing": "#FF7D7D",
  "Correct Timing": '#97E7B3',
  "Performed": '#A7E5FD'
};
export default class MultiDonutChart extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dataPoints } = this.props;
    this.state = {
      chartID: this.props.chartID || 'multiDonutChart',
      chartRefs: dataPoints.map(() => React.createRef())
    }
  };

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  renderLegend() {
    const { title, dataPoints } = this.props;
    if (!this.state.chartRefs.length || title == "Phase Completion") {
      return;
    }
    
    const legendData = [...new Set(dataPoints.map((point) => point.subTitle)), "Incorrect Timing"];
    return <div className={`${this.state.chartID} multi-donut-chart-detailed-legend`}>

      {legendData.map((id, index) => {
        const chart = this.state.chartRefs[0].current && this.state.chartRefs[0].current.chart;
        return (
          <div className="legend-item" id={id.replace(/[^A-Z0-9]+/ig, "")}
            onMouseOver={() => {
              this.state.chartRefs.map((chartRef) => {
                let chart = chartRef.current.chart;
                chart && chart.focus(id);
              })
            }}
            onMouseOut={() => {
              this.state.chartRefs.map((chartRef) => {
                let chart = chartRef.current.chart;
                chart && chart.revert();
              })
            }}
            key={index}>
            <div className="legend-title">
              <span className="circle" style={{ color: colors[id] }} /><div style={{ margin: '-4px 0px 0px 4px' }}> {id}</div>
            </div>
          </div>)
      })}

    </div>
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
              <DonutChart {...point} chartRef={this.state.chartRefs[index]} chartTitle={title} colors={colors}/>
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }


  render() {
    const { title, dataPoints,toolTip } = this.props;
    return (
      <Grid container spacing={0} className="multi-donut-chart">
        <Grid item xs={12} className="title">{title}{toolTip && <LightTooltip interactive arrow title={Array.isArray(toolTip) ? toolTip.map((line) => {return <div>{line}</div>}): toolTip} placement="top" fontSize="small">
              <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
            </LightTooltip>}</Grid>
        {this.renderDonuts()}
        <Grid item xs={12} className="multi-donut-chart-legend">
          {this.renderLegend()}
        </Grid>
      </Grid>
    );
  }
}