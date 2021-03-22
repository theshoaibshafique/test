import React from 'react';
import { Grid } from '@material-ui/core';
import C3Chart from 'react-c3js';
import './style.scss';
import moment from 'moment/moment';
import LoadingOverlay from 'react-loading-overlay';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ReactDOMServer from 'react-dom/server';
import { mdiTrendingDown, mdiTrendingUp } from '@mdi/js';
import Icon from '@mdi/react'
import { LightTooltip } from '../../SharedComponents/SharedComponents';

export default class MultiTimeSeriesChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    const { dataPoints } = this.props;
    const valueYs = dataPoints && dataPoints.map((point) => point.valueY).filter((y) => y) || [];
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
        }, // End data
        transition: {
          duration: 500
        },
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
            padding: { left: 0, right: 0},
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
          height: 375,
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
    //Create a 0 y axis for tooltips
    let na = ['NA'];
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
      na.push(0)
    });
    let columns = [['x', ...xData], na];
    const orderBy = this.props.orderBy || {};
    let legendData = Object.entries(formattedData).sort((a, b) => { return orderBy[a[0]] - orderBy[b[0]] });
    // xData = xData.sort((a,b) => moment(b).diff(moment(a)));
    legendData.map(([key, value]) => {
      const xValues = xData.map((x) => {
        return value[x] || null;
      })
      columns.push([key, ...xValues]);
      const firstPoint = xValues.find(v => v != null);
      const lastPoint = xValues.reverse().find(v => v != null);
      const diff = firstPoint == lastPoint ? 0 : Math.round(((lastPoint - firstPoint) / firstPoint) * 100);
      this.setState({[`${key.toLowerCase()}Trend`]: diff})
    })
    let chartData = this.state.chartData;
    chartData.data.columns = columns.map((arr) => {
      return arr.map((x) => {
        return parseInt(x) == x ? 0 : x;
      })
    });
    let chart = this.chartRef.current && this.chartRef.current.chart;

    chart && chart.load(chartData);
    setTimeout(() => {
      chartData.data.columns = columns;
      chart && chart.load(chartData.data);
    }, 500);

    this.setState({ chartData, tooltipData, legendData, tooltipLegendData, unavailableEndDate, isLoaded: true })
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    const xValue = moment(d[0].x).format('MMM DD');
    let na = d.filter((point) => point.value == null && point.id != "NA").map((point) => point.id) || [];
    if (na.length == d.length - 1) {
      return ReactDOMServer.renderToString(
        <div className="tooltip subtle-subtext" >
          <div>{xValue}</div>
          <div>Unavailable - no data in last 30 days</div>
        </div>);
    }
    return ReactDOMServer.renderToString(
      <div className="tooltip subtle-subtext" >
        <div>{xValue}</div>
        {d.filter((point) => point.value != null && point.id != "NA").map(point => (
          <div>{`${point.id}: ${point.value}`}</div>
        ))}

        {na.length != 0 && (
          <div style={{ marginTop: 12 }}>
            {`${na.join(", ")}:`}
            <div>Unavailable - no data in last 30 days</div>
          </div>
        )}

      </div>);


  }
  renderChange(id){
    let diff = this.state[`${id.toLowerCase()}Trend`];
    let tag = '';
    let className = ''
    let tooltip = '';
    if (isNaN(diff)) {
      diff = `—`;
      className = "trending-up";
      tooltip = "Positive Trend (Percent change is not available if the previous score was 0)";
      tag = <Icon color="#009483" path={mdiTrendingUp} size={'24px'} />
    } else if (diff == 0) {
      diff = `—`;
      tooltip = "No Change";
    } else if (diff < 0) {
      className = "trending-down";
      tooltip = "Negative Trend";
      tag = <Icon color="#FF0000" path={mdiTrendingDown} size={'24px'} />
    } else {
      tooltip = "Positive Trend";
      className = "trending-up";
      tag = <Icon color="#009483" path={mdiTrendingUp} size={'24px'} />
    }
    return (
      <LightTooltip interactive arrow
        title={tooltip}
        placement="top" fontSize="small"
      >
        <div className={`change-value ${className}`}>
          <span>{`${diff}%`}</span>
          <span>{tag}</span>
        </div>
      </LightTooltip>

    )
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
              {this.renderChange(id)}
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
            {this.props.title}{this.props.toolTip && <LightTooltip interactive arrow title={Array.isArray(this.props.toolTip) ? this.props.toolTip.map((line,index) => { return <div key={index}>{line}</div> }): this.props.toolTip} placement="top" fontSize="small">
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