import React from 'react';
import './style.scss';
import { Grid, Paper } from '@material-ui/core';
import ChecklistStatus from './ChecklistStatus';
import PhasesOfInterest from './PhasesOfInterest';
import CaseInformation from './CaseInformation';
import SurgicalSafetyChecklist from './SurgicalSafetyChecklist';

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
    const { circleSize, sscCirclesColors } = this.state;
    const { emmReportData, emmReportData : { distractionScore, technicalPerformanceScore, adverseEventRate, checklistScore, checklists, phasesOfInterest }, specialties, complications } = this.props;
    return (
      <div className="Emm-Reports-Overview">
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className="Emm-Paper Score">
                  <div className="Section-Title">{distractionScore.title}</div>
                  <div className="EMM-Score">{distractionScore.dataPoints[0].valueX}</div>
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
                <Paper className="Emm-Paper Score">
                  <div className="Section-Title">{technicalPerformanceScore.title}</div>
                  <div className="EMM-Score">{technicalPerformanceScore.dataPoints[0].valueX}</div>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className="Emm-Paper Score">
                  <div className="Section-Title">{adverseEventRate.title}</div>
                  <div className="EMM-Score">{adverseEventRate.dataPoints[0].valueX}</div>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">
                  <div className="Section-Title">Surigcal Safety Checklist</div>
                    <SurgicalSafetyChecklist
                      checklistScore={checklistScore.dataPoints}
                    />
                  <hr />
                  <ChecklistStatus
                    checklists={checklists.dataPoints} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">
                  <div className="Section-Title">Phases Of Interest</div>
                  <PhasesOfInterest
                    phases={phasesOfInterest.dataPoints}
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