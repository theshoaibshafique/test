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
export default class TimeSeriesChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    this.state = {
      chartID: 'TimeSeriesChart',
      chartData: {
        data: {
          x: 'x',
          columns: [], //Dynamically populated
          // type: 'spline',
          type: 'line',
          labels: false
        }, // End data
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
            // max: pointCount <= 1 ? 100 : null,
            label: {
              text: this.props.yAxis, //Dynamically populated
              position: 'outer-middle'
            },
            min: 0,
            padding: { top: 4, bottom: 4 },

          }
        },
        padding: { top: 0, bottom: 0 },
        legend: {
          show: false
        },
        size: {
          // height: 70,
          // width: 275
        },
        point: {
          // show: false
        },
        subchart: {
          show: true,
          size: {
            // height: 20
          },
        },
        zoom: {
          enabled: true,
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
    if (!this.props.dataPoints) {
      return;
    }
    let formattedData = { x: ['x'], y: ['y'] };
    let colours = [];
    let tooltipData = [];
    dataPoints.map((point, index) => {
      formattedData.x.push(point.valueX);
      colours.push(point.description)
      formattedData.y.push(parseInt(point.valueY));
      tooltipData.push(point.toolTip);
    });
    let chartData = this.state.chartData;
    chartData.data.columns = [formattedData.x, formattedData.y];
    let chart = this.chartRef.current && this.chartRef.current.chart;

    chart && chart.load(chartData);
    setTimeout(() => {
      chart.zoom([this.props.startDate.format("YYYY-MM-DD"), this.props.endDate.format("YYYY-MM-DD")])
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