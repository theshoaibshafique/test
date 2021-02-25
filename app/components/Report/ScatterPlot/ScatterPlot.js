import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
import moment from 'moment/moment';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import globalFunctions from '../../../utils/global-functions';
import { NavLink } from 'react-router-dom';
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);
export default class ScatterPlot extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    this.id = `scatter-plot-${this.props.id}`;
    const { dataPoints, total } = this.props;
    const valueYs = dataPoints && dataPoints.map((point) => parseInt(point.valueY)) || [];
    const valueXs = dataPoints && dataPoints.map((point) => parseInt(point.valueX)) || [];
    const maxY = dataPoints && Math.min(Math.max(...valueYs) + 10, 100) || 100;
    const minY = dataPoints && Math.max(Math.min(...valueYs) - 10, 0) || 0
    const maxX = Math.max(...valueXs) + 10;
    const minX = Math.max(Math.min(...valueXs) - 10, 0)
    this.state = {
      chartID: 'scatterPlot',
      chartData: {
        data: {
          xs: {
            y: 'x'
          },
          columns: [], //Dynamically populated
          type: 'scatter',
        }, // End data
        color: {
          pattern: this.props.pattern || ['#A7E5FD', '#97E7B3', '#FFDB8C', '#FF7D7D', '#CFB9E4', '#50CBFB', '#6EDE95', '#FFC74D', '#FF4D4D', '#A77ECD']
        },
        axis: {
          x: {
            max: maxX,
            min: minX,
            label: {
              text: this.props.xAxis, //Dynamically populated
              position: 'outer-center'
            },
            tick: {
              values: [maxX, minX],
              outer: false
            },
            min: 0,
            padding: { left: 0, right: 10 },
          },
          y: {
            max: maxY,
            min: minY,
            padding: { top: 4, bottom: 0 },
            tick: {
              values: [maxY, minY, total],
              outer: false
            }
          }
        },
        grid: {
          y: {
            lines: [{ value: total, text: 'Overall' }],
          }
        },

        tooltip: {
          grouped: false,
          contents: (d, defaultTitleFormat, defaultValueFormat, color) => this.createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color)
        },

        padding: { top: 8, bottom: 8 },
        legend: {
          show: false
        },
        size: {
          // height: 230,
          // width: 310
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
    const { dataPoints } = this.props;
    if (!dataPoints || !dataPoints.length) {
      return;
    }
    let x = ['x'];
    let y = ['y'];
    let tooltipData = [];
    dataPoints.map((point, index) => {
      tooltipData.push(point.toolTip);
      x.push(point.valueX);
      y.push(point.valueY);
    });
    let chartData = this.state.chartData;
    //Set as 0 by default and "load" columns later for animation
    chartData.data.columns = [x, y];
    let chart = this.chartRef.current && this.chartRef.current.chart;
    chart && chart.load(chartData);
    this.setState({ chartData, tooltipData, isLoaded: true })
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    console.log(d)
    let tooltipData = this.state.tooltipData && this.state.tooltipData[d[0].index-1] || []
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
        <Grid container spacing={0} className={`scatter-plot ${this.id}`} style={{ maxHeight: 350 }}>
          <Grid item xs={12} className="chart-title">
            {this.props.title}{this.props.toolTip && <LightTooltip interactive arrow placement="top" fontSize="small"
              title={Array.isArray(this.props.toolTip) ? this.props.toolTip.map((line) => { return <div>{line}</div> }) : this.props.toolTip}
            >
              <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
            </LightTooltip>}
          </Grid>
          <Grid item xs={12} >
            <div className="c3-axis-y-label">{this.props.yAxis}</div>
            <C3Chart ref={this.chartRef} {...this.state.chartData} />
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}