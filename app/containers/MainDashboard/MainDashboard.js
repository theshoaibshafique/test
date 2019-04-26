/*
 * Distractions Page
 *
 */

import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';
import Hallway from './img/hallway.jpg';
import InsightDate from 'components/InsightDate';
import ORHeadCount from 'components/ORHeadCount';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SurveyDemographicGeneral from 'components/SurveyDemographicGeneral';
import GenericCard from 'components/GenericCard';
import { BarChart, XAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import globalFuncs from '../../global-functions';

export default class MainDashboard extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      cases: null,
      hours: null,
      card1: {
        severePercentage: null,
        dataReceived: false
      },
      card2: {
        caseList: null,
        caseListLength: null,
        hourList: null,
        hourListLength: null
      },
      card3 : {
        type: null
      },
      card4 : {
        people: null
      },
      card5: {
        dataReceived: false
      },
      hospitalName: 'St. Michael\'s Hospital'
    }
  }

  componentWillMount() {
    if (this.props.userLoggedIn)
      this.fetchContainerData();
  }

  fetchContainerData() {
    this.card1Data();
    this.card2Data();
    this.card3Data();
    this.card4Data();
    this.card5Data();
  }

  card1Data() {
    globalFuncs.getInsightData(process.env.INSIGHT_API, 'MD_PWSIAE', this.props.usertoken).then((result) => {
      let cardValue = {...this.state.card1};
      cardValue['severePercentage'] = result.body.Percent;
      cardValue['dataReceived'] = true;
      this.setState({
        cases: result.body.TotalItems,
        hours: Math.round(result.body.Duration),
        card1: cardValue,
      });
    })
  }

  card2Data() {
    globalFuncs.getInsightData(process.env.INSIGHT_API, 'MD_PTA', this.props.usertoken).then((result) => {
      let cardValue = {...this.state.card2};
      cardValue['caseList'] = result.body.TopItem;
      cardValue['caseListLength'] = result.body.TopItemHour.length;
      cardValue['hourList'] = result.body.TopItemHour;
      cardValue['hourListLength'] = result.body.TopItemHour.length;
      cardValue['dataReceived'] = true;

      this.setState({
        card2: cardValue
      });
    })
  }

  card3Data() {
    globalFuncs.getInsightData(process.env.DISTRACTIONS_API, 'MD_DI', this.props.usertoken).then((result) => {
      let cardValue = {...this.state.card3};
      cardValue['type'] = result.body.TopItem;
      cardValue['dataReceived'] = true;

      this.setState({
        card3: cardValue
      });
    })
  }

  card4Data() {
    globalFuncs.getInsightData(process.env.ROOMTRAFFIC_API, 'MD_RTI', this.props.usertoken).then((result) => {
      let cardValue = {...this.state.card4};
      cardValue['people'] = Math.round(result.body.Average);
      cardValue['dataReceived'] = true;

      this.setState({
        card4: cardValue
      });
    })
  }

  card5Data() {
    globalFuncs.getSurveyData(process.env.CULTURESURVEY_API, 'MD_CSI', this.props.usertoken, this.props.mostRecentSurvey.name).then((result) => {
    //globalFuncs.getSurveyData(process.env.CULTURESURVEY_API, 'MD_CSI', this.props.usertoken, '94ae1368-badb-41a1-a1f6-68225b8a6c57').then((result) => {
      console.log(result);
      let cardValue = {...this.state.card5};
      if (result.body.Answers.length > 0)
        cardValue['dataReceived'] = true;
      cardValue['data'] = globalFuncs.mapValuesToProperties(result.body.AllGenderValues, result.body.Answers, 'count');
      cardValue['data2'] = globalFuncs.mapValuesToProperties(result.body.AllAgeValues, result.body.Answers2, 'count')
      this.setState({
        card5: cardValue
      });
    })
  }

  render() {
    const dataBar = [
      {name: '18-29', responses: 40},
      {name: '30-39', responses: 20},
      {name: '40-49', responses: 44},
      {name: '50+', responses: 17}
    ];

    let procedureByCase;
    if(this.state.card2.caseList) {
      procedureByCase = this.state.card2.caseList.map((procedure) => {
        return <li key={procedure}>{procedure}</li>
      })
    }

    let procedureByHours;
    if(this.state.card2.hourList)  {
      procedureByHours = this.state.card2.hourList.map((procedure) => {
        return <li key={procedure}>{procedure}</li>
      })
    }


    return (
      <section className="MAIN-DASHBOARD dashboard-even-height">
        <Helmet>
          <title>SST Insights Dashboard</title>
          <meta name="description" content="SST Insights Dashboard" />
        </Helmet>
        <Grid container spacing={24} className="Main-Dashboard-Header">
          <Grid item xs={9} className="Dashboard-Welcome dark-blue">
            <h3 className="larger">Hello, {this.state.hospitalName}</h3>
            <h4 className="large">Here's what's going on at your OR Black Box Sites</h4>
          </Grid>
          <Grid item xs={3} className="flex right-center">
            <InsightDate
              quarter={1}
              year={2019}
            />
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={6}>
              <Card className="Card">
                <CardContent className="dark-blue">
                  <GenericCard userLoggedIn={this.props.userLoggedIn} dataReceived={this.state.card1.dataReceived}>
                    <h3 className="Card-Header">Procedures Analyzed Without Severe Intraoperative Adverse Events</h3>
                    <hr />
                    <Grid container spacing={24}>
                      <Grid item xs={6}>
                        <div className="dark-grey bold smaller">{this.state.cases} cases captured</div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className="right-align dark-grey bold smaller">{this.state.hours} hours captured</div>
                      </Grid>
                    </Grid>
                    <div className={`pie-wrapper progress style-2 progress-` + this.state.card1.severePercentage}>
                      <span className="label">{this.state.card1.severePercentage}<span >%</span></span>
                      <div className="pie">
                        <div className="left-side half-circle"></div>
                        <div className="right-side half-circle"></div>
                      </div>
                      <div className="shadow"></div>
                    </div>
                  </GenericCard>
                </CardContent>
              </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <GenericCard userLoggedIn={this.props.userLoggedIn} dataReceived={this.state.card2.dataReceived}>
                  <h3 className="Card-Header">Procedure Types Analyzed</h3>
                  <hr />
                  <div className="dark-grey bold smaller">Top {this.state.card2.caseListLength} procedures(number of cases analyzed)</div>
                  <ol>{procedureByCase}</ol>
                  <div className="dark-grey bold smaller">Top {this.state.card2.hourListLength} procedures(number of hours analyzed)</div>
                  <ol>{procedureByHours}</ol>
                </GenericCard>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <GenericCard userLoggedIn={this.props.userLoggedIn} dataReceived={this.state.card3.dataReceived}>
                  <h3 className="Card-Header">Distractions Insights</h3>
                  <hr />
                  <div className="dark-grey bold smaller">Category of distractions</div>
                  <div className="Card-Content-Wrapper center-align">
                    <img src={Hallway} style={{marginTop: '25px', width: '100px'}}/>
                    <h1 className="purple">{this.state.card3.type}</h1>
                    <div className="small-text dark-grey">
                      is the category with the highest number of distractions per minute
                    </div>
                  </div>
                </GenericCard>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <GenericCard userLoggedIn={this.props.userLoggedIn} dataReceived={this.state.card4.dataReceived}>
                  <h3 className="Card-Header">Room Traffic Insights</h3>
                  <hr />
                  <div className="dark-grey bold smaller">Average head count</div>
                  <ORHeadCount headCount={this.state.card4.people} />
                </GenericCard>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <GenericCard userLoggedIn={this.props.userLoggedIn} dataReceived={this.state.card5.dataReceived}>
                  <h3 className="Card-Header">Culture Survey Insights</h3>
                  <hr />
                  <div className="dark-grey bold smaller">Gender</div>
                  <SurveyDemographicGeneral
                    data={this.state.card5.data}
                  />
                  <div className="dark-grey bold smaller">Age</div>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={this.state.card5.data2}>
                      <XAxis dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="responses" fill="#592d82" />
                    </BarChart>
                  </ResponsiveContainer>
                </GenericCard>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>
    );
  }
}