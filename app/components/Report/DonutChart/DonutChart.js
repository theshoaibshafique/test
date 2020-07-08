import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
import moment from 'moment/moment';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);
export default class DonutChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    this.id = `bar-chart-${this.props.id}`;
    this.state = {
      chartID: 'barChart',
      chartData: {
        data: {
          columns: [], //Dynamically populated
          type: 'donut',
          // labels: {
          //   format: (v, id, i, j) => this.createCustomLabel(v, id, i, j)
          // }
        }, // End data
        color: {
          pattern: this.props.pattern || ['#A7E5FD', '#97E7B3', '#FFDB8C', '#FF7D7D', '#CFB9E4', '#50CBFB', '#6EDE95', '#FFC74D', '#FF4D4D', '#A77ECD']
        },

        tooltip: {
          grouped: false,
          contents: (d, defaultTitleFormat, defaultValueFormat, color) => this.createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color)
        },

        padding: { top: 8, bottom: 8 },
        legend: {
          show: false
        },
        donut: {
          label: {
            show: false,
          },
          width: 48,
          title: this.props.subTitle
        },
        size: {
          height:384,
          width: 320
      },
        onrendered: () => this.chartRef.current && this.renderCustomTitle(),
      }
    }

  };

  componentDidUpdate(prevProps) {
    if (!prevProps.dataPoints && this.props.dataPoints) {
      this.generateChartData();
    }
  }

  componentDidMount() {
    this.generateChartData();
  }

  generateChartData() {
    if (!this.props.dataPoints) {
      return;
    }
    let dataPoints = this.props.dataPoints.sort((a, b) => { return a.valueX - b.valueX });
    let xData = [];
    let tooltipData = {};
    let formattedData = {};
    let legendData = {};

    dataPoints.map((point, index) => {
      let xValue = point.valueX;
      // formattedData.x.push(xValue);
      formattedData[point.title] = formattedData[point.title] || [];
      formattedData[point.title].push(point.valueX);
      xData.push(xValue);
      legendData[point.title] = point.subTitle;
      tooltipData[point.title] = point.note ? point.note : tooltipData[point.title];
    });
    let columns = [];
    Object.entries(formattedData).map(([key, value]) => {
      columns.push([key, ...value]);
    })
    let chartData = this.state.chartData;
    chartData.data.columns = columns;

    let chart = this.chartRef.current && this.chartRef.current.chart;
    chart && chart.load(chartData);
    this.setState({ chartData, xData, tooltipData, legendData, isLoaded: true })
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {

    return ReactDOMServer.renderToString(
      <div className="MuiTooltip-tooltip tooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>
        <div>{`Avg. ${d[0].id}: ${d[0].value}`}</div>
      </div>);
  }
  renderLegend() {
    if (!this.chartRef.current) {
      return;
    }
    let chart = this.chartRef.current.chart;
    return <div className={this.state.chartID}>
      <div className="donut-chart-detailed-legend">
        {Object.entries(this.state.legendData).map(([id, value], index) => {
          return (<div className="legend-item" key={index}>
            <div className="legend-title">
              <span className="circle" style={{ color: chart.color(id) }} /><div style={{ margin: '-4px 0px 0px 4px' }}> {id}</div>
              {this.state.tooltipData[id] && <LightTooltip interactive arrow title={this.state.tooltipData[id]} placement="top" fontSize="small">
                <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
              </LightTooltip>}
            </div>
          </div>)
        })}
      </div>
    </div>
  }
  renderCustomTitle() {
    if (!this.chartRef.current || !d3.select(".c3-chart-arcs-title").select('tspan').empty()) {
      return;
    }
    d3.select(".c3-chart-arcs-title")
      .attr("dy", -10)
    d3.select(".c3-chart-arcs-title").attr('class', 'donut-title')
      .insert("tspan")
      .html(ReactDOMServer.renderToString(<tspan dy={44} x={0} className="second-title">{this.props.total}<tspan className="donut-unit">{this.props.unit}</tspan></tspan>))
    // d3.select(".c3-chart-arcs-title").attr('class', 'c3-chart-arcs-title donut-title')
    //   .append("tspan")
    //   .attr("dy", 16)
    //   .attr("x", 0)
    //   .attr("class", "second-title")
    //   .text("Second title");
  }
  render() {
    return (
      <LoadingOverlay
        active={!this.props.dataPoints}
        spinner
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
        <Grid container spacing={0} className={`donut-chart ${this.id}`} style={{ minHeight: 150 }}>
          <Grid item xs={12} className="chart-title">
            {this.props.title}{this.props.toolTip && <LightTooltip interactive arrow title={this.props.toolTip} placement="top" fontSize="small">
              <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
            </LightTooltip>}
          </Grid>
          <Grid item xs={8} >
            <C3Chart ref={this.chartRef} {...this.state.chartData} />
          </Grid>
          <Grid item xs={4} className={this.state.chartID}>
            {this.renderLegend()}
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}