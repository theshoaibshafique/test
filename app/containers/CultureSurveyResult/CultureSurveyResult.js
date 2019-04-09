/*
 * Culture Survey Page
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';
import InsightDate from 'components/InsightDate';
import Grid from '@material-ui/core/Grid';
import SurveyResultCard from 'components/SurveyResultCard';

export default class CultureSurveyDemographic extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="Culture-Survey-Results">
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
            <SurveyResultCard
              questionName="Positive Attitude at Work"
              questionNumber={6}
              questionValue={[2, 5, 17, 3, 8]}
              questionNA={12}
            />
            <SurveyResultCard
              questionName="Inclusiveness inside the OR"
              questionNumber={8}
              questionValue={[9, 2, 1, 3, 8]}
              questionNA={9}
            />
            <SurveyResultCard
              questionName="Inclusiveness outside the OR"
              questionNumber={6}
              questionValue={[2, 1, 8, 3, 18]}
              questionNA={3}
            />
          </Grid>
        </Grid>
      </section>
    );
  }
}