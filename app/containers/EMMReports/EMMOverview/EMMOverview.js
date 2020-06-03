import React from 'react';
import './style.scss';
import { Grid, Paper } from '@material-ui/core';
import ReportScore from '../../../components/Report/ReportScore';
import CircleProgress from '../../../components/Report/CircleProgress';
import ChecklistStatus from './ChecklistStatus';
import PhasesOfInterest from './PhasesOfInterest';
import CaseInformation from './CaseInformation';

export default class EMMOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      circleSize: 175,
      sscCirclesColors: ["#A7E5FD", "#97E7B3", "#CFB9E4"]
    }
  }

  componentDidMount() {

  }

  render() {
    let { circleSize, sscCirclesColors } = this.state;
    let { emmReportData, specialties, complications } = this.props;
    return (
      <div className="Emm-Reports-Overview">
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">
                  <ReportScore
                      title={emmReportData.distractionScore.title}
                      score={emmReportData.distractionScore.dataPoints[0].valueX}
                      tooltipText="Distraction tooltip" />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">
                  <div className="Section-Title">Case Information</div>
                  <CaseInformation
                    caseDuration={emmReportData.caseDuration}
                    procedures={emmReportData.procedures}
                    complications={emmReportData.complicationNames}
                    allSpecialties={specialties}
                    allComplications={complications}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Paper className="Emm-Paper">
                  <ReportScore
                    title={emmReportData.technicalPerformanceScore.title}
                    score={emmReportData.technicalPerformanceScore.dataPoints[0].valueX} />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className="Emm-Paper">
                  <ReportScore
                    title={emmReportData.adverseEventRate.title}
                    score={emmReportData.adverseEventRate.dataPoints[0].valueX} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">
                  <div className="Section-Title">Surigcal Safety Checklist</div>
                  <div className="SSC-Circles">
                    {
                      emmReportData.checklistScore.dataPoints.map((sscCircle, index) => {
                        return <div key={index}><div style={{width: '175px', margin: '0 auto'}}>
                                <CircleProgress
                                  title={sscCircle.title}
                                  color={sscCirclesColors[index]}
                                  value={sscCircle.valueX}
                                  size={circleSize}
                                />
                              </div></div>
                      })
                    }
                  </div>
                  <hr />
                  <ChecklistStatus
                    checklists={emmReportData.checklists.dataPoints} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">
                  <div className="Section-Title">Phases Of Interest</div>
                  <PhasesOfInterest
                    phases={emmReportData.phasesOfInterest.dataPoints}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}