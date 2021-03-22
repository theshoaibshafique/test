import React from 'react';
import { Grid } from '@material-ui/core';
import C3Chart from 'react-c3js';
import './style.scss';
import moment from 'moment/moment';
import LoadingOverlay from 'react-loading-overlay';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ReactDOMServer from 'react-dom/server';
import { LightTooltip } from '../../SharedComponents/SharedComponents';

export default class TimeSeriesAreaChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    const { dataPoints } = this.props;
    const valueYs = dataPoints && dataPoints.map((point) => point.valueY) || [];
    // const unavailableDate = dataPoints.length && moment(dataPoints[0].valueX).add(29, 'days');
    this.state = {
      chartID: 'TimeSeriesAreaChart',
      legendData: [],
      chartData: {
        data: {
          x: 'x',
          columns: [], //Dynamically populated
          type: 'area',
          labels: false,
          order: 'asc',
          colors: {
            'Setup-NA': '#ABABAB',
            'Idle-NA': '#ABABAB',
            'Clean-up-NA': '#ABABAB',
          }
        }, // End data
        regions: [
          // { axis: 'x', end: unavailableDate, class: 'regionX' },
        ],
        color: {
          pattern: ['#A7E5FD', '#97E7B3', '#FFDB8C', '#FF7D7D', '#CFB9E4', '#50CBFB', '#6EDE95', '#FFC74D', '#FF4D4D', '#A77ECD']
        },
        tooltip: {
          grouped: true,
          contents: (d, defaultTitleFormat, defaultValueFormat, color) => this.createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color)
        },
        axis: {
          x: {
            // show:false,
            label: {
              text: this.props.xAxis, //Dynamically populated
              position: 'outer-center'
            },
            type: 'timeseries',
            tick: {
              multiline: false,
              // rotate: 75,
              culling: {
                max: 5 // or whatever value you need
              },
              format: (x) => { return `${x && moment(x).format('MMM DD')}` },
            },
            // type: 'category'
          },
          y: {
            // show:false,
            max: dataPoints && Math.min(Math.max(...valueYs) + 10, 100) || 100,
            label: {
              text: this.props.yAxis, //Dynamically populated
              position: 'outer-middle',
            },
            min: dataPoints && Math.max(Math.min(...valueYs) - 10, 0) || 0,
            padding: { top: 4, bottom: 0 },

          }
        },
        padding: { top: 0, bottom: 0 },
        legend: {
          show: false
        },
        size: {
          height: 283,
          // width: 275
        },
        point: {
          // show: false
        },
        subchart: {
          show: true,
          onbrush: (d) => this.handleBrush(d),
          size: {
            // height: 20
          },
        },
        zoom: {
          enabled: false,
        },
        onrendered: () => this.chartRef.current && this.updateLegend(`.${this.state.chartID}`),
      }
    }

  };

  handleBrush(d) {
    // const MAX_TICK_WIDTH = this.props.dataPoints && (this.props.dataPoints.length *.3) ;
    const MAX_TICK_WIDTH = 128;
    // let chart = this.chartRef.current && this.chartRef.current.chart.element;
    // var visibilityThreshold = chart.clientWidth / MAX_TICK_WIDTH;
    var allTicks = Array.from(document.querySelectorAll(`.${this.state.chartID} .c3-axis-x.c3-axis > g`));
    var whitelist = allTicks.filter((tick, index) => index % 16 == 0);
    var visibleTicks = allTicks
      .filter(tick => !tick.querySelector("line[y2='0']"));

    if (visibleTicks.length < MAX_TICK_WIDTH) {
      allTicks.forEach(tick => tick.querySelector("text").style.display = "none");
    }

    if (visibleTicks.length <= 8) {
      whitelist = allTicks.filter((tick, index) => index % 2 == 0);
      visibleTicks.forEach(tick => { if (whitelist.includes(tick)) tick.querySelector("text").style.display = "block" });
    } else if (visibleTicks.length <= 16) {
      whitelist = allTicks.filter((tick, index) => index % 4 == 0);
      visibleTicks.forEach(tick => { if (whitelist.includes(tick)) tick.querySelector("text").style.display = "block" });
    } else if (visibleTicks.length <= 64) {
      whitelist = allTicks.filter((tick, index) => index % 8 == 0);
      visibleTicks.forEach(tick => { if (whitelist.includes(tick)) tick.querySelector("text").style.display = "block" });
    } else if (visibleTicks.length < MAX_TICK_WIDTH) {
      visibleTicks.forEach(tick => { if (whitelist.includes(tick)) tick.querySelector("text").style.display = "block" });
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.dataPoints && this.props.dataPoints) {
      this.generateChartData();
    }
    //Need to manually redraw axis on update
    this.handleBrush()
  }

  componentDidMount() {
    this.generateChartData();
  }

  generateChartData() {
    const { dataPoints } = this.props;
    if (!dataPoints) {
      return;
    }
    let xData = [];
    let formattedData = {};
    let tooltipLegendData = {};
    let tooltipData = {};

    let na = ['NA'];
    dataPoints.map((point) => {
      let xValue = point.valueX;
      if (!xData.includes(xValue)) {
        xData.push(xValue);
        na.push(0);
      }

      formattedData[point.title] = formattedData[point.title] || {};
      formattedData[point.title][xValue] = formattedData[point.title][xValue] || 0
      formattedData[point.title][xValue] = point.valueY;
      tooltipLegendData[point.title] = point.note ? point.note : tooltipLegendData[point.title];
      tooltipData[point.title + xValue] = point.toolTip;
    });
    let columns = [['x', ...xData]];
    const orderBy = this.props.orderBy || {};
    let legendData = Object.entries(formattedData).sort((a, b) => { return orderBy[a[0]] - orderBy[b[0]] });
    legendData.map(([key, value]) => {
      columns.push([key, ...xData.map((x) => {
        return value[x];
      })]);
    })
    let chartData = this.state.chartData;
    chartData.data.columns = [...columns, na];
    let chart = this.chartRef.current && this.chartRef.current.chart;

    chart && chart.load(chartData);
    chart && chart.groups([Object.keys(formattedData)]);
    let domain = [this.props.startDate.format("YYYY-MM-DD"), this.props.endDate.format("YYYY-MM-DD")];
    if (this.props.startDate.format("YYYY-MM-DD") == this.props.endDate.format("YYYY-MM-DD")) {
      domain = [this.props.startDate.clone().add(-1, 'day').format("YYYY-MM-DD"), this.props.endDate.clone().add(1, 'day').format("YYYY-MM-DD")]
    }
    setTimeout(() => {
      chart.zoom(domain)
      setTimeout(() => {
        this.handleBrush()
      }, 500)

    }, 500);

    this.setState({ chartData, tooltipData, legendData, tooltipLegendData, isLoaded: true })
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    let tooltipData = d.map((point) => {
      return this.state.tooltipData[point.id + moment(point.x).format("YYYY-MM-DD")];
    })
    const xValue = moment(d[0].x).format('MMM DD');
    let na = d.filter((point) => point.value == null && point.id != "NA").map((point) => point.id) || [];
    if (na.length == d.length - 1) {
      return ReactDOMServer.renderToString(
        <div className="tooltip subtle-subtext">
          <div>{xValue}</div>
          <div>Unavailable - at least five turnovers required in last 30 days</div>
        </div>);
    }

    return ReactDOMServer.renderToString(
      <div className="tooltip subtle-subtext">
        <div>{xValue}</div>
        <div>Total Duration: {d.map(point => point.value).reduce((a, b) => a + b)} min</div>
        {tooltipData.map((line) => {
          return line && line.map((line) => { return <div style={!line ? { margin: 8 } : {}}>{line}</div> })
        })}
      </div>);
  }

  updateLegend() {
    let chart = this.chartRef.current.chart;
    this.state.legendData.map(([id, value], index) => {
      d3.select(`.area-time-series #${id.replace(/[^A-Z0-9]+/ig, "")}`)
        .on('mouseover', () => {
          chart.focus(id);
        })
        .on('mouseout', () => {
          chart.revert();
        })
    })
  }

  renderLegend() {
    if (!this.chartRef.current) {
      return;
    }
    let chart = this.chartRef.current.chart;
    return <div className={`time-series-area-horizontal`}>
      <div className="area-time-series-legend">
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
        <Grid container spacing={0} justify='center' className="area-time-series" style={{ textAlign: 'center' }}>
          <Grid item xs className="chart-title">
            {this.props.title}{this.props.toolTip && <LightTooltip interactive arrow title={Array.isArray(this.props.toolTip) ? this.props.toolTip.map((line,index) => { return <div key={index}>{line}</div> }) : this.props.toolTip} placement="top" fontSize="small">
              <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
            </LightTooltip>}
          </Grid>
          <Grid item xs={12} className="chart-subtitle subtle-subtext">
            {this.props.subTitle}
          </Grid>
          <Grid item xs={12}>
            {<C3Chart className={this.state.chartID} ref={this.chartRef} {...this.state.chartData} />}
            {this.renderLegend()}
          </Grid>
          <Grid item xs={12} className="chart-label subtle-text">
            {this.props.xAxis}
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}