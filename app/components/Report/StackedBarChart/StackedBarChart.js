import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import moment from 'moment/moment';
import globalFunctions from '../../../utils/global-functions';
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);

export default class StackedBarChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();

    this.state = {
      legendData: [],
      chartID: 'stackedBarChartDetailed',
      chartData: {
        data: {
          x: 'x',
          columns: [], //Dynamically populated
          type: 'bar',
          types: {
            'Total': 'line'
          },
          labels: {
            format: (v, id, i, j) => this.createCustomLabel(v, id, i, j)
          },
          order: 'asc'
        }, // End data
        color: {
          pattern: ['#A7E5FD', '#97E7B3', '#FFDB8C', '#FF7D7D', '#CFB9E4', '#50CBFB', '#6EDE95', '#FFC74D', '#FF4D4D', '#A77ECD']
        },
        bar: {
          width: { ratio: this.props.horizontalLegend ? .4 : .3, }
        },
        tooltip: {
          grouped: false,
          contents: (d, defaultTitleFormat, defaultValueFormat, color) => this.createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color)
        },
        axis: {
          x: {
            label: {
              text: this.props.xAxis, //Dynamically populated
              position: 'outer-center'
            },
            type: 'category',
          },
          y: {
            label: {
              text: this.props.yAxis, //Dynamically populated
              position: 'outer-middle',
            },
            tick: {
              format: function (d) {
                return (parseInt(d) == d) ? d : null;
              }
            },
            min: 0,
            padding: { top: 30, bottom: 0 },
          }
        },
        grid: {
          lines: {
            front: false,
          },
          y: {
            show: true
          }
        },
        padding: { top: 8, bottom: 8 },
        legend: {
          show: false
        },
        point: {
          show: false
        },
        size: this.props.horizontalLegend ? {
          height: 296,
        } : {},
        onrendered: () => this.chartRef.current && this.updateLegend(`.${this.state.chartID}`),
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
    let dataPoints = this.props.dataPoints//.sort((a, b) => { return a.valueX - b.valueX });

    let zData = [];
    let xData = [];
    let formattedData = {};
    let tooltipLegendData = {};
    let tooltipData = {};
    dataPoints.map((point) => {
      let xValue = point.valueX;
      if (parseInt(point.valueX) == point.valueX) {
        xValue = moment().month(parseInt(point.valueX) - 1).format('MMM');
      }
      if (!xData.includes(xValue)) {
        xData.push(xValue);
      }

      point.title = globalFunctions.getName(this.props.specialties, point.title);
      formattedData[point.title] = formattedData[point.title] || {};
      formattedData[point.title][xValue] = formattedData[point.title][xValue] || 0
      formattedData[point.title][xValue] = point.valueY;
      point.valueZ && zData.push(point.valueZ);
      tooltipLegendData[point.title] = point.note ? point.note : tooltipLegendData[point.title];
      tooltipData[point.title] = point.toolTip;
    });
    let columns = [['x', ...xData]];
    const orderBy = this.props.orderBy || {};
    let legendData = Object.entries(formattedData).sort((a, b) => { return orderBy[a[0]] - orderBy[b[0]] });
    legendData.map(([key, value]) => {
      columns.push([key, ...xData.map((x) => {
        return value[x] || "0";
      })]);
    })

    //Show Totals as a line graph (while hiding the line) so values always show on top
    columns.push(['Total', ...zData]);
    let chartData = this.state.chartData;
    //Set as 0 by default and "load" columns later for animation
    chartData.data.columns = columns.map((arr) => {
      return arr.map((x) => {
        return parseInt(x) == x ? 0 : x;
      })
    });
    chartData.axis.x.label.text = this.props.xAxis;
    chartData.axis.y.label.text = this.props.yAxis;
    if (columns.length <= 2) {
      chartData.bar.width = 80;
    }

    let chart = this.chartRef.current && this.chartRef.current.chart;
    chart && chart.load(chartData.data);
    chart && chart.groups([Object.keys(formattedData)]);
    //Load actual data for animation
    setTimeout(() => {
      chartData.data.columns = columns
      chart = this.chartRef.current && this.chartRef.current.chart;
      chart && chart.load(chartData.data);
      if (zData.length > 0) {
        setTimeout(() => {
          chart = this.chartRef.current && this.chartRef.current.chart;
          chartData.data.columns = columns
          chart && chart.load(chartData.data);
        }, 500);
      }

    }, 500);
    if (zData.reduce((a, b) => a + b, 0) <= 0) {
      d3.select('.stacked-barchart-detailed .c3-chart-texts').style('transform', 'translate(0, -30px)') // shift up labels
    }
    this.setState({ chartData, legendData, tooltipLegendData,tooltipData, zData, xData, isLoaded: true })
  }

  createCustomLabel(v, id, i, j) {
    if (id && id == "Total") {
      return v == null ? "N/A" : v;
    }
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    if (this.state.zData[d[0].x] == "N/A") {
      return;
    }
    let tooltipData = this.state.tooltipData && this.state.tooltipData[d[0].id] || []
    // debugger;
    if (tooltipData.length == 0) {
      let x = this.state.xData[d[0].x];
      return ReactDOMServer.renderToString(
        <div className="chartTooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>
          <div>{`${this.props.description ? this.props.description : ''}${d[0].id}`}</div>
          <div>{`${x}: ${d[0].value}${this.props.unit ? this.props.unit : ''}`}</div>
        </div>
      );
    } else {
      return ReactDOMServer.renderToString(
        <div className="chartTooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>
          {tooltipData.map((line) => {
            return <div>{line}</div>
          })}
        </div>);
    }

  }

  renderLegend() {
    if (!this.chartRef.current) {
      return;
    }
    let chart = this.chartRef.current.chart;
    return <div className={`${this.state.chartID}${this.props.horizontalLegend ? '-horizontal' : ''}`}>
      <div className="bar-chart-detailed-legend">
        {this.state.legendData.map(([id, value], index) => {
          if (id == "N/A") {
            return;
          }
          return (<div className="legend-item" id={id.replace(/[^A-Z0-9]+/ig, "")} key={index}>
            <div className="legend-title">
              <span className="circle" style={{ color: chart.color(id) }} /><div style={{ margin: '-4px 0px 0px 4px' }}> {id}</div>
              {this.state.tooltipLegendData[id] && <LightTooltip interactive arrow title={this.state.tooltipLegendData[id]} placement="top" fontSize="small">
                <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
              </LightTooltip>}
            </div>
          </div>)
        })}
      </div>
    </div>
  }

  updateLegend() {
    let chart = this.chartRef.current.chart;
    this.state.legendData.map(([id, value], index) => {
      d3.select(`.stacked-barchart-detailed #${id.replace(/[^A-Z0-9]+/ig, "")}`)
        .on('mouseover', () => {
          chart.focus(id);
        })
        .on('mouseout', () => {
          chart.revert();
        })
    })
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
        <Grid container spacing={0} justify='center' className="stacked-barchart-detailed" style={{ textAlign: 'center', minHeight: 320 }}>
          <Grid item xs={this.props.horizontalLegend ? 12 : 9} className="chart-title">
            {this.props.title}
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={this.props.horizontalLegend ? 12 : 8} >
            {<C3Chart ref={this.chartRef} {...this.state.chartData} />}
            {this.props.horizontalLegend && this.renderLegend()}
          </Grid>
          <Grid item xs={4} className={this.state.chartID}>
            {!this.props.horizontalLegend && this.renderLegend()}
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}