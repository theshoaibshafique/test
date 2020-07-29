import React from 'react';
import { Grid } from '@material-ui/core';
import C3Chart from 'react-c3js';
import './style.scss';
import moment from 'moment/moment';
import LoadingOverlay from 'react-loading-overlay';

export default class LineChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();

    this.state = {
      chartID: 'lineChartDetailed',
      chartData: {
        data: {
          x: 'x',
          columns: [], //Dynamically populated
          type: 'line',
          labels: false
        }, // End data
        color: {
          pattern: ['#004F6E', '#97E7B3', '#CFB9E4', '#004F6E']
        },
        tooltip: {
          show: false,
        },
        axis: {
          x: {
            show:false,
            type: 'category'
          },
          y: {
            show:false,
            max: 100,
            min: 0,
            padding: { top: 4, bottom: 4 },
          }
        },
        padding: { top: 0, bottom: 0 },
        legend: {
          show: false
        },
        size: {
          height: 50,
          width:200
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
    let dataPoints = this.props.dataPoints;
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

    let chart = this.chartRef.current && this.chartRef.current.chart;
    chart && chart.load(chartData.data);
    //Load actual data for animation
    setTimeout(() => {
      chartData.data.columns = columns
      chart = this.chartRef.current && this.chartRef.current.chart;
      chart && chart.load(chartData.data);
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
        <Grid container spacing={0} justify='center' className="line-chart" style={{ textAlign: 'center' }}>
          {/* <Grid item xs={12} className="chart-title">
            {this.props.title}
          </Grid> */}
          <Grid item xs={12}>
            {<C3Chart className={this.state.chartID} ref={this.chartRef} {...this.state.chartData} />}
          </Grid>
          <Grid item xs={12} className="chart-label">
            {this.props.xAxis}
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}