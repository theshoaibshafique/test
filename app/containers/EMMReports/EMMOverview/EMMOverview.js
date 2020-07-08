import React from 'react';
import './style.scss';
import { Grid, Paper, Tooltip, withStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { EMM_DISTRACTION_TOOLTIP, EMM_TECHNICAL_TOOLTIP, EMM_ADVERSEEVENT_TOOLTIP } from '../../../constants'
import ChecklistStatus from './ChecklistStatus';
import PhasesOfInterest from './PhasesOfInterest';
import CaseInformation from './CaseInformation';
import SurgicalSafetyChecklist from './SurgicalSafetyChecklist';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    font: 'Noto Sans'
  }
}))(Tooltip);

export default class EMMOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    const { tabShowing } = this.props;
    const { emmReportData, emmReportData : { distractionScore, technicalPerformanceScore, adverseEventRate, checklistScore, checklists, phasesOfInterest }, specialties, complications } = this.props;
    const adverseEventRateTitle = adverseEventRate.dataPoints[0].valueX.substr(0, adverseEventRate.dataPoints[0].valueX.length - 3)
    return (
      <div
        className="Emm-Reports-Overview"
        style={{display: (tabShowing) ? 'block' : 'none'}}
      >
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className="Emm-Paper Score">
                  <div className="Section-Title">
                    {distractionScore.title}
                    <LightTooltip interactive arrow title={EMM_DISTRACTION_TOOLTIP} placement="top" fontSize="small">
                      <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
                    </LightTooltip>
                  </div>
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
                  <div className="Section-Title">
                    {technicalPerformanceScore.title}
                    <LightTooltip interactive arrow title={EMM_TECHNICAL_TOOLTIP} placement="top" fontSize="small">
                      <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
                    </LightTooltip>
                  </div>
                  <div className="EMM-Score">{
                    (parseInt(technicalPerformanceScore.dataPoints[0].valueX) < 0) ?
                      <div className="performance-unavailable">Unavailable for this case</div>
                      : technicalPerformanceScore.dataPoints[0].valueX
                  }</div>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className="Emm-Paper Score">
                  <div className="Section-Title">
                    {adverseEventRate.title}
                    <LightTooltip interactive arrow title={EMM_ADVERSEEVENT_TOOLTIP} placement="top" fontSize="small">
                      <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
                    </LightTooltip>
                  </div>
                  <div className="EMM-Score">{adverseEventRateTitle}<span style={{fontSize:'26px'}}>/hr</span></div>
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
                    allPhases={emmReportData.enhancedMMPages}
                    checklists={checklists.dataPoints} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className="Emm-Paper">
                  <div className="Section-Title">Phases Of Interest</div>
                  <PhasesOfInterest
                    allPhases={emmReportData.enhancedMMPages}
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