import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import C3Chart from 'react-c3js';
import './style.scss';
import moment from 'moment/moment';
import LoadingOverlay from 'react-loading-overlay';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ReactDOMServer from 'react-dom/server';
import { mdiTrendingDown, mdiTrendingUp } from '@mdi/js';
import Icon from '@mdi/react'
import { LightTooltip } from '../../SharedComponents/SharedComponents';

export default class TimeSeriesChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    const { dataPoints, startDate } = this.props;
    const valueYs = dataPoints && dataPoints.map((point) => point.valueY).filter((y) => y) || [] || [];

    const firstPointWithY = dataPoints && dataPoints.find(point => point.valueY != null);
    this.state = {
      chartID: 'TimeSeriesChart',
      chartData: {
        data: {
          x: 'x',
          columns: [], //Dynamically populated
          // type: 'spline',
          type: 'line',
          labels: false,
          colors: {
            'NA': '#ABABAB',
          },
        }, // End data
        // regions: firstPointWithY && [
        //   { axis: 'x', end: firstPointWithY.valueX, class: 'regionX' },
        // ] || [],
        color: {
          pattern: ['#028CC8', '#97E7B3', '#CFB9E4', '#004F6E']
        },
        tooltip: {
          // grouped: false,
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
            padding: { left: 0, right: 0 },
            // type: 'category'
          },
          y: {
            // show:false,
            max: dataPoints && Math.min(Math.max(...valueYs) + 10, 100) || 100,
            label: {
              text: this.props.yAxis, //Dynamically populated
              position: 'outer-middle'
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
          height: 316,
          // width: 275
        },
        point: {
          // show: false
        },
        subchart: {
          show: true,
          onbrush: (d) => this.handleBrush() && this.props.showChange && this._doActionNoSpam(d),
          size: {
            // height: 20
          },
        },
        zoom: {
          enabled: false,
        },
        // onrendered: () => this.chartRef.current && this.handleBrush(),
      }
    }

  };

  _doActionNoSpam(d) {
    //Reset Timeout if function is called before it ends
    if (!(this.timerId == null)) {
      clearTimeout(this.timerId);
    }
    this.timerId = setTimeout(() => {
      this.setState({ domain: d })
      this.handleBrush();
    }, 200);
  }

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
    return true
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.dataPoints && this.props.dataPoints) {
      this.generateChartData();
    }
    // this.handleBrush()
  }

  componentDidMount() {
    this.generateChartData();
  }

  generateChartData() {
    const { dataPoints, minDate } = this.props;
    if (!dataPoints) {
      return;
    }
    let formattedData = { x: ['x'], y: ['y'] };
    let na = ['NA'];
    let colours = [];
    let tooltipData = {};

    let changeCache = [];
    dataPoints.map((point, index) => {
      formattedData.x.push(point.valueX);
      colours.push(point.description)
      const valueY = parseInt(point.valueY);
      formattedData.y.push(valueY);
      if (!isNaN(valueY)) {
        tooltipData[moment(point.valueX).format("YYYY-MM-DD")] = point.toolTip;
      }
      changeCache.push({ valueX: moment(point.valueX), valueY: parseInt(valueY) })
      na.push(0)
    });
    let chartData = this.state.chartData;
    chartData.data.columns = [formattedData.x, ['y', ...new Array(formattedData.y.length).fill(0)]];
    let chart = this.chartRef.current && this.chartRef.current.chart;

    chart && chart.load(chartData);
    let domain = [this.props.startDate.format("YYYY-MM-DD"), this.props.endDate.format("YYYY-MM-DD")];
    if (this.props.startDate.format("YYYY-MM-DD") == this.props.endDate.format("YYYY-MM-DD")){
      domain = [this.props.startDate.clone().add(-1,'day').format("YYYY-MM-DD"), this.props.endDate.clone().add(1,'day').format("YYYY-MM-DD")]
    }
    setTimeout(() => {
      chartData.data.columns = [formattedData.x, formattedData.y, na];
      chart && chart.load(chartData.data);
      setTimeout(() => {
        chart.zoom(domain)
        setTimeout(() => {
          this.handleBrush()
        }, 500);
      }, 500);
    }, 500);
    

    changeCache = changeCache.sort((a, b) => a.valueX.valueOf() - b.valueX.valueOf());
    this.setState({ chartData, colours, tooltipData, changeCache, reverseChangeCache: [].concat(changeCache).reverse(), domain, isLoaded: true })
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    const xValue = moment(d[0].x);
    let tooltipData = this.state.tooltipData && this.state.tooltipData[xValue.format("YYYY-MM-DD")] || []
    if (tooltipData.length == 0) {
      return ReactDOMServer.renderToString(
        <div className="MuiTooltip-tooltip tooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>
          <div>{xValue.format('MMM DD')}</div>
          <div>{this.props.nullMessage}</div>
        </div>);
    }

    return ReactDOMServer.renderToString(
      <div className="MuiTooltip-tooltip tooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>
        {tooltipData.map((line) => {
          return <div>{line}</div>
        })}
      </div>);
  }



  renderChangeValue() {
    const { domain, changeCache, reverseChangeCache } = this.state;
    if (!domain || domain.length < 2) {
      return ''
    }

    const startDate = moment(domain[0]).startOf('day');
    const endDate = moment(domain[1]).endOf('day');
    const firstPoint = changeCache && changeCache.find(point => point.valueX.isBetween(startDate, endDate) && !isNaN(point.valueY)) || {};
    const lastPoint = reverseChangeCache && reverseChangeCache.find(point => point.valueX.isBetween(startDate, endDate) && !isNaN(point.valueY)) || {};
    let diff = Math.round(((lastPoint.valueY - firstPoint.valueY) / firstPoint.valueY) * 100)
    let tag = '';
    let className = ''
    let tooltip = '';
    if (isNaN(diff) || diff == 0) {
      diff = `—`;
      tooltip = "No Change";
    } else if (diff < 0) {
      className = "trending-down";
      tooltip = "Negative Trend";
      tag = <Icon color="#FF0000" path={mdiTrendingDown} size={'32px'} />
    } else {
      tooltip = "Positive Trend";
      className = "trending-up";
      tag = <Icon color="#009483" path={mdiTrendingUp} size={'32px'} />
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
        <Grid container spacing={0} justify='center' className="time-series" style={{ textAlign: 'center' }}>
          <Grid item xs className="chart-title">
            {this.props.title}{this.props.toolTip && <LightTooltip interactive arrow title={Array.isArray(this.props.toolTip) ? this.props.toolTip.map((line) => { return <div>{line}</div> }) : this.props.toolTip} placement="top" fontSize="small">
              <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
            </LightTooltip>}
            {this.props.showChange && this.renderChangeValue()}
          </Grid>
          <Grid item xs={12} className="chart-subtitle">
            {this.props.subTitle}
          </Grid>
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