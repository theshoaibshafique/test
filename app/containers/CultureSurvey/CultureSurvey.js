/*
 * Culture Survey Page
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';
import SurveyFilter from 'components/SurveyFilter';
import GenericCard from 'components/GenericCard';
import NoDataCard from 'components/NoDataCard';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { AreaChart, Area, CartesianGrid, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import globalFuncs from '../../global-functions';

export default class CultureSurvey extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      selectedSurvey : Object.keys(this.props.publishedSurveys)[0],
      card1: {
        totalSurveys: null,
        totalResponded: null,
        noValues: false
      },
      card2: {
        data : [
          {name: '18-29', responses: 0},
          {name: '30-39', responses: 0},
          {name: '40-49', responses: 0},
          {name: '50+', responses: 0}
        ],
        noValues: false
      },
      card3: {
        data : [
          {name: 'Disagree Strongly', responses: 0},
          {name: 'Disagree', responses: 0},
          {name: 'Neutral', responses: 0},
          {name: 'Agree', responses: 0},
          {name: 'Agree Strongly', responses: 0},
        ],
        noValues: false
      },
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
  }

  card1Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DCS_MOE', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card1};
      cardValue['totalSurveys'] = result.body.SentSurveys;
      cardValue['totalResponded'] = result.body.CompleteSurveys;
      cardValue['noValues'] = (result.body.SentSurveys == 0);

      this.setState({
        card1: cardValue
      });
    })
  }

  card2Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DCS_DD', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card2};
      cardValue['data'] = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'count')
      cardValue['noValues'] = (result.body.TotalAnswers == 0);

      this.setState({
        card2: cardValue
      })
    })
  }

  card3Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DCS_QR', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card3};
      cardValue['data'] = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'count')
      cardValue['noValues'] = (result.body.TotalAnswers == 0);

      this.setState({
        card3: cardValue
      })
    })
  }

  surveyChange(e) {
    this.setState({
      selectedSurvey: e.target.value
    }, () => {
      this.fetchContainerData();
    })
  }


  render() {
    let card1Content;
    if (!this.state.card1.noValues) {
      card1Content =  <div className="center-align larger">
                        Survey sent to {this.state.card1.totalSurveys} individuals <br />
                        <span className="highlight purple bold">{Math.round(this.state.card1.totalResponded / this.state.card1.totalSurveys * 100)}% response rate</span> <br />
                        ({this.state.card1.totalResponded} respondents)
                      </div>
    } else {
      card1Content = <NoDataCard />
    }

    let card2Content;
    if (!this.state.card2.noValues) {
      card2Content =  <div>
                        <div className="dark-grey bold smaller">Age of Respondents</div>
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={this.state.card2.data}>
                            <XAxis dataKey="name" />
                            <Tooltip />
                            <Bar dataKey="responses" fill="#592d82" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
    } else {
      card2Content = <NoDataCard />
    }

    let card3Content;
    if (!this.state.card3.noValues) {
      card3Content =  <div>
                        <div className="dark-grey bold smaller">4 procedure types</div>
                        <h3 className="dark-blue larger bold center-align">Medical errors are handled appropriately in the OR.</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={this.state.card3.data}>
                            <XAxis dataKey="name" interval={0} />
                            <YAxis tick={false}/>
                            <CartesianGrid vertical horizontal={false} />
                            <Area dataKey="responses" stroke="#592d82" fill="#592d82" fillOpacity={1} />
                            <Tooltip />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
    } else {
      card3Content = <NoDataCard />
    }

    return (
      <section className="Culture-Survey dashboard-even-height">
        <Helmet>
          <title>Distractions</title>
          <meta name="description" content="SST Insights" />
        </Helmet>
        <Grid container spacing={24} className="Main-Dashboard-Header">
          <Grid item xs={6} className="Dashboard-Welcome dark-blue">
          </Grid>
          <Grid item xs={6} className="flex right-center">
            <SurveyFilter
              selectedSurvey={this.state.selectedSurvey}
              surveyList={this.props.publishedSurveys}
              surveyChange={(e)=>this.surveyChange(e)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <GenericCard userLoggedIn={this.props.userLoggedIn}>
                  <h3 className="Card-Header">Measure of Engagement</h3>
                  <hr />
                  <Grid container spacing={0}>
                    <Grid item xs={12} className="flex vertical-center" style={{height: '250px'}}>
                      {card1Content}
                    </Grid>
                  </Grid>
                </GenericCard>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <GenericCard userLoggedIn={this.props.userLoggedIn}>
                  <h3 className="Card-Header">Demographic Diversity</h3>
                  <hr />
                  <Grid container spacing={0} className="full-height">
                    <Grid item xs={12}>
                      {card2Content}
                    </Grid>
                  </Grid>
                </GenericCard>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <GenericCard userLoggedIn={this.props.userLoggedIn}>
                  <h3 className="Card-Header">Question Results</h3>
                  <hr />
                  <Grid container spacing={0} className="full-height">
                    <Grid item xs={12}>
                      {card3Content}
                    </Grid>
                  </Grid>
                </GenericCard>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>
    );
  }
}