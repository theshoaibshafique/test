import React from 'react';
import { Grid } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
import { NavLink } from 'react-router-dom';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { LightTooltip } from '../../SharedComponents/SharedComponents';
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

  componentDidUpdate(prevProps) {
    if (!prevProps.dataPoints && this.props.dataPoints) {
      this.generateChartData();
    }
    this.handleBrush()
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
      setTimeout(() => {
        this.handleBrush()
      }, 500)
    }, 500);

    this.setState({ chartData, colours, tooltipData, isLoaded: true })
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    let tooltipData = this.state.tooltipData && this.state.tooltipData[d[0].x] || []
    if (tooltipData.length == 0) {
      return;
    }
    return ReactDOMServer.renderToString(
      <div className="tooltip subtle-subtext">
        {tooltipData.map((line) => {
          return <div>{line}</div>
        })}
      </div>);
  }

  chooseColour(d) {
    return this.state.colours[d.x] || '#FF4D4D';
  }

  displayTick(tick, tickOffset) {
    tick.querySelector("text").style.display = "block";
    tick.querySelector("text").style.transform = `translate(${tickOffset}px, 0)`;
  }

  handleBrush(d) {
    const MAX_TICK_WIDTH = this.props.dataPoints && (this.props.dataPoints.length * .4);
    // let chart = this.chartRef.current && this.chartRef.current.chart.element;
    // var visibilityThreshold = chart.clientWidth / MAX_TICK_WIDTH;
    var allTicks = Array.from(document.querySelectorAll(`.${this.state.chartID} .c3-axis-x.c3-axis > g`));
    const bar = document.querySelector(`.${this.state.chartID} .c3-event-rect`);
    //Center tick between bars
    const tickOffset = bar.getAttribute('width') / 2;
    var whitelist = allTicks.filter((tick, index) => index % 10 == 0);
    var visibleTicks = allTicks
      .filter(tick => !tick.querySelector("line[y2='0']"));
    if (visibleTicks.length < Math.max(MAX_TICK_WIDTH, 96)) {
      allTicks.forEach(tick => tick.querySelector("text").style.display = "none");
    }
    if (visibleTicks.length < 24) {
      whitelist = allTicks.filter((tick, index) => index % 2 == 0);
      visibleTicks.forEach(tick => { if (whitelist.includes(tick)) this.displayTick(tick, tickOffset) });
    } else if (visibleTicks.length <= 64) {
      whitelist = allTicks.filter((tick, index) => index % 5 == 0);
      visibleTicks.forEach(tick => { if (whitelist.includes(tick)) this.displayTick(tick, tickOffset) });
    } else if (visibleTicks.length < Math.max(MAX_TICK_WIDTH, 96)) {
      allTicks.forEach(tick => tick.querySelector("text").style.display = "none");
      visibleTicks.forEach(tick => { if (whitelist.includes(tick)) this.displayTick(tick, tickOffset) });
    }
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
              title={Array.isArray(this.props.toolTip) ? this.props.toolTip.map((line, index) => { return <div key={index} style={!line ? { margin: 8 } : {}}>{line}</div> }) : this.props.toolTip}
              placement="top" fontSize="small"
            >
              <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
            </LightTooltip>}
          </Grid>
          <Grid item xs={12} className="chart-subtitle subtle-subtext">
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