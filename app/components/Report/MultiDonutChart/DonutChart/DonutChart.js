import React from 'react';
import { Grid } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LightTooltip } from '../../../SharedComponents/SharedComponents';

export default class DonutChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = this.props.chartRef;
    this.id = `sub-donut-chart-${this.props.id}`;
    this.state = {
      chartID: 'sub-donut-chart',
      chartData: {
        data: {
          columns: [], //Dynamically populated
          type: 'donut',
          colors: this.props.colors,
          order: null,
        }, // End data
        // interaction: {
        //   enabled: false
        // },
        color: {
          pattern: this.props.pattern || ['#A7E5FD', '#97E7B3', , '#FFDB8C', '#FF7D7D', '#CFB9E4', '#50CBFB', '#6EDE95', '#FFC74D', '#FF4D4D', '#A77ECD']
        },

        tooltip: {
          show:false,
          grouped: false,
        },

        padding: { top: 8, bottom: 8 },
        legend: {
          show: false
        },
        donut: {
          label: {
            show: false,
          },
          width: 16,
          // title: this.props.subTitle
        },
        size: {
          height: 215,
          width: 215
        },
        transition: {
          duration: 0
        },
        onrendered: () => this.chartRef.current && this.renderCustomTitle(),
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
    const { valueX, chartTitle } = this.props;

    let columns = [];
    if (valueX == null) {
      columns = [['other', 100]];
    } else if (chartTitle == "Phase Completion") {
      columns = [[this.props.subTitle, valueX], ["other", 100 - valueX]]
    } else {
      columns = [[this.props.subTitle, valueX], ["Incorrect Timing", 100 - valueX]]
    }
    let chartData = this.state.chartData;
    chartData.data.columns = columns;

    let chart = this.chartRef.current && this.chartRef.current.chart;
    chart && chart.load(chartData);
    this.setState({ chartData, isLoaded: true })
  }

  renderCustomTitle() {
    if (!this.chartRef.current) {
      return;
    }
    if (!d3.select(".sub-donut-chart .c3-chart-arcs-title").select('tspan').empty()) {
      return;
    }
    d3.select(".sub-donut-chart .c3-chart-arcs-title")
      .attr("dy", -10)
    d3.select(".sub-donut-chart .c3-chart-arcs-title").attr('class', 'donut-title normal-text')
      .insert("tspan")
      .html(ReactDOMServer.renderToString(
        <tspan>
          {this.props.valueX == null ? (
            <tspan dy={10} x={0} className="donut-score">N/A</tspan>
          ) :
            (
              <tspan dy={10} x={0} className="donut-score">{this.props.valueX || 0}<tspan className="donut-unit subtle-subtext" dy={-10} baselineShift="super">{this.props.unit || "%"}</tspan></tspan>
            )}

          <tspan dy={30} x={0} className="donut-subtitle subtle-subtext">{this.props.subTitle}</tspan>
        </tspan>
      ))

  }
  render() {
    return (
      <Grid container spacing={0} className={`sub-donut-chart ${this.id}`} direction="column">
        <Grid item xs className="donut-title">
          {this.props.title}{this.props.toolTip && <LightTooltip interactive arrow placement="top" fontSize="small"
            title={Array.isArray(this.props.toolTip) ? this.props.toolTip.map((line) => { return <div>{line}</div> }) : this.props.toolTip}
          >
            <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
          </LightTooltip>}
        </Grid>
        <Grid item xs className="donut">
          <C3Chart ref={this.props.chartRef} {...this.state.chartData} />
        </Grid>
      </Grid>
    );
  }
}