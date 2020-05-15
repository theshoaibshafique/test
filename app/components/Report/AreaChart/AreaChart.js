import React from 'react';
import { Grid } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import moment from 'moment';

export default class AreaChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chartID: 'areaChartDetailed',
      chartData: {
        data: {
          x: 'x',
          columns: [], //Dynamically populated
          type: 'area-spline',
          labels:true
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
            type: 'category',
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
              // count: 5,
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
              {value:20},
              {value:40},
              {value:60},
              {value:80},
              {value:100},
            ]
          }
        },
        padding: { top: 8, bottom: 8 },
        legend: {
          show: false
        },
        size: {
          height: 200
        },
        point: {
          // show: false
        }
      }
    }

  };

  componentDidMount() {
    this.generateChartData();
  }

  generateChartData() {
    if (!this.props.dataPoints) {
      return;
    }
    let dataPoints = this.props.dataPoints.sort((a, b) => { return a.valueX - b.valueX });
    let legendData = {}
    let formattedData = { x: [] };
    dataPoints.map((point) => {
      let month = moment().month(parseInt(point.valueX) - 1).format('MMM');
      if (!formattedData.x.includes(month)) {
        formattedData.x.push(month);
      }
      formattedData[point.title] = formattedData[point.title] || [];
      formattedData[point.title].push(point.valueY);
      legendData[point.title] = point.subTitle;
    });
    let columns = [];
    Object.entries(formattedData).map(([key, value]) => {
      columns.push([key, ...value]);
    })
    let chartData = this.state.chartData;
    chartData.data.columns = columns;
    this.setState({ chartData, legendData, isLoaded: true })
  }

  render() {
    return (
      <Grid container spacing={0} justify='center' className="area-chart" style={{ textAlign: 'center' }}>
        <Grid item xs={12} className="chart-title">
          {this.props.title}
        </Grid>

        <Grid item xs={12}>
          {<C3Chart className={this.state.chartID} {...this.state.chartData} />}
        </Grid>

      </Grid>
    );
  }
}