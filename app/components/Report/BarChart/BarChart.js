import React from 'react';
import { Grid } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
import moment from 'moment/moment';
export default class BarChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    this.id = `bar-chart-${this.props.id}`;
    this.state = {
      chartID: 'barChart',
      chartData: {
        data: {
          x: 'x',
          columns: [], //Dynamically populated
          type: 'bar',
          labels: {
            format: (v, id, i, j) => this.createCustomLabel(v, id, i, j)
          }
        }, // End data
        zoom: {
          rescale: true
        },
        color: {
          pattern: this.props.pattern || ['#FF7D7D', '#FFDB8C', '#A7E5FD', '#97E7B3', '#CFB9E4', '#004F6E']
        },
        bar: {
          width: 40,
          space: .2
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
            height: this.props.id == 2 && this.props.reportType == "ComplianceScoreReport" ? 90 : 70
          },
          y: {
            label: {
              text: this.props.yAxis, //Dynamically populated
              position: 'outer-middle'
            },
            // max: 100,
            min: 0,
            padding: { top: 20, bottom: 0 },
            tick: {
              // format: function (d) { if (d % 20 == 0) return d }
            }
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
    let zData = [];
    let xData = [];
    let descData = [];
    let formattedData = { x: [] };
    let sum = 0
    dataPoints.map((point, index) => {
      let xValue = point.valueX;
      if (parseInt(point.valueX) == point.valueX) {
        xValue = moment().month(parseInt(point.valueX) - 1).format('MMM');
      }
      formattedData.x.push(xValue);
      formattedData[point.title] = formattedData[point.title] || [];
      formattedData[point.title].push(point.valueY);
      sum += parseInt(point.valueY);
      zData.push(point.valueZ);
      xData.push(xValue);
      descData.push(point.description);
    });
    let columns = [];
    Object.entries(formattedData).map(([key, value]) => {
      columns.push([key, ...value]);
    })
    let chartData = this.state.chartData;
    //Set as 0 by default and "load" columns later for animation
    chartData.data.columns = columns.map((arr) => {
      return arr.map((x) => {
        return parseInt(x) == x ? 0 : x;
      })
    });

    chartData.axis.x.label.text = this.props.xAxis;
    chartData.axis.y.label.text = this.props.yAxis;
    let chart = this.chartRef.current && this.chartRef.current.chart;
    chart && chart.load(chartData);
    //Load actual data for animation
    setTimeout(() => {
      chartData.data.columns = columns
      chart && chart.load(chartData.data);
      setTimeout(() => {
        chartData.data.columns = columns
        chart && chart.load(chartData.data);
      }, 500);
    }, 500);

    if (sum <= 0) {
      d3.select(`.${this.id} .c3-chart-texts`).style('transform', 'translate(0, -30px)') // shift up labels
    }
    this.setState({ chartData, zData, xData, descData, isLoaded: true })
  }

  createCustomLabel(v, id, i, j) {
    if (this.state.zData && this.state.zData[i] != null) {
      return `${this.state.zData[i]}`
    }
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    let x = this.state.xData[d[0].x];
    let z = this.state.zData[d[0].x];
    let desc = this.state.descData[d[0].x];
    if (z == "N/A") {
      return;
    }
    return ReactDOMServer.renderToString(
      <div className="MuiTooltip-tooltip tooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>
        <div>{`${x}${this.props.toolTip ? this.props.toolTip : ''}: ${d[0].value}${this.props.unit}`}</div>
        {z != null && <div>{`Occurence(s): ${z}`}</div>}
        {desc != null && <div>{`${desc}`}</div>}
      </div>);
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
        <Grid container spacing={0} direction="column" className={`bar-chart ${this.id}`} >
          <Grid item xs className="chart-title">
            {this.props.title}
          </Grid>
          <Grid item xs>
            {
              this.props.body && this.props.subTitle
                ? <div><div className="no-data">{this.props.body}</div> <div className="no-data-subtitle">{this.props.subTitle}</div></div>
                : this.props.body ?
                  <div className="display-text">{this.props.body}</div>
                  : <C3Chart className={this.state.chartID} ref={this.chartRef} {...this.state.chartData} />}
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}