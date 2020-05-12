import React from 'react';
import { Grid } from '@material-ui/core';
import C3Chart from 'react-c3js';
import ReactDOMServer from 'react-dom/server';
import './style.scss';

export default class BarChartDetail extends React.PureComponent {
  constructor(props) {
    super(props);

    this.barData = {
      data: {
        x: 'x',
        columns: [
          ['x', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
          ['Compliance Score', 30, 20, 50, 40, 60],
          ['Engagement Score', 10, 40, 60, 25, 45],
          ['Quality Score', 50, 60, 70, 65, 55],
          ['Average', 15, 25, 45, 65, 55]
        ],
        // groups:['data1','data2','data3','data4'],
        type: 'bar',
        colors: {
          'Compliance Score': '#A7E5FD',
          'Engagement Score': '#97E7B3',
          'Quality Score': '#CFB9E4'
        },
        types: {
          'Average': 'line'
        },
        color: function (color, d) {
          // d will be 'id' when called for legends
          // return d.id && d.id === 'data3' ? d3.rgb(color).darker(d.value / 150) : color;
          return color;
        },
      }, // End data
      bar: {
        // width: {
        //   ratio: 0.9
        // },
        width:30,
        space: .2
      },
      tooltip: {
        grouped: false,
        contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
          return ReactDOMServer.renderToString(<div className="MuiTooltip-tooltip" style={{ fontSize: '14px', lineHeight: '19px', font: 'Noto Sans' }}>{`${d[0].id}:${d[0].value}`}</div>);
        }
      },
      onrendered: () => {
        // d3.select here
      },
      point: {
        // show: false
      },
      axis: {
        x: {
          label: {
            text: 'Month',
            position: 'outer-center'
          },
          type: 'category',
          
        },
        y: {
          label: {
            text: 'Score (%)',
            position: 'outer-middle'
          },
          max: 100,
          min: 0,
          padding: { top: 0, bottom: 0 },
          tick: {
            count:6
          }
        }
      },
      legend: {
        show: false
      },
      onrendered: () => this.createCustomLegend('.barchart'),
      grid: {
        y: {
          // show: true
        }
      }
    }

  };

  createCustomLegend(chartClass) {
    if (!this.refs.myChart || !d3.select(chartClass).select('.legend').empty()) {
      return;
    }
    let chart = this.refs.myChart.chart;
    d3.select(chartClass).insert('div').attr('class', 'legend')
      .html(ReactDOMServer.renderToString(
        <Grid container spacing={0} justify="center" style={{textAlign:'center'}}>
          {['Compliance Score', 'Engagement Score', 'Quality Score'].map((id, index) => {
            return (
              <Grid item xs={4} key={index} style={{ display: 'flex', margin:'auto', justifyContent:'center'}}>
                <span className="circle" style={{ color: chart.color(id) }} /><div style={{ margin: '-4px 0px 0px 4px' }}> {id}</div>
              </Grid>)
          })}
        </Grid>
      ));

  }



  render() {
    return (
      <Grid container spacing={0} justify='center' style={{ textAlign: 'center',marginBottom:24 }}>
        <Grid item xs={12}>
          <span className="chart-title">Monthly Trend</span>
        </Grid>

        <Grid item xs={12}>
          <C3Chart className="barchart" ref="myChart" {...this.barData} />
        </Grid>

      </Grid>
    );
  }
}