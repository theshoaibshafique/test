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
import { BarChart, XAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import globalFuncs from '../../global-functions';

export default class MainDashboard extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      hospital: "St. Michael's Hospital",
      cases: 45,
      hours: 132,
      card1: {
        severePercentage: 99
      },
      card2: {
        caseList: [
          'Cholecystectomy', 'Right Colon Resection', 'Gastric Resection', 'Hartmann\'s Reversal', 'Left Color Resection'
        ],
        hourList: [
          'Low Anterior Resection', 'Right Colon Resection', 'Gastric Resection', 'Small Bowel Resection', 'Left Colon Resection'
        ]
      },
      card3 : {
        type: "Door Opening"
      },
      card4 : {
        people: 6
      },
      hospitalName: 'St. Michael\'s Hospital'
    }
  }

  componentWillMount() {
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
      let card1Value = {...this.state.card1};
      card1Value['severePercentage'] = result.body.Percent;
      this.setState({
        cases: result.body.TotalItems,
        hours: Math.round(result.body.Duration),
        card1: card1Value
      });
    })
  }

  card2Data() {
    globalFuncs.getInsightData(process.env.INSIGHT_API, 'MD_PTA', this.props.usertoken).then((result) => {
      let card2Value = {...this.state.card2};
      card2Value['caseList'] = result.body.TopItem;
      card2Value['hourList'] = result.body.TopItemHour;
      this.setState({
        card2: card2Value
      });
    })
  }

  card3Data() {
    globalFuncs.getInsightData(process.env.DISTRACTIONS_API, 'MD_DI', this.props.usertoken).then((result) => {
      let card3Value = {...this.state.card3};
      card3Value['type'] = result.body.TopItem;
      this.setState({
        card3: card3Value
      });
    })
  }

  card4Data() {
    globalFuncs.getInsightData(process.env.ROOMTRAFFIC_API, 'MD_RTI', this.props.usertoken).then((result) => {
      let card4Value = {...this.state.card4};
      card4Value['people'] = Math.round(result.body.Average);
      this.setState({
        card4: card4Value
      });
    })
  }

  card5Data() {
    globalFuncs.getSurveyData(process.env.CULTURESURVEY_API, 'MD_CSI', this.props.usertoken, this.props.mostRecentSurvey.name).then((result) => {
      console.log(result);
      // let card5Value = {...this.state.card5};
      // card5Value['people'] = Math.round(result.body.Average);
      // this.setState({
      //   card4: card5Value
      // });
    })
  }

  render() {
    const dataBar = [
      {name: '18-29', responses: 40},
      {name: '30-39', responses: 20},
      {name: '40-49', responses: 44},
      {name: '50+', responses: 17}
    ];

    let procedureList1 = this.state.card2.caseList.map((procedure) => {
      return <li key={procedure}>{procedure}</li>
    })

    let procedureList2 = this.state.card2.hourList.map((procedure) => {
      return <li key={procedure}>{procedure}</li>
    })

    return (
      <section className="MAIN-DASHBOARD dashboard-even-height">
        <Helmet>
          <title>SST Insights Dashboard</title>
          <meta name="description" content="SST Insights Dashboard" />
        </Helmet>
        <button onClick={() => this.fetchContainerData()}>Fetch</button>

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
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <h3 className="Card-Header">Procedure Types Analyzed</h3>
                <hr />
                <div className="dark-grey bold smaller">Top 5 procedures(number of cases analyzed)</div>
                <ol>{procedureList1}</ol>
                <div className="dark-grey bold smaller">Top 5 procedures(number of hours analyzed)</div>
                <ol>{procedureList2}</ol>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <Card className="Card">
              <CardContent className="dark-blue">
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
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <h3 className="Card-Header">Room Traffic Insights</h3>
                <hr />
                <div className="dark-grey bold smaller">Average head count</div>
                <ORHeadCount headCount={this.state.card4.people} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <h3 className="Card-Header">Culture Survey Insights</h3>
                <hr />
                <div className="dark-grey bold smaller">Gender</div>
                <SurveyDemographicGeneral
                    questionValue={['MaleIcon', 'FemaleIcon', 'Prefer not to answer', 'Other']}
                    questionPercentage={[33, 48, 17, 2]}
                  />
                <div className="dark-grey bold smaller">Age</div>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={dataBar}>
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="responses" fill="#592d82" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>
    );
  }
}