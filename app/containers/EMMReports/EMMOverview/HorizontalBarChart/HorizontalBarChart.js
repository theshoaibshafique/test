import React from 'react';
import { Grid, withStyles, Tooltip } from '@material-ui/core';
import C3Chart from 'react-c3js';
import './style.scss';

export default class HorizontalBarChart extends React.PureComponent {
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
            show: true
          },
          colors: {
            y: (d) => this.chooseColour(d)
          },
        }, // End data
        bar: {
          width: 24
        },
        axis: {
          rotated: true,
          x: {
            show: true,
            type: 'category'
          },
          y: {
            show: false
          }
        },
        grid: {
          y: {
            show: true
          }
        },
        tooltip: {
          show: false
        },
        legend: {
          show: false
        },
        size: {
          height: 258,
          width: 300
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
    let { dataPoints } = this.props;
    if (!dataPoints) {
      return;
    }

    let formattedData = { x: ['x'], y: ['y'] };
    let colours = [];
    dataPoints.map((point, index) => {
      formattedData.x.push(point.valueX);
      colours.push(point.note)
      formattedData.y.push(parseInt(point.valueY));
    });
    let chartData = this.state.chartData;
    chartData.data.columns = [formattedData.x, formattedData.y];
    let chart = this.chartRef.current && this.chartRef.current.chart;
    chart && chart.load(chartData);

    this.setState({ chartData, colours, isLoaded: true })
  }

  chooseColour(d) {
    return this.state.colours[d.x - 1] || '#6EDE95';
  }

  render() {
    return (
      <Grid container spacing={1} className="Horizontal-BarChart" direction="column">
        <Grid item xs style={{textAlign:'center'}}>
          {this.props.title}
        </Grid>
        <Grid item xs>
          {this.state.isLoaded && <C3Chart className={this.state.chartID} ref={this.chartRef} {...this.state.chartData} />}
        </Grid>
      </Grid>
    );
  }
}