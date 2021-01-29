import React from 'react';
import { Grid, withStyles, Tooltip } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
import moment from 'moment/moment';
import { NavLink } from 'react-router-dom';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import globalFunctions from '../../../utils/global-functions';
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);
export default class Histogram extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    this.id = `histogram-${this.props.id}`;
    this.state = {
      chartID: 'histogram',
      chartData: {
        data: {
          x: 'x',
          columns: [], //Dynamically populated
          type: 'bar',
          colors: {
            y: (d) => this.chooseColour(d)
          },
        }, // End data
        bar: {
          width: {
            ratio: .9
          }
        },
        tooltip: {
          grouped: false,
          contents: (d, defaultTitleFormat, defaultValueFormat, color) => this.createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color)
        },
        axis: {
          x: {
            // label: {
            //   text: this.props.xAxis, //Dynamically populated
            //   position: 'outer-center'
            // },
            tick: {
              multiline: false,
              culling: {
                max: 8 // or whatever value you need
              }
            },
            type: 'category',
          },
          y: {
            label: {
              text: this.props.yAxis, //Dynamically populated
              position: 'outer-middle'
            },
            // max: 100,
            min: 0,
            padding: { top: 20, bottom: 0 },
            tick: {
              format: function (d) {
                return (parseInt(d) == d) ? d : null;
              }
            }
          }
        },
        grid: {
          lines: {
            front: false,
          },
          y: {
            show: true
          }
        },
        padding: { top: 8, bottom: 8 },
        legend: {
          show: false
        },
        size: {
          height: 284,
          // width: 470
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
    if (!dataPoints) {
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
    const indexOfMax = formattedData.y.slice(1).reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    const leftSpan = Math.min(Math.round(formattedData.y.length * .1), 10)
    const rightSpan = Math.min(Math.round(formattedData.y.length * .2), 15)
    setTimeout(() => {
      chart.zoom([Math.max(0, indexOfMax - leftSpan), Math.min(formattedData.y.length - 1, indexOfMax + rightSpan)])
    }, 500);

    this.setState({ chartData, colours, tooltipData, isLoaded: true })
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    let tooltipData = this.state.tooltipData && this.state.tooltipData[d[0].x] || []
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

  chooseColour(d) {
    return this.state.colours[d.x] || '#FF4D4D';
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
        <Grid container spacing={0} direction="column" className={`histogram ${this.id}`} >
          <Grid item xs className="chart-title">
            {this.props.title}{this.props.toolTip && <LightTooltip interactive arrow
              title={Array.isArray(this.props.toolTip) ? this.props.toolTip.map((line) => { return <div style={!line ? { margin: 8 } : {}}>{line}</div> }) : this.props.toolTip}
              placement="top" fontSize="small"
            >
              <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
            </LightTooltip>}
          </Grid>
          <Grid item xs={12} className="chart-subtitle">
            {this.props.subTitle}
          </Grid>
          <Grid item xs>
            <C3Chart className={this.state.chartID} ref={this.chartRef} {...this.state.chartData} />
          </Grid>
          <Grid item xs className="c3-axis-x-label">
            {this.props.xAxis}
          </Grid>
          <Grid item xs>
            {this.props.url && <NavLink to={this.props.url} className='link'>
              {this.props.urlText}
            </NavLink>}
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}