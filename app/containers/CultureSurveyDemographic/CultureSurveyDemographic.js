/*
 * Distractions Page
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';
import SurveyFilter from 'components/SurveyFilter';
import GenericCard from 'components/GenericCard';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SurveyDemographicGeneral from 'components/SurveyDemographicGeneral';
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import BubbleChart from '../../components/DemographicBubbleChart/DemographicBubbleChart';
import globalFuncs from '../../global-functions';

export default class CultureSurveyDemographic extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      selectedSurvey : Object.keys(this.props.publishedSurveys)[0],
      card1: { data: [] },
      card2: { data: [] },
      card3: { data: [] },
      card4: { data: [] },
      card5: { data: [] },
      card6: { data: [] },
      card7: { data: [] }
    }
  }

  surveyChange(e) {
    this.setState({
      selectedSurvey: e.target.value
    }, () => {
      this.fetchContainerData();
    })
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
    this.card6Data();
    this.card7Data();
  }

  card1Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DCSD_G', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card1};
      cardValue['data'] = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'percentAnswer')
      this.setState({
        card1: cardValue
      });
    })
  }

  card2Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DCSD_HPR', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card2};
      cardValue['data'] = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'count')
      this.setState({
        card2: cardValue
      });
    })
  }

  card3Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DCSD_DITORWOBBFTP30D', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card3};
      cardValue['data'] = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'count')
      this.setState({
        card3: cardValue
      });
    })
  }

  card4Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DCSD_HYHPIIAPC', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card4};
      cardValue['data'] = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'percentAnswer')
      this.setState({
        card4: cardValue
      });
    })
  }

  card5Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DCSD_A', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card5};
      cardValue['data'] = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'count')
      this.setState({
        card5: cardValue
      });
    })
  }

  card6Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DCSD_HYHPEWTOBBIAH', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card6};
      cardValue['data'] = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'percentAnswer')
      this.setState({
        card6: cardValue
      });
    })
  }

  card7Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DCSD_HYHPIIAPL', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card7};
      cardValue['data'] = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'percentAnswer')
      this.setState({
        card7: cardValue
      });
    })
  }

  render() {
    return (
      <section className="Culture-Survey-Demographic">
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
                <h3 className="Card-Header">Demographic</h3>
                <hr />
                <Grid container spacing={0}>
                  {/* left column */}
                  <Grid item xs={6}>
                      <h3 className="center-align">Gender</h3>
                      <SurveyDemographicGeneral
                        data={this.state.card1.data}
                      />

                      <h3 className="center-align">Healthcare provider role</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={this.state.card2.data} layout="vertical" margin={{left:20}}>
                          <YAxis dataKey="name" type="category"/>
                          <XAxis type="responses" />
                          <Tooltip />
                          <Bar dataKey="responses" fill="#592d82" />
                        </BarChart>
                      </ResponsiveContainer>

                      <h3 className="center-align">Days in the Operating Room with OR BlackBox<sup>&reg;</sup> for the past 30 days</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={this.state.card3.data}>
                          <XAxis dataKey="name" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="responses" fill="#592d82" />
                        </BarChart>
                      </ResponsiveContainer>

                      <h3 className="center-align">Have you had previous involvement in a patient complaint?</h3>
                      <SurveyDemographicGeneral
                        data={this.state.card4.data}
                      />
                  </Grid>
                  {/* right columns */}
                  <Grid item xs={6}>
                    <h3 className="center-align">Age</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={this.state.card5.data}>
                        <XAxis dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="responses" fill="#592d82" />
                      </BarChart>
                    </ResponsiveContainer>
{/*
                    <h3 className="center-align">Years of experience in current role</h3>
                    <BubbleChart /> */}

                    <h3 className="center-align">Have you had previous experience with the OR Black Box<sup>&reg;</sup> in another hospital?</h3>
                    <SurveyDemographicGeneral
                      data={this.state.card6.data}
                    />

                    <h3 className="center-align">Have you had previous involvement in a patient lawsuit?</h3>
                    <SurveyDemographicGeneral
                      data={this.state.card7.data}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

          </Grid>
        </Grid>
      </section>
    );
  }
}