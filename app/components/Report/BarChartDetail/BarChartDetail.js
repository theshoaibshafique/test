import React from 'react';
import { Grid } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import moment from 'moment';

export default class BarChartDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chartID: 'barChartDetail',
      chartData: {
        data: {
          x: 'x',
          columns: [], //Dynamically populated
          type: 'bar',
          types: {
            'Average': 'line'
          },
        }, // End data
        color: {
          pattern: ['#A7E5FD', '#97E7B3', '#CFB9E4', '#004F6E']
        },
        bar: {
          width: 30,
          space: .2
        },
        tooltip: {
          grouped: false,
          contents: (d, defaultTitleFormat, defaultValueFormat, color) => this.createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color)
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
            max: 100,
            min: 0,
            padding: { top: 0, bottom: 0 },
            tick: {
              count: 6
            }
          }
        },
        padding: { top: 0, bottom: 8 },
        legend: {
          show: false
        },
        onrendered: () => this.createCustomLegend(`.${this.state.chartID}`),
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
    this.setState({ chartData, legendData,xLabels:formattedData.x, isLoaded: true })
  }

  redirect(redirectURL) {
    this.props.pushUrl(redirectURL);
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    return ReactDOMServer.renderToString(<div className="MuiTooltip-tooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>{`${d[0].value}% ${this.state.xLabels[d[0].x]}`}</div>);
  }

  createCustomLegend(chartClass) {
    if (!this.refs.myChart || !d3.select(chartClass).select('.legend').empty()) {
      return;
    }
    let chart = this.refs.myChart.chart;
    d3.select(chartClass).insert('div').attr('class', 'legend')
      .html(ReactDOMServer.renderToString(
        <div className="bar-chart-detailed-legend">
          {Object.entries(this.state.legendData).map(([id, value], index) => {

            return id == 'Average'
              ?
              (<div className="legend-title" key={index}>
                <span className="line" style={{ color: chart.color(id) }} /><div style={{ margin: '-5px 0px 0px 4px' }}> {id}</div>
              </div>)
              :
              (<div key={index}>
                <div className="legend-title">
                  <span className="circle" style={{ color: chart.color(id) }} /><div style={{ margin: '-4px 0px 0px 4px' }}> {id}</div>
                </div>
                <div className={`link ${value.substring(1)}`} >
                  <a>Learn More</a>
                </div>
              </div>)
          })}
        </div>
      )).each((x) => {
        //Standard Onclicks dont work when you use renderToString on Graph
        Object.entries(this.state.legendData).map(([id, value], index) => {
          if (!value) { return };
          d3.select(`.${value.substring(1)}`)
            .on('click', (y)=> {
              this.redirect(value);
            });
        })
      });

  }



  render() {
    return (
      <Grid container spacing={0} justify='center' className="bar-chart-detailed" style={{ textAlign: 'center', marginBottom: 40 }}>
        <Grid item xs={12}>
          <span className="chart-title">{this.props.title}</span>
        </Grid>

        <Grid item xs={12}>
          {this.state.isLoaded && <C3Chart className={this.state.chartID} ref="myChart" {...this.state.chartData} />}
        </Grid>

      </Grid>
    );
  }
}