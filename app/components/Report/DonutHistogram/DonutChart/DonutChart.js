import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
import moment from 'moment/moment';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
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
export default class DonutChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
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
          width: 16,
          // title: this.props.subTitle
        },
        size: {
          height: 225,
          width: 225
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
    const { total, body } = this.props;

    let columns = [];
    columns = [[this.props.title, total], ["other", 100 - total]]
    let chartData = this.state.chartData;
    chartData.data.columns = columns;

    let chart = this.chartRef.current && this.chartRef.current.chart;
    chart && chart.load(chartData);
    this.setState({ chartData, isLoaded: true })
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
      <div className="MuiTooltip-tooltip tooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>
        {tooltipData.map((line) => {
          return <div>{line}</div>
        })}
      </div>);
  }
  wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = 0, //parseFloat(text.attr("dy")),
        tspan = text.text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }
  renderCustomTitle() {
    if (!this.chartRef.current) {
      return;
    }
    if (!d3.select(".sub-donut-chart .c3-chart-arcs-title").select('tspan').empty()) {
      return;
    }

    d3.select(".sub-donut-chart .c3-chart-arcs-title")
      .attr("y", -10)
    d3.select(".sub-donut-chart .c3-chart-arcs-title").attr('class', 'donut-title')
      // .insert("tspan")
      .html(ReactDOMServer.renderToString(
        <tspan>
          {this.props.total == null ? (
            <tspan dy={10} x={0} className="donut-score">N/A</tspan>
          ) :
            (
              <tspan dy={10} x={0} className="donut-score">{this.props.total || 0}<tspan className="donut-unit" dy={-10} baselineShift="super">{this.props.unit || "%"}</tspan></tspan>
            )}

        {/* <tspan dy={30} x={0} className="donut-subtitle">{this.props.body}</tspan> */}
        </tspan>
      )).append("tspan").attr("y", 22).attr('x',0).attr('class','donut-subtitle').text(this.props.body).call(this.wrap,110)
  }
  render() {
    return (
      <Grid container spacing={0} className={`sub-donut-chart ${this.id}`} direction="column">
        <Grid item xs className="donut">
          <C3Chart ref={this.chartRef} {...this.state.chartData} />
        </Grid>
      </Grid>
    );
  }
}