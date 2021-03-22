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
import { LightTooltip } from '../../SharedComponents/SharedComponents';
export default class BarChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    this.id = `bar-chart-${this.props.id}`;
    this.state = {
      chartID: 'barChart',
      chartData: {
        data: {
          x: 'x',
          columns: [], //Dynamically populated
          type: 'bar',
          labels: {
            format: (v, id, i, j) => this.createCustomLabel(v, id, i, j)
          },
        }, // End data
        zoom: {
          rescale: true
        },
        color: {
          pattern: this.props.pattern || ['#FF7D7D', '#FFDB8C', '#A7E5FD', '#97E7B3', '#CFB9E4', '#004F6E']
        },
        bar: {
          width: {
            ratio: this.props.dataPoints && this.props.dataPoints.length <= 3 ? .2 : .4
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
              format: this.props.noWrapXTick ? function (x) {
                x = this.api.categories()[x];
                function stringEllipsis(charsToShow, nosOfDots) {
                  return this.toString().substring(0, charsToShow) + Array(nosOfDots + 1).join(".")
                }
                let totalBars = Math.abs(this.x.orgDomain().reverse().reduce(function (a, b) {
                  return a - b
                }));
                let substrLimit = parseInt(30 / Math.ceil(totalBars));
                x = substrLimit < x.length ? stringEllipsis.apply(x , [substrLimit , 3]) : x;
                return x;
              } : null
            },
            type: 'category',
            height: this.props.id == 2 && this.props.reportType == "ComplianceScoreReport" ? 90 : 60
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
    if (!this.props.dataPoints) {
      return;
    }
    let dataPoints = this.props.dataPoints;
    let zData = [];
    let xData = [];
    let descData = [];
    let formattedData = { x: [] };
    let sum = 0
    let tooltipData = [];
    dataPoints.map((point, index) => {
      let xValue = globalFunctions.getName(this.props.labelList, point.valueX);
      if (parseInt(point.valueX) == point.valueX) {
        xValue = moment().month(parseInt(point.valueX) - 1).format('MMM');
      }
      formattedData.x.push(xValue);
      formattedData[point.title] = formattedData[point.title] || [];
      formattedData[point.title].push(point.valueY);
      sum += parseInt(point.valueY);
      zData.push(point.valueZ);
      xData.push(xValue);
      descData.push(point.description);
      tooltipData.push(point.toolTip);
    });
    let columns = [];
    Object.entries(formattedData).map(([key, value]) => {
      columns.push([key, ...value]);
    })
    let chartData = this.state.chartData;
    //Set as 0 by default and "load" columns later for animation
    chartData.data.columns = columns.map((arr) => {
      return arr.map((x) => {
        return parseInt(x) == x ? 0 : x;
      })
    });

    chartData.axis.x.label.text = this.props.xAxis;
    chartData.axis.y.label.text = this.props.yAxis;
    let chart = this.chartRef.current && this.chartRef.current.chart;
    chart && chart.load(chartData);
    //Load actual data for animation
    setTimeout(() => {
      chartData.data.columns = columns
      chart = this.chartRef.current && this.chartRef.current.chart;
      chart && chart.load(chartData.data);
      if (zData.length > 0) {
        setTimeout(() => {
          chartData.data.columns = columns
          chart = this.chartRef.current && this.chartRef.current.chart;
          chart && chart.load(chartData.data);
        }, 500);
      }
    }, 500);

    if (sum <= 0) {
      typeof d3 !== 'undefined' && d3.select(`.${this.id} .c3-chart-texts`).style('transform', 'translate(0, -30px)') // shift up labels
    }
    this.setState({ chartData, zData, xData,tooltipData, descData, isLoaded: true })
  }

  createCustomLabel(v, id, i, j) {
    if (this.state.zData && this.state.zData[i] != null) {
      return `${this.state.zData[i]}`
    }
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    let x = this.state.xData[d[0].x];
    let z = this.state.zData[d[0].x];
    let desc = this.state.descData[d[0].x];
    if (z == "N/A") {
      return;
    }
    let tooltipData = this.state.tooltipData && this.state.tooltipData[d[0].x] || []
    if (tooltipData.length == 0) {
      return ReactDOMServer.renderToString(
        <div className="tooltip subtle-subtext">
          <div>{`${x}${this.props.footer ? this.props.footer : ''}: ${d[0].value}${this.props.unit ? this.props.unit : ''}`}</div>
          {z != null && <div>{`Occurence(s): ${z}`}</div>}
          {desc != null && <div>{`${desc}`}</div>}
        </div>);
    } else {
      return ReactDOMServer.renderToString(
        <div className="tooltip subtle-subtext">
          {tooltipData.map((line) => {
            return <div>{line}</div>
          })}
        </div>);
    }
    
  }

  renderBody(){
    const {body, subTitle,description, noDataMessage} = this.props;
    if (body && subTitle){
      return <div><div className="no-data">{body}</div> <div className="no-data-subtitle">{subTitle}</div></div>
    }
    if (body || description){
      return <div className="display-text normal-text">{body || description}</div>
    }
    return <C3Chart className={this.state.chartID} ref={this.chartRef} {...this.state.chartData} />
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
        <Grid container spacing={0} direction="column" className={`bar-chart ${this.id}`} >
          <Grid item xs className="chart-title header-2">
            {this.props.title}{this.props.toolTip && <LightTooltip interactive arrow title={Array.isArray(this.props.toolTip) ? this.props.toolTip.map((line,index) => { return <div key={index}>{line}</div> }): this.props.toolTip} placement="top" fontSize="small">
              <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
            </LightTooltip>}
          </Grid>
          <Grid item xs={12} className="chart-subtitle subtle-subtext">
            {this.props.subTitle}
          </Grid>
          <Grid item xs>
            {this.renderBody()}
          </Grid>
          <Grid item xs>
            {this.props.url && <NavLink to={this.props.url} className='link normal-text'>
              {this.props.urlText}
            </NavLink>}
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}