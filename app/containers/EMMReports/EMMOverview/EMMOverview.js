import React from 'react';
import './style.scss';
import { Grid, Paper } from '@material-ui/core';
import ReportScore from '../../../components/Report/ReportScore';
import CircleProgress from '../../../components/Report/CircleProgress';

export default class EMMOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

  }
  componentDidMount() {

  }
  render() {
    return (
      <div className="Emm-Reports-Overview">
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">
                  <ReportScore
                      title="Distraction"
                      score="44"
                      tooltipText="Distraction tooltip" />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">
                  CASE INFORMATION
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Paper className="Emm-Paper">
                  <ReportScore
                    title="Technical Performance"
                    score="76"
                    tooltipText="Technical performance tooltip" />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className="Emm-Paper">
                  <ReportScore
                    title="Number of Events"
                    score="7" />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">
                  <CircleProgress
                    title="Checklist Score"
                    color="#A7E5FD"
                    value={67}
                  />
                  <CircleProgress
                    title="Engagement Score"
                    color="#97E7B3"
                    value={55}
                  />
                  <CircleProgress
                    title="Quality Score"
                    color="#CFB9E4"
                    value={83}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">Phases Of Interest</Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}