import React from 'react';
import { Grid } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import LoadingOverlay from 'react-loading-overlay';

export default class StackedBarChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();

    this.state = {
      legendData:[],
      chartID: 'stackedBarChartDetailed',
      chartData: {
        data: {
          x: 'x',
          columns: [], //Dynamically populated
          type: 'bar',
          labels: {
            format: (v, id, i, j) => this.createCustomLabel(v, id, i, j)
          },
          order: 'asc'
        }, // End data
        color: {
          pattern: ['#A7E5FD', '#97E7B3', '#CFB9E4', '#004F6E']
        },
        bar: {
          width: 50,
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
            min: 0,
            padding: { top: 30, bottom: 0 },
          }
        },
        grid: {
          lines: {
            front: false,
          },
          y: {
            show:true
          }
        },
        padding: { top: 8, bottom: 8 },
        legend: {
          show: false
        },
        size: {
          // width: 440
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

  getName(searchList, key) {
    let index = searchList.findIndex(item => item.value.toLowerCase() == key.toLowerCase());
    if (index >= 0) {
      return searchList[index].name;
    }
    return key;
  }

  generateChartData() {
    if (!this.props.dataPoints) {
      return;
    }
    let dataPoints = this.props.dataPoints.sort((a, b) => { return a.valueX - b.valueX });
    let legendData = {};
    let zData = [];
    let formattedData = { x: [] };
    dataPoints.map((point) => {
      if (!formattedData.x.includes(point.valueX)) {
        formattedData.x.push(point.valueX);
      }
      point.title = this.getName(this.props.specialties, point.title);
      formattedData[point.title] = formattedData[point.title] || [];
      formattedData[point.title].push(point.valueY);
      legendData[point.title] = point.subTitle;
      point.valueZ && zData.push(point.valueZ);
    });
    let columns = [];
    Object.entries(formattedData).map(([key, value]) => {
      columns.push([key, ...value]);
    })
    let chartData = this.state.chartData;
    chartData.data.columns = columns;
    chartData.axis.x.label.text = this.props.footer;
    chartData.axis.y.label.text = this.props.subTitle;

    let chart = this.chartRef.current && this.chartRef.current.chart;
    chart && chart.load(chartData.data);
    chart && chart.groups([Object.keys(formattedData)]);
    var shown = chart && chart.data.shown().map(function(item){ return item.id }) || [""] // get visible ids: ['data1', 'data2', ...]
    var last = (shown[shown.length - 1]) || "";
    d3.select('.stacked-barchart-detailed .c3-chart-texts').selectAll('.c3-target').style('display', 'none') // hide all
    d3.select('.stacked-barchart-detailed .c3-chart-texts').selectAll('.c3-target-' + last.replace(/\s/g,'-')).style('display', 'block') // show last
    this.setState({ chartData, legendData, xData: formattedData.x, zData, isLoaded: true })
  }

  createCustomLabel(v, id, i, j) {
    if (id && this.state.zData ) {
      return this.state.zData[i]
    }
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    let x = this.state.xData[d[0].x];
    return ReactDOMServer.renderToString(
      <div className="chartTooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>
        <div>{`${d[0].id}`}</div>
        <div>{`${x}: ${d[0].value}`}</div>
      </div>
    );
  }

  createCustomLegend(chartClass) {
    if (!this.chartRef.current || !d3.select(chartClass).select('.legend').empty()) {
      return;
    }
    let chart = this.chartRef.current.chart;
    d3.select(chartClass).insert('div').attr('class', 'legend')
      .html(ReactDOMServer.renderToString(
        <div className="bar-chart-detailed-legend">
          {Object.entries(this.state.legendData).map(([id, value], index) => {
            return (<div style={{ margin: '4px 0' }} key={index}>
              <div className="legend-title">
                <span className="circle" style={{ color: chart.color(id) }} /><div style={{ margin: '-4px 0px 0px 4px' }}> {id}</div>
              </div>
            </div>)
          })}
        </div>
      ));
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
          <Grid item xs={9} className="chart-title">
            {this.props.description}
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={8} >
            {<C3Chart ref={this.chartRef} {...this.state.chartData} />}
          </Grid>
          <Grid item xs={4} className={this.state.chartID}>
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}