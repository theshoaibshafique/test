import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import C3Chart from 'react-c3js';
import './style.scss';
import moment from 'moment/moment';
import LoadingOverlay from 'react-loading-overlay';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ReactDOMServer from 'react-dom/server';
import { ContactlessTwoTone } from '@material-ui/icons';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);
export default class TimeSeriesChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    const { dataPoints, startDate } = this.props;
    const valueYs = dataPoints && dataPoints.map((point) => parseInt(point.valueY)) || [];

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
        regions: [
          { axis: 'x', end: firstPointWithY && firstPointWithY.valueX, class: 'regionX' },
        ],
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
            padding: { top: 4, bottom: 4 },

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
          onbrush: (d) => this.handleBrush(d),
          size: {
            // height: 20
          },
        },
        zoom: {
          enabled: false,
        },
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
    let tooltipData = [];
    const firstPointWithY = dataPoints && dataPoints.find(point => point.valueY != null) || {};
    const unavailEndDate = moment(firstPointWithY.valueX);
    const diff = unavailEndDate.diff(minDate, 'days');
    let padDate = minDate.clone();
    let greyRegion = [];
    for (let i = 0; i <= diff; i++){
      na.push(firstPointWithY.valueY)
      //Skip tooltip for overlapping value
      const toolTip = i!=diff ? [padDate.format("MMM DD"), "Not Available - Moving Average requires at least 30 days of data"] :  []
      greyRegion.push({valueX: padDate.format("YYYY-MM-DD"), toolTip:toolTip})
      padDate.add(1,'day')
    }
    
    [...greyRegion, ...dataPoints].map((point, index) => {
      formattedData.x.push(point.valueX);
      colours.push(point.description)
      const valueY = parseInt(point.valueY);
      formattedData.y.push(valueY);
      tooltipData.push(point.toolTip);
    });
    let chartData = this.state.chartData;

    chartData.data.columns = [formattedData.x, formattedData.y, na];
    let chart = this.chartRef.current && this.chartRef.current.chart;

    chart && chart.load(chartData);
    setTimeout(() => {
      chart.zoom([this.props.startDate.format("YYYY-MM-DD"), this.props.endDate.format("YYYY-MM-DD")])
      setTimeout(() => {
        this.handleBrush()
      }, 500)

    }, 500);

    this.setState({ chartData, colours, tooltipData, isLoaded: true })
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    let tooltipData = this.state.tooltipData && this.state.tooltipData[d[0].index] || []
    if (tooltipData.length == 0) {
      return;
    }

    return ReactDOMServer.renderToString(
      <div className="MuiTooltip-tooltip tooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>
        {tooltipData.map((line) => {
          return <div>{line}</div>
        })}
      </div>);
  }

  renderChangeValue(){
    return (
      <div className={``}>

      </div>
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