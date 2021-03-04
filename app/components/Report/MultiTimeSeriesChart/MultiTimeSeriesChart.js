import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import C3Chart from 'react-c3js';
import './style.scss';
import moment from 'moment/moment';
import LoadingOverlay from 'react-loading-overlay';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ReactDOMServer from 'react-dom/server';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);
export default class MultiTimeSeriesChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    const { dataPoints } = this.props;
    const valueYs = dataPoints && dataPoints.map((point) => point.valueY) || [];
    const unavailableDate = dataPoints.length && moment(dataPoints[0].valueX).add(29, 'days');
    this.state = {
      chartID: 'MultiTimeSeriesChart',
      legendData: [],
      chartData: {
        data: {
          x: 'x',
          columns: [], //Dynamically populated
          // type: 'line',
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
                // max: 8 // or whatever value you need
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
        // onrendered: () => this.chartRef.current && this.updateLegend(`.${this.state.chartID}`),
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
    // this.handleBrush()
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
    const unavailableEndDate = dataPoints.length && moment(dataPoints[0].valueX).add(29, 'days');
    dataPoints.map((point) => {
      let xValue = point.valueX;
      if (!xData.includes(xValue)) {
        xData.push(xValue);
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
      //We add the NA category stand alone for custom styling
      // columns.push([`${key}-NA`, ...xData.map((x) => {
      //   return value[x] == null || x == unavailableEndDate.format("YYYY-MM-DD") ? value[unavailableEndDate.format("YYYY-MM-DD")] : null;
      // })]);
    })

    let chartData = this.state.chartData;
    chartData.data.columns = columns;
    let chart = this.chartRef.current && this.chartRef.current.chart;

    chart && chart.load(chartData);
    // chart && chart.groups([Object.keys(formattedData), ['Setup-NA', 'Idle-NA', "Clean-up-NA"]]);
    setTimeout(() => {
      // chart.zoom([this.props.startDate.format("YYYY-MM-DD"), this.props.endDate.format("YYYY-MM-DD")])
      setTimeout(() => {
        // this.handleBrush()
      }, 500)

    }, 500);

    this.setState({ chartData, tooltipData, legendData, tooltipLegendData, unavailableEndDate, isLoaded: true })
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    let tooltipData = d.map((point) => {
      return this.state.tooltipData[point.id + moment(point.x).format("YYYY-MM-DD")];
    })

    if (tooltipData.length == 0) {
      return;
    }
    const xValue = moment(d[0].x).format('MMM DD');
    // if (moment(d[0].x).isBefore(this.state.unavailableEndDate)) {
    //   return ReactDOMServer.renderToString(
    //     <div className="MuiTooltip-tooltip tooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>
    //       <div>{xValue}</div>
    //       <div>Not Available - Moving Average requires at least 30 days of data</div>
    //     </div>);
    // }

    return ReactDOMServer.renderToString(
      <div className="MuiTooltip-tooltip tooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>
        <div>{xValue}</div>
        <div>Total Duration: {d.map(point => point.value).reduce((a, b) => a + b)} min</div>
        {tooltipData.map((line) => {
          return <div>{line}</div>
        })}
      </div>);
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
          return (
            <div
              className="legend-item"
              id={id.replace(/[^A-Z0-9]+/ig, "")}
              key={index}
              onMouseOver={() => {
                chart && chart.focus(id);
              }}
              onMouseOut={() => {
                chart && chart.revert();
              }}
            >
              <div className="legend-title">
                <span className="circle" style={{ color: chart.color(id) }} /><div style={{ margin: '-4px 0px 0px 4px' }}> {id}</div>
                {this.state.tooltipLegendData[id] && <LightTooltip interactive arrow title={this.state.tooltipLegendData[id]} placement="top" fontSize="small">
                  <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
                </LightTooltip>}
              </div>
            </div>
          )
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
        <Grid container spacing={0} justify='center' className="multi-time-series" style={{ textAlign: 'center' }}>
          <Grid item xs className="chart-title">
            {this.props.title}{this.props.toolTip && <LightTooltip interactive arrow title={Array.isArray(this.props.toolTip) ? this.props.toolTip.map((line) => { return <div>{line}</div> }) : this.props.toolTip} placement="top" fontSize="small">
              <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
            </LightTooltip>}
          </Grid>
          <Grid item xs={12} className="chart-subtitle">
            {this.props.subTitle}
          </Grid>
          <Grid item xs={12}>
            {<C3Chart className={this.state.chartID} ref={this.chartRef} {...this.state.chartData} />}
            {this.renderLegend()}
          </Grid>
          <Grid item xs={12} className="chart-label">
            {this.props.xAxis}
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}