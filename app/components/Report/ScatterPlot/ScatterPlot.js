import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

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
    let { dataPoints, score } = this.props;
    score = score || null
    const valueYs = dataPoints && dataPoints.map((point) => parseInt(point.valueY)) || [];
    const valueXs = dataPoints && dataPoints.map((point) => parseInt(point.valueX)) || [];
    const maxY = dataPoints && Math.min(Math.max(...valueYs, score)+10, 100) || 100;
    const minY = dataPoints && Math.max(Math.min(...valueYs, score)-10, 0) || 0
    const maxX = Math.max(...valueXs);
    const minX = Math.max(Math.min(...valueXs) - 10, 0)
    this.state = {
      chartID: 'scatterPlot',
      chartData: {
        data: {
          xs: {
            y: 'x'
          },
          columns: [], //Dynamically populated
          selection: {
            enabled: true,
            multiple: false
          },
          onselected: (d) => this.onselected(d),
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
            padding: { left: 0, right: Math.round(maxX*.1) },
          },
          y: {
            label: {
              text: this.props.yAxis, //Dynamically populated
              position: 'outer-middle'
            },
            max: maxY,
            min: minY,
            padding: { top: 10, bottom: 0 },
            tick: {
              values: [maxY, minY, score],
              outer: false
            }
          }
        },
        grid: {
          y: {
            lines: [{ value: score, text: 'Overall' }],
          },
          lines: {
            front: false
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
          height: 230,
          // width: 310
        },
        onrendered: () => this.chartRef.current && this.onrendered(),
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
    const { dataPoints, highlight } = this.props;
    if (!dataPoints || !dataPoints.length) {
      return;
    }
    let x = ['x'];
    let y = ['y'];
    let tooltipData = {};
    let highlightedIndex = null;
    //Sort to find the proper index of highlighted value
    dataPoints.sort((a,b) => a.valueX - b.valueX);
    dataPoints.map((point, index) => {
      const { valueX, valueY, toolTip, title } = point;
      if (tooltipData[`${valueX}-${valueY}`]) {
        tooltipData[`${valueX}-${valueY}`] = tooltipData[`${valueX}-${valueY}`].concat(["", ...toolTip]);
      } else {
        tooltipData[`${valueX}-${valueY}`] = toolTip;
      }
      x.push(valueX);
      y.push(valueY);
      if (highlight == title){
        highlightedIndex = index;
      }
    });

    let chartData = this.state.chartData;
    //Set as 0 by default and "load" columns later for animation
    chartData.data.columns = [x, y];
    let chart = this.chartRef.current && this.chartRef.current.chart;
    chart && chart.load(chartData);

    this.setState({ chartData, tooltipData, highlightedIndex, isLoaded: true })
  }

  onselected(d){
    // const selected = d3 && d3.select(".scatter-plot circle._selected_")[0][0];
    // selected && selected.parentNode.appendChild(selected);
  }
  onrendered(d) {
    let chart = this.chartRef.current && this.chartRef.current.chart;
    //highlight after rendered
    if (this.props.highlight){
      chart && chart.select(['y'], [this.state.highlightedIndex]);
    }
    
    //Remove manual select listener
    d3 && d3.select(".scatter-plot").selectAll(".c3-event-rect").on("click", null);
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    let tooltipData = this.state.tooltipData && this.state.tooltipData[`${d[0].x}-${d[0].value}`] || []
    if (tooltipData.length == 0) {
      return;
    }
    return ReactDOMServer.renderToString(
      <div className="MuiTooltip-tooltip tooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>
        {tooltipData.map((line) => {
          return <div style={!line ? { margin: 8 } : {}}>{line}</div>
        })}
      </div>);
  }

  render() {
    return (
      <LoadingOverlay
        active={false}
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
            <C3Chart ref={this.chartRef} {...this.state.chartData} />
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}