import React from 'react';
import { Grid, withStyles, Tooltip } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
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
            y: this.props.colors || '#A7E5FD'
          },
        }, 
        transition: {
          duration: 500
        },
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
            label: {
              text: this.props.xAxis, //Dynamically populated
              position: 'outer-center'
            },
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
        padding: { top: 8, bottom: 16 },
        legend: {
          show: false
        },
        size: {
          height: 205
        },

      }
    }

  };

  componentDidUpdate(prevProps) {
    if (!prevProps.dataPoints && this.props.dataPoints) {
      this.generateChartData();
    }
    this.handleBrush();
  }

  componentDidMount() {
    this.generateChartData();
  }

  displayTick(tick, tickOffset) {
    tick.querySelector("text").style.transform = `translate(${tickOffset}px, 0)`;
  }

  handleBrush(d) {
    const MAX_TICK_WIDTH = this.props.dataPoints && (this.props.dataPoints.length * .4);
    // let chart = this.chartRef.current && this.chartRef.current.chart.element;
    // var visibilityThreshold = chart.clientWidth / MAX_TICK_WIDTH;
    var allTicks = Array.from(document.querySelectorAll(`.${this.state.chartID} .c3-axis-x.c3-axis > g`));
    const bar = document.querySelector(`.${this.state.chartID} .c3-event-rect`);
    //Center tick between bars
    const tickOffset = bar && bar.getAttribute('width') / 2;
    var whitelist = allTicks.filter((tick, index) => index % 10 == 0);
    var visibleTicks = allTicks
      .filter(tick => !tick.querySelector("line[y2='0']"));
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
    chartData.data.columns = [formattedData.x, ['y', ...new Array(formattedData.y.length).fill(0)]];
    let chart = this.chartRef.current && this.chartRef.current.chart;

    chart && chart.load(chartData);
    setTimeout(() => {
      chartData.data.columns = [formattedData.x, formattedData.y];
      chart && chart.load(chartData.data);
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
          <Grid item xs>
            <C3Chart className={this.state.chartID} ref={this.chartRef} {...this.state.chartData} />
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}