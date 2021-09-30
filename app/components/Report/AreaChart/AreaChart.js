/*
  DEPRECATED
  A Line chart with a gradient underneath and numbers above the points
*/

import React from 'react';
import { Grid } from '@material-ui/core';
import C3Chart from 'react-c3js';
import './style.scss';
import moment from 'moment/moment';
import LoadingOverlay from 'react-loading-overlay';

export default class AreaChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();

    this.state = {
      chartID: 'areaChartDetailed',
      chartData: {
        data: {
          x: 'x',
          columns: [], //Dynamically populated
          type: 'area',
          labels: true
        }, // End data
        oninit: () => {
          const gradient = d3.select('.areaChartDetailed svg')
            .append("linearGradient")
            .attr('id', 'gradient')
            .attr('x1', '40%').attr('y1', '0%')
            .attr('x2', '50%').attr('y2', '100%');

          gradient
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#A7E5FD')
            .attr('stop-opacity', '1');

          gradient
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#ffffff')
            .attr('stop-opacity', '1');
        },
        color: {
          pattern: ['#004F6E', '#97E7B3', '#CFB9E4', '#004F6E']
        },
        tooltip: {
          show: false,
        },
        axis: {
          x: {
            label: {
              text: this.props.footer, //Dynamically populated
              position: 'outer-center'
            },
            type: 'category'
          },
          y: {
            label: {
              text: this.props.subTitle, //Dynamically populated
              position: 'outer-middle'
            },
            max: 110,
            min: 0,
            padding: { top: 0, bottom: 0 },
            tick: {
              format: function (d) { if (d % 20 == 0) return d }
            }
          }
        },
        grid: {
          lines: {
            front: false,
          },
          y: {
            lines: [
              { value: 20 },
              { value: 40 },
              { value: 60 },
              { value: 80 },
              { value: 100 },
            ]
          }
        },
        padding: { top: 8, bottom: 8 },
        legend: {
          show: false
        },
        size: {
          height: 225
        },
        point: {
          // show: false
        }
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
    let dataPoints = this.props.dataPoints.reverse();
    let legendData = {}
    let formattedData = { x: [] };
    dataPoints.map((point) => {
      let month = moment().month(parseInt(point.valueX) - 1).format('MMM');
      if (!formattedData.x.includes(month)) {
        formattedData.x.push(month);
      }
      formattedData[point.title] = formattedData[point.title] || [];
      formattedData[point.title].push(point.valueY == "-1" ? null : point.valueY);
      legendData[point.title] = point.subTitle;
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

    chartData.axis.x.label.text = this.props.footer;
    chartData.axis.y.label.text = this.props.subTitle;

    let chart = this.chartRef.current?.chart;
    chart?.load(chartData.data);
    //Load actual data for animation
    setTimeout(() => {
      chartData.data.columns = columns
      chart = this.chartRef.current?.chart;
      chart?.load(chartData.data);
      setTimeout(() => {
        chartData.data.columns = columns
        chart = this.chartRef.current?.chart;
        chart?.load(chartData.data);
      }, 500);
    }, 500);

    this.setState({ chartData, legendData, isLoaded: true })
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
        <Grid container spacing={0} justify='center' className="area-chart" style={{ textAlign: 'center' }}>
          <Grid item xs={12} className="chart-title normal-text">
            {this.props.title}
          </Grid>

          <Grid item xs={12}>
            {<C3Chart className={this.state.chartID} ref={this.chartRef} {...this.state.chartData} />}
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}