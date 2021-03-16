/*
  DEPRECATED
  Was used for the original SSC Overview pages
  Multi bar chart
  Horizontal bottom legend with clickable links
  line chart for average of bars
*/
import React from 'react';
import { Grid } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import moment from 'moment/moment';
import LoadingOverlay from 'react-loading-overlay';

export default class BarChartDetailed extends React.PureComponent {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();

    this.state = {
      chartID: 'barChartDetailed',
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
          pattern: ['#A7E5FD', '#97E7B3', '#CFB9E4', '#004F6E', '#FFDB8C', '#FF7D7D', '#50CBFB', '#6EDE95', '#FFC74D', '#FF4D4D', '#A77ECD']
        },
        bar: {
          width: 25,
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
              position: 'outer-middle',
            },
            // max: 110,
            width: 30,
            min: 0,
            padding: { top: 30, bottom: 0 },
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
        onrendered: () => this.state.legendData && this.createCustomLegend(`.${this.state.chartID}`),
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
    let dataPoints = this.props.dataPoints.reverse()//.sort((a, b) => { return a.valueX - b.valueX });
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
    columns.sort((a, b) => { return ('' + a[0]).localeCompare(b[0]) });
    let chartData = this.state.chartData;
    //Set as 0 by default and "load" columns later for animation
    chartData.data.columns = columns.map((arr) => {
      return arr.map((x) => {
        return parseInt(x) == x ? 0 : x;
      })
    });
    chartData.axis.x.label.text = this.props.footer;
    chartData.axis.y.label.text = this.props.subTitle;

    let chart = this.chartRef.current && this.chartRef.current.chart;
    chart && chart.load(chartData.data);
    //Load actual data for animation
    setTimeout(() => {
      chartData.data.columns = columns
      chart && chart.load(chartData.data);
    }, 500);
    this.setState({ chartData, legendData, isLoaded: true })
  }

  redirect(redirectURL) {
    this.props.pushUrl(redirectURL);
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    return ReactDOMServer.renderToString(
      <div className="tooltip subtle-subtext" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>
        {`${d[0].id}: ${d[0].value}`}
      </div>
    );
  }

  createCustomLegend(chartClass) {
    if (!this.chartRef.current || !d3.select(chartClass).select('.legend').empty()) {
      return;
    }
    let chart = this.chartRef.current.chart;
    const orderBy = {"Compliance Score":1,"Engagement Score":2,"Quality Score":3,"Average":4};
    let orderedLegend = Object.entries(this.state.legendData).sort((a, b) => { return orderBy[a[0]] -orderBy[b[0]] });
    d3.select(chartClass).insert('div').attr('class', 'legend')
      .html(ReactDOMServer.renderToString(
        <div className="bar-chart-detailed-legend">
          {orderedLegend.map(([id, value], index) => {

            return id == 'Average'
              ?
              (<div className="legend-title" id={id} key={index}>
                <span className="line" style={{ color: chart.color(id) }} /><div style={{ margin: '-5px 0px 0px 4px' }}> {id}</div>
              </div>)
              :
              (<div key={index}>
                <div className="legend-title" id={id.replace(/[^A-Z0-9]+/ig, "")}>
                  <span className="circle" style={{ color: chart.color(id) }} /><div style={{ margin: '-4px 0px 0px 4px' }}> {id}</div>
                </div>
                <div className={`link subtle-text ${value && value.substring(1)}`} >
                  <a>Learn More</a>
                </div>
              </div>)
          })}
        </div>
      )).each((x) => {
        //Standard Onclicks dont work when you use renderToString on Graph
        orderedLegend.map(([id, value], index) => {
          d3.select(`.bar-chart-detailed-legend #${id.replace(/[^A-Z0-9]+/ig, "")}`)
            .on('mouseover', () => {
              chart.focus(id);
            })
            .on('mouseout', () => {
              chart.revert();
            })
          if (!value) { return };
          d3.select(`.${value.substring(1)}`)
            .on('click', (y) => {
              this.redirect(value);
            });
        })
      });

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
        <Grid container spacing={0} justify='center' className="bar-chart-detailed" style={{ textAlign: 'center', minHeight: 320, marginBottom: 50 }}>
          <Grid item xs={12} className="chart-title">
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