import React from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import './style.scss';
import ReactDOMServer from 'react-dom/server';
import globalFuncs from '../../utils/global-functions';
import { Grid, Divider, CardContent, Card } from '@material-ui/core';
import MonthPicker from '../../components/MonthPicker/MonthPicker';
import moment from 'moment/moment';
import UniversalPicker from '../../components/UniversalPicker/UniversalPicker';
import ReportScore from '../../components/Report/ReportScore/ReportScore';
import globalFunctions from '../../utils/global-functions';
import HorizontalBarChart from '../../components/Report/HorizontalBarChart/HorizantalBarChart';

export default class EMMCases extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      month: moment()
    }

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
        width: {
          ratio: 0.9
        },
        space: .3
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
        show: false
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



  }

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


  componentDidMount() {
    this.setLayout();
  };

  setLayout() {
    globalFunctions.genericFetch(process.env.SSC_API, 'get', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {

        } else if (result) {
          if (result.tileRequest && result.tileRequest.length > 0) {

          } else {
            //report does not exist
          }
        } else {

        }
      });
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
                  title="Compliance Score"
                  redirectDisplay="View Compliance Details"
                  redirectLink="/complianceScore"
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
          <Grid item xs={8}>
            <Card className="ssc-card">
              <CardContent>
                <C3Chart className="barchart" ref="myChart" {...this.barData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} >
            <Card className="ssc-card">
              <CardContent>
                <HorizontalBarChart />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <span className="ssc-info"><span style={{ fontWeight: 'bold' }}>1,000</span> Case Data based on filter criteria</span>
          </Grid>
        </Grid>
      </div>
    );
  }
}