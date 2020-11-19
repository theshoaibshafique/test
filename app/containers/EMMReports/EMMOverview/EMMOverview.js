import React from 'react';
import './style.scss';
import { Grid, Paper, Tooltip, withStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { mdiVolumeVibrate, mdiDivingScubaTank, mdiResistor, mdiThermometerLow, mdiTrendingUp, mdiWater, mdiAlertRhombusOutline, mdiSpeedometer, mdiSpeedometerMedium, mdiSpeedometerSlow } from '@mdi/js';
import { EMM_DISTRACTION_TOOLTIP, EMM_TECHNICAL_TOOLTIP, EMM_ADVERSEEVENT_TOOLTIP, HL7_DATA } from '../../../constants'
import ChecklistStatus from './ChecklistStatus';
import PhasesOfInterest from './PhasesOfInterest';
import CaseInformation from './CaseInformation';
import SurgicalSafetyChecklist from './SurgicalSafetyChecklist';
import globalFuncs from '../../../utils/global-functions';
import Icon from '@mdi/react'
import HorizontalBarChart from './HorizontalBarChart';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    font: 'Noto Sans',
    maxWidth:500
  },
}))(Tooltip);

export default class EMMOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      specialties: this.props.specialties || []
    }
  }

  componentDidMount() {
    globalFuncs.genericFetch(process.env.SPECIALTY_API, 'get', this.props.userToken, {})
      .then(result => {
        if (result && result != 'error') {
          this.setState({ specialties: result });
        }
      }).catch(error => {
      });
  }

  getSpeedometer(speed){
    switch (speed) {
      case 'slow':
        return <Icon color="#FF4D4D" path={mdiSpeedometerSlow} size={'20px'} />;
      case 'medium':
        return <Icon color="#FFB71B" path={mdiSpeedometerMedium} size={'20px'} />;
      default:
        return <Icon color="#009483" path={mdiSpeedometer} size={'20px'} />;
    }
  }

  render() {
    const { tabShowing } = this.props;
    const { emmReportData, emmReportData: { distractionScore, technicalPerformanceScore, adverseEventRate, checklistScore, checklists, phasesOfInterest }, specialties, complications } = this.props;
    const {hypotension, hypothermia, hypoxia} = HL7_DATA;
    const hasHypotension = hypotension && hypotension.dataPoints && hypotension.dataPoints.length;
    const hasHypothermia = hypothermia && hypothermia.dataPoints && hypothermia.dataPoints.length;
    const hasHypoxia = hypoxia && hypoxia.dataPoints && hypoxia.dataPoints.length;
    const adverseEventRateTitle = adverseEventRate.dataPoints[0].valueX.substr(0, adverseEventRate.dataPoints[0].valueX.length - 3)
    return (
      <div
        className="Emm-Reports-Overview"
        style={{ display: (tabShowing) ? 'block' : 'none' }}
      >
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Paper className="Emm-Paper Score">
                  <div className="Section-Title">
                    {distractionScore.title}
                    <LightTooltip interactive arrow title={EMM_DISTRACTION_TOOLTIP} placement="top" fontSize="small">
                      <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
                    </LightTooltip>
                  </div>
                  <div>
                    <span className="EMM-Score">{distractionScore.dataPoints[0].valueX}</span>
                    <span className="EMM-Score-Icon" style={{ backgroundColor: 'rgba(167, 229, 253,.6)' }}><Icon color="#50CBFB" style={{ marginTop: 4 }} path={mdiVolumeVibrate} size={'40px'} /></span>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className="Emm-Paper Score">
                  <div className="Section-Title">
                    {technicalPerformanceScore.title}
                    <LightTooltip interactive arrow title={EMM_TECHNICAL_TOOLTIP} placement="top" fontSize="small">
                      <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
                    </LightTooltip>
                  </div>
                  <div>
                    <span className="EMM-Score">{
                      (parseInt(technicalPerformanceScore.dataPoints[0].valueX) < 0) ?
                        <span className="performance-unavailable">Not Available</span>
                        : technicalPerformanceScore.dataPoints[0].valueX
                    }</span>
                    <span className="EMM-Score-Icon" style={{ backgroundColor: 'rgba(151, 231, 179,.6)' }}><Icon color="#6EDE95" path={mdiTrendingUp} size={'32px'} /></span>
                  </div>

                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className="Emm-Paper Score">
                  <div className="Section-Title">
                    {adverseEventRate.title}
                    <LightTooltip interactive arrow title={EMM_ADVERSEEVENT_TOOLTIP} placement="top" fontSize="small">
                      <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
                    </LightTooltip>
                  </div>
                  <div>
                    <span className="EMM-Score">{adverseEventRateTitle}<span style={{ fontSize: '26px' }}>/hr</span></span>
                    <span className="EMM-Score-Icon" style={{ backgroundColor: 'rgba(255, 219, 140,.6)' }}><Icon color="#FFC74D" path={mdiAlertRhombusOutline} size={'32px'} /></span>
                  </div>
                </Paper>
              </Grid>
              {/* HL7 KPIs */}
              <Grid item xs={12} className="HL7">
                <Paper className="Emm-Paper Score">
                  <Grid container spacing={9}>
                    <Grid item xs={4} style={{ position: 'relative' }}>
                      <LightTooltip interactive arrow title={hypotension.body} placement="top" fontSize="small">
                        <span className="Score-Speedometer">{this.getSpeedometer(hypotension.description)}</span>
                      </LightTooltip>
                      <div className="Section-Title">
                        {hypotension.title}
                        <LightTooltip interactive arrow title={<HorizontalBarChart dataPoints={hypotension.dataPoints} title={hypotension.subTitle}/>} placement="top" fontSize="small">
                          <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
                        </LightTooltip>
                      </div>
                      <div>
                        <span className="EMM-Score">{
                          (!hasHypotension) ?
                            <span className="performance-unavailable">-</span>
                            : <span>{hypotension.total}<sup className="Score-Unit">%</sup></span>
                        }</span>
                        <span className="EMM-Score-Icon" style={{ backgroundColor: 'rgba(255,125,125,.6)' }}>
                          <Icon color="#FF4D4D" style={{ marginTop: 4 }} path={mdiWater} size={'40px'} />
                          <Icon color="#FFB1B1" className="Overlay" style={{ marginTop: 4 }} path={mdiResistor} size={'26px'} />
                        </span>

                      </div>
                    </Grid>
                    <Grid item xs={4} style={{ position: 'relative' }}>
                      <LightTooltip interactive arrow title={hypothermia.body} placement="top" fontSize="small">
                        <span className="Score-Speedometer">{this.getSpeedometer(hypothermia.description)}</span>
                      </LightTooltip>
                      <div className="Section-Divider" />
                      <div className="Section-Title">
                        {hypothermia.title}
                        <LightTooltip interactive arrow title={<HorizontalBarChart dataPoints={hypothermia.dataPoints} title={hypothermia.subTitle}/>} placement="top" fontSize="small">
                          <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
                        </LightTooltip>
                      </div>
                      <div>
                        <span className="EMM-Score">{
                          (!hasHypothermia) ?
                            <span className="performance-unavailable">-</span>
                            : <span>{hypothermia.total}<sup className="Score-Unit">%</sup></span>
                        }</span>
                        <span className="EMM-Score-Icon" style={{ backgroundColor: 'rgba(207, 185, 228,.6)' }}><Icon color="#A77ECD" path={mdiThermometerLow} size={'32px'} /></span>
                      </div>
                    </Grid>
                    <Grid item xs={4} style={{ position: 'relative' }}>
                      <LightTooltip interactive arrow title={hypoxia.body} placement="top" fontSize="small">
                        <span className="Score-Speedometer" style={{ marginRight:10 }}>{this.getSpeedometer(hypoxia.description)}</span>
                      </LightTooltip>
                      <div className="Section-Divider" />
                      <div className="Section-Title">
                        {hypoxia.title}
                        <LightTooltip interactive arrow title={<HorizontalBarChart dataPoints={hypoxia.dataPoints} title={hypoxia.subTitle}/>} placement="top" fontSize="small">
                          <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
                        </LightTooltip>
                      </div>
                      <div>
                        <span className="EMM-Score">{
                          (!hasHypoxia) ?
                            <span className="performance-unavailable">Not Available</span>
                            : <span>{hypoxia.total}<sup className="Score-Unit">%</sup></span>
                        }</span>
                        <span className="EMM-Score-Icon" style={{ backgroundColor: 'rgba(200, 200, 200,.6)' }}><Icon color="#575757" path={mdiDivingScubaTank} size={'32px'} /></span>
                      </div>
                    </Grid>
                  </Grid>

                </Paper>
              </Grid>


              {(checklistScore) &&
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
              }

            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={3}>

              <Grid item xs={12}>
                <Paper className="Emm-Paper">
                  <div className="Section-Title">Case Information</div>
                  <CaseInformation
                    caseDuration={emmReportData.caseDuration}
                    procedures={emmReportData.procedures}
                    complications={emmReportData.complicationNames}
                    allSpecialties={this.state.specialties}
                    allComplications={complications}
                  />
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