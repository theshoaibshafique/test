import React from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import './style.scss';
import ReactDOMServer from 'react-dom/server';
import { Grid, Divider, CardContent, Card } from '@material-ui/core';
import MonthPicker from '../../components/MonthPicker/MonthPicker';
import moment from 'moment/moment';
import UniversalPicker from '../../components/UniversalPicker/UniversalPicker';
import ReportScore from './ReportScore/ReportScore';


export default class EMMCases extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      month: moment()
    }

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
      },
      point: {
        show: false
      },
      axis: {
        x: {
          label: {
            text: 'What',
            position: 'outer-center'
          }
        },
        y: {
          label: {
            text: 'Who',
            position: 'outer-middle'
          }
        }
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
      onrendered: () => this.createCustomLegend('.piechart'),
    }

  }

  createCustomLegend(chartClass) {
    if (!this.refs.myChart || !d3.select('.piechart').select('.legend').empty()) {
      return;
    }
    let chart = this.refs.myChart.chart;
    d3.select(chartClass).insert('div').attr('class', 'legend')
      .html(ReactDOMServer.renderToString(
        <Grid container spacing={0} justify="center">
          {['data1', 'data2', 'data3'].map((id, index) => {
            return (
              <Grid item xs={1} key={index} style={{ backgroundColor: chart.color(id) }}>
                {id}
              </Grid>)
          })}
        </Grid>
      ));

  }


  componentDidMount() {

  };

  updateMonth(month) {
    this.setState({
      month: month,
      // isLoading: true
    }, () => {
      // this.setTileRequestDates();
    });
  }

  loadFilter() {
    if (localStorage.getItem('sscFilter-' + this.props.userEmail)) {
      const recentSearchCache = JSON.parse(localStorage.getItem('sscFilter-' + this.props.userEmail));
      this.setState({ ...recentSearchCache });
    }
  }

  saveFilter() {
    localStorage.setItem('sscFilter-' + this.props.userEmail,
      JSON.stringify({
        month: this.state.month,
        
      }));
  }

  redirect(requestId) {
    this.props.pushUrl('/emm/' + requestId);
  }

  render() {
    return (
      <div className="ssc-page">
        <Grid container spacing={0} className="ssc-picker-container" >
          <Grid item xs={12} className="ssc-picker">
            <div style={{ maxWidth: 800, margin: 'auto' }}><MonthPicker month={this.state.month} updateMonth={(month) => this.updateMonth(month)} /></div>
          </Grid>
          <Grid item xs={12}>
            <Divider className="ssc-divider" />
          </Grid>
          <Grid item xs={12} className="ssc-picker">
            <UniversalPicker specialties={this.props.specialties} userFacility={this.props.userFacility} userToken={this.props.userToken} />
          </Grid>
          <Grid item xs={12}>
            <Divider className="ssc-divider" />
          </Grid>
        </Grid>
        <Grid container spacing={3} className="ssc-main">
          <Grid item xs={4} >
            <Card className="ssc-card">
              <CardContent>
                <ReportScore
                  pushUrl={this.props.pushUrl}
                  title="Checklist Score"
                  redirectDisplay="View Checklist Details"
                  redirectLink="/checklistScore"
                  score="70"
                  tooltipText="Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted." />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} >
            <Card className="ssc-card">
              <CardContent>
                <ReportScore
                  pushUrl={this.props.pushUrl}
                  title="Engagement Score"
                  redirectDisplay="View Engagement Details"
                  redirectLink="/engagementScore"
                  score="52"
                  tooltipText="Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted." />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} >
            <Card className="ssc-card">
              <CardContent>
                <ReportScore
                  pushUrl={this.props.pushUrl}
                  title="Quality Score"
                  redirectDisplay="View Quality Details"
                  redirectLink="/qualityScore"
                  score="58"
                  tooltipText="Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted." />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} style={{ paddingTop: 0 }}>
            <span className="ssc-info">Each score above is out of 100 based on current month’s data</span>
          </Grid>
          <Grid item xs={8}>
            <Card className="ssc-card">
              <CardContent>
                <C3Chart {...this.barData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} >
            <Card className="ssc-card">
              <CardContent>
                <C3Chart className="piechart" ref="myChart" {...this.pieData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}