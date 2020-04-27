import React from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import './style.scss';
import ReactDOMServer from 'react-dom/server';
import globalFuncs from '../../utils/global-functions';
import { GENERAL_SURGERY, UROLOGY, GYNECOLOGY, PLASTIC_SURGERY, ORTHOPAEDICS, VASCULAR_SURGERY, ENT, COMPLICATIONS } from '../../constants';
import { Grid } from '@material-ui/core';

export default class EMMCases extends React.PureComponent {
  constructor(props) {
    super(props);
    this.barData = {
      data: {
        columns: [
          ['data1', 30, 20, 50, 40, 60],
          ['data2', 200, 130, 90, 240, 130],
          ['data3', 300, 200, 160, 400, 250],
          ['data4', 176, 116, 90, 100, 146]
        ],
        type: 'bar',
        colors: {
          data1: '#A7E5FD',
          data2: '#97E7B3',
          data3: '#CFB9E4'
        },
        types: {
          data4: 'line'
        },
        color: function (color, d) {
          // d will be 'id' when called for legends
          // return d.id && d.id === 'data3' ? d3.rgb(color).darker(d.value / 150) : color;
          return color;
        },
      }, // End data
      bar: {
        width: {
          ratio: 0.9
        },
        space: .2
      },
      tooltip: {
        contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
          return ReactDOMServer.renderToString(<h1 className="wow" style={{ color: 'blue', backgroundColor: 'white' }}>This is a Blue Heading</h1>);
        }
      },
      onrendered: () => {
        // d3.select here
      }
    }

    this.pieData = {
      data: {
        columns: [
          ['data1', 100],
          ['data2', 300],
          ['data3', 200]
        ],
        type: 'pie'
      },
      legend: {
        show: false
      },
      onrendered: () => this.createCustomLegend('.piechart')
    }

  }

  createCustomLegend(chartClass) {    
    if (!this.refs.myChart || !d3.select('.piechart').select('.legend').empty()){
      return;
    }
    let chart = this.refs.myChart.chart;
    // d3.select(chartClass).insert('div').attr('class', 'legend').selectAll('div')
    //     .data(['data1', 'data2', 'data3'])
    //     .enter().append('div')
    //     .attr('data-id', function (id) { return id; })
    //     .html(function (id) { return id; })
    //     .each(function (id) {
    //       d3.select(this).style('background-color', chart.color(id));
    //       d3.select(this).html(ReactDOMServer.renderToString(<h1 className="wow" style={{ color: 'blue', backgroundColor: 'white' }}>{id}</h1>))
    //     })
    //     .on('mouseover', function (id) {
    //       chart.focus(id);
    //     })
    //     .on('mouseout', function (id) {
    //       chart.revert();
    //     });
    d3.select(chartClass).insert('div').attr('class', 'legend')
    .html(ReactDOMServer.renderToString(
    <Grid container spacing={0} justify="center">
      {['data1', 'data2', 'data3'].map((id,index) => {
        return (
        <Grid item xs={1} key={index} style={{backgroundColor:chart.color(id)}}>
          {id}
        </Grid>)
      })}
    </Grid>
    ));

  }

  
  componentDidMount() {

  };

  redirect(requestId) {
    this.props.pushUrl('/emm/' + requestId);
  }

  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <C3Chart {...this.barData} />
        </Grid>
        <Grid item xs={6}>
          <C3Chart className="piechart" ref="myChart" {...this.pieData} />
        </Grid>
      </Grid>
    );
  }
}