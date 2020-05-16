import React from 'react';
import './style.scss';
import { Grid, Paper } from '@material-ui/core';
import ReportScore from '../../../components/Report/ReportScore';
import CircleProgress from '../../../components/Report/CircleProgress';

export default class EMMOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      circleSize: 175,
      sscCircles: [
        {
          title:"Checklist Score",
          color:"#A7E5FD",
          value:67
        },
        {
          title:"Engagement Score",
          color:"#97E7B3",
          value:55
        },
        {
          title:"Quality Score",
          color:"#CFB9E4",
          value:83
        }
      ]
    }
  }
  componentDidMount() {

  }
  render() {
    let { circleSize, sscCircles } = this.state;
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
                  <h2>Surigcal Safety Checklist</h2>
                  <div className="SSC-Circles">
                    {
                      sscCircles.map((sscCircle) => {
                        return <div><div style={{width: '175px', margin: '0 auto'}}>
                                <CircleProgress
                                  title={sscCircle.title}
                                  color={sscCircle.color}
                                  value={sscCircle.value}
                                  size={circleSize}
                                />
                              </div></div>
                      })
                    }
                  </div>
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