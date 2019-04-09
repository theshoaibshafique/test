/*
 * Distractions Page
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';
import InsightDate from 'components/InsightDate';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SurveyDemographicGeneral from 'components/SurveyDemographicGeneral';
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import BubbleChart from '../../components/DemographicBubbleChart/DemographicBubbleChart';

export default class CultureSurveyDemographic extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  render() {
    const healthCareProvider = [
      {name: 'Nurse', number: 35},
      {name: 'Nursing student', number: 13},
      {name: 'Staff Anes.', number: 3},
      {name: 'Anes. fellow', number: 6},
      {name: 'Staff Surgeon', number: 12},
      {name: 'Surgical fellow', number: 11},
      {name: 'Surgical Resident', number: 1},
      {name: 'Medial Student', number: 14}
    ];

    const daysInOR = [
      {name: '0 days', number: 12},
      {name: '1-5 days', number: 25},
      {name: '6-10 days', number: 30},
      {name: '11-20 days', number: 5},
      {name: '20-30 days', number: 3}
    ];

    const age = [
      {age: '18-29', number: 12},
      {age: '30-39', number: 40},
      {age: '40-49', number: 17},
      {age: '50+', number: 33},
    ];

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
            <InsightDate
              quarter={1}
              year={2019}
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
                        questionValue={['MaleIcon', 'FemaleIcon', 'Prefer not to answer', 'Other']}
                        questionPercentage={[33, 48, 17, 2]}
                      />

                      <h3 className="center-align">Healthcare provider role</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={healthCareProvider} layout="vertical" margin={{left:20}}>
                          <YAxis dataKey="name" type="category"/>
                          <XAxis type="number" />
                          <Tooltip />
                          <Bar dataKey="number" fill="#592d82" />
                        </BarChart>
                      </ResponsiveContainer>

                      <h3 className="center-align">Days in the Operating Room with OR BlackBox<sup>&reg;</sup> for the past 30 days</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={daysInOR}>
                          <XAxis dataKey="name" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="number" fill="#592d82" />
                        </BarChart>
                      </ResponsiveContainer>

                      <h3 className="center-align">Have you had previous involvement in a patient complaint?</h3>
                      <SurveyDemographicGeneral
                        questionValue={['YES', 'NO', 'Prefer not to answer']}
                        questionPercentage={[2, 98, 0]}
                      />
                  </Grid>
                  {/* right columns */}
                  <Grid item xs={6}>
                    <h3 className="center-align">Age</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={age}>
                        <XAxis dataKey="age" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="number" fill="#592d82" />
                      </BarChart>
                    </ResponsiveContainer>

                    <h3 className="center-align">Years of experience in current role</h3>
                    <BubbleChart />

                    <h3 className="center-align">Have you had previous experience with the OR Black Box<sup>&reg;</sup> in anotherr hospital?</h3>
                    <SurveyDemographicGeneral
                      questionValue={['YES', 'NO', 'Prefer not to answer']}
                      questionPercentage={[2, 98, 0]}
                    />

                    <h3 className="center-align">Have you had previous involvement in a patient lawsuit?</h3>
                    <SurveyDemographicGeneral
                      questionValue={['YES', 'NO', 'Prefer not to answer']}
                      questionPercentage={[2, 98, 0]}
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