import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import globalFunctions from '../../../utils/global-functions';
import { NavLink } from 'react-router-dom';
import { LightTooltip } from '../../SharedComponents/SharedComponents';
import LegendPagination from '../../LegendPagination/LegendPagination';
export default class DonutChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    this.id = `donut-chart-${this.props.id}`;
    this.state = {
      chartID: 'donutChart',
      chartData: {
        data: {
          columns: [], //Dynamically populated
          type: 'donut',
          //Specifically for Turnover Outliers
          colors: {
            'Within Threshold': '#97E7B3',
            'Outlier': '#FF7D7D'
          }
        }, // End data
        color: {
          pattern: this.props.pattern || ['#A7E5FD', '#97E7B3', '#FFDB8C', '#FF7D7D', '#CFB9E4', '#50CBFB', '#6EDE95', '#FFC74D', '#FF4D4D', '#A77ECD']
        },

        tooltip: {
          grouped: false,
          contents: (d, defaultTitleFormat, defaultValueFormat, color) => this.createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color)
        },

        padding: { top: 8, bottom: 8 },
        legend: {
          show: false
        },
        donut: {
          label: {
            show: false,
          },
          width: 48,
          title: this.props.subTitle
        },
        size: {
          height: 340,
          // width: 320
        },
        transition: {
          duration: 0
        },
        onrendered: () => this.chartRef.current && this.renderCustomTitle(),
      },
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
    if (dataPoints.length == 0) {
      dataPoints.push({
        "title": "NA",
        "valueX": 1,
      })
    }
    let xData = [];
    let tooltipLegendData = {};
    let tooltipData = {};
    let formattedData = {};

    dataPoints.map((point, index) => {
      let xValue = point.valueX;
      point.title = globalFunctions.getName(this.props.specialties, point.title);

      formattedData[point.title] = point.valueX;
      xData.push(xValue);
      tooltipLegendData[point.title] = point.note ? point.note : tooltipLegendData[point.title];
      tooltipData[point.title] = point.toolTip;
    });
    const orderBy = this.props.orderBy || {};
    let legendData = Object.entries(formattedData).sort((a, b) => { return orderBy[a[0]] - orderBy[b[0]] || b[1] - a[1] });
    let chartData = this.state.chartData;
    //Set as 0 by default and "load" columns later for animation
    chartData.data.columns = legendData;
    let chart = this.chartRef.current && this.chartRef.current.chart;
    chart && chart.load(chartData);
    this.setState({ chartData, xData, tooltipLegendData, tooltipData, legendData, isLoaded: true })
  }

  createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color) {
    if (d[0].id == "NA") {
      return;
    }
    let tooltipData = this.state.tooltipData && this.state.tooltipData[d[0].id] || []
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
  renderLegend() {
    if (!this.chartRef.current) {
      return;
    }
    let chart = this.chartRef.current.chart;
    return (
      <div className={`${this.state.chartID} donut-chart-detailed-legend`}>
        <LegendPagination
          legendData={this.state.legendData}
          itemsPerPage={10}
          chartTitle={this.state.chartData.donut.title}
        >
          {this.state.legendData && this.state.legendData.map(([id, value], index) => {
            if (id == "NA") {
              return;
            }
            return (
              <div className="legend-item subtle-subtext" id={id.replace(/[^A-Z0-9]+/ig, "")}
                onMouseOver={() => {
                  chart && chart.focus(id);
                }}
                onMouseOut={() => {
                  chart && chart.revert();
                }}
                key={index}>
                <div className="legend-title">
                  <span className="circle" style={{ color: chart.color(id) }} /><div style={{ margin: '-4px 0px 0px 4px' }}> {id}</div>
                  {this.state.tooltipLegendData[id] && <LightTooltip interactive arrow title={this.state.tooltipLegendData[id]} placement="top" fontSize="small">
                    <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
                  </LightTooltip>}
                </div>
              </div>)
          })}
        </LegendPagination>
      </div>
    );
  }
  renderCustomTitle() {
    if (!this.chartRef.current) {
      return;
    }
    if (!d3.select(".donut-chart .c3-chart-arcs-title").select('tspan').empty()) {
      return;
    }
    d3.select(".donut-chart .c3-chart-arcs-title")
      .attr("dy", -10)
    d3.select(".donut-chart .c3-chart-arcs-title").attr('class', 'donut-title normal-text')
      .insert("tspan")
      .html(ReactDOMServer.renderToString(<tspan dy={44} x={0} className="second-title">{this.props.total}<tspan className="donut-unit normal-text">{this.props.unit}</tspan></tspan>))

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
        <Grid container spacing={0} className={`donut-chart ${this.id}`} style={{ minHeight: 150 }}>
          <Grid item xs={12} className="chart-title">
            {this.props.title}{this.props.toolTip && <LightTooltip interactive arrow placement="top" fontSize="small"
              title={Array.isArray(this.props.toolTip) ? this.props.toolTip.map((line,index) => { return <div key={index}>{line}</div> }) : this.props.toolTip}
            >
              <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
            </LightTooltip>}
          </Grid>
          <Grid item xs={8} >
            <C3Chart ref={this.chartRef} {...this.state.chartData} />
          </Grid>
          <Grid item xs={4} className={this.state.chartID}>
            {this.renderLegend()}
          </Grid>
          {this.props.url && <Grid item xs={12} style={{ textAlign: 'center' }}>
            <NavLink to={this.props.url} className='link'>
              {this.props.urlText}
            </NavLink>
          </Grid>}
        </Grid>
      </LoadingOverlay>
    );
  }
}