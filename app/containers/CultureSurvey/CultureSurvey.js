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
import { AreaChart, Area, CartesianGrid, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import globalFuncs from '../../global-functions';

export default class CultureSurvey extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.fetchContainerData();
  }

  fetchContainerData() {
    this.card1Data();
  }

  card1Data() {
    globalFuncs.getInsightData(process.env.INSIGHT_API, 'DCS_MOE', this.props.usertoken).then((result) => {
      console.log(result);
    })
  }

  render() {
    const dataBar = [
      {name: '18-29', responses: 40},
      {name: '30-39', responses: 20},
      {name: '40-49', responses: 44},
      {name: '50+', responses: 17}
    ];

    const dataArea = [
      {name: 'Disagree Strongly', responses: 5},
      {name: 'Disagree', responses: 2},
      {name: 'Neutral', responses: 12},
      {name: 'Agree', responses: 13},
      {name: 'Agree Strongly', responses: 17},
    ]

    return (
      <section className="Culture-Survey">
        <Helmet>
          <title>Distractions</title>
          <meta name="description" content="SST Insights" />
        </Helmet>
        <button onClick={() => this.fetchContainerData()}>Fetch</button>
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
                <h3 className="Card-Header">Measure of Engagement</h3>
                <hr />
                <Grid container spacing={0}>
                  <Grid item xs={12} className="flex vertical-center"   style={{height: '300px'}}>
                  <div className="center-align larger">
                    Survey sent to 200 individuals <br />
                    <span className="highlight purple bold">44% response rate</span> <br />
                    (89 respondents)
                  </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <h3 className="Card-Header">Demographic Diversity</h3>
                <hr />
                <ResponsiveContainer width="100%" height={300}>
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
          <Grid item xs={6}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <h3 className="Card-Header">Question Results</h3>
                <hr />
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dataArea}>
                    <XAxis dataKey="name" interval={0} />
                    <YAxis tick={false}/>
                    <CartesianGrid vertical horizontal={false} />
                    <Area dataKey="responses" stroke="#592d82" fill="#592d82" fillOpacity={1} />
                    <Tooltip />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>
    );
  }
}