import React from 'react';
import './style.scss';
import { Grid, Paper, withStyles } from '@material-ui/core';
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
import { LightTooltip } from '../../../components/SharedComponents/SharedComponents';

const CustomLightTooltip = withStyles((theme) => ({
  tooltip: {
    maxWidth: 500
  },
}))(LightTooltip);

export default class EMMOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      specialties: this.props.specialties || [],
      caseProcedures: [{
        'specialty': 'Unknown Specialty',
        'procedure': 'Unknown Procedure'
      }]
    }
  }

  componentDidMount() {
    globalFuncs.genericFetch(process.env.SPECIALTY_API, 'get', this.props.userToken, {})
      .then(result => {
        if (result && result != 'error') {
          const { emmReportData, emmReportData: { procedures } } = this.props;
          let caseProcedures = procedures.map((procedure) => {
            const foundSpecialty = result.filter((specialty) => { return specialty.value.toUpperCase() == procedure.specialtyName.toUpperCase() })[0];
            if (procedure.specialtyName === '') {
              return {
                'specialty': '',
                'procedure': procedure.procedureName
              }
            } else if (foundSpecialty != undefined) {
              const foundProcedure = foundSpecialty.procedures.filter((specialty) => { return specialty.value.toUpperCase() == procedure.procedureName.toUpperCase() })[0];
              return {
                'specialty': foundSpecialty.name,
                'procedure': foundProcedure.name
              }
            } else {
              return {
                'specialty': 'Unknown Specialty',
                'procedure': 'Unknown Procedure'
              }
            }
          });
          this.setState({ specialties: result, caseProcedures });
        }
      }).catch(error => {
      });
  }

  getSpeedometer(speed) {
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
    const { emmReportData, emmReportData: { distractionScore, technicalPerformanceScore, adverseEventRate, checklistScore, checklists, phasesOfInterest, caseDuration, hypotension, hypothermia, hypoxia }, specialties, complications } = this.props;
    const hasHypotension = hypotension && hypotension.dataPoints && hypotension.dataPoints.length;
    const hasHypothermia = hypothermia && hypothermia.dataPoints && hypothermia.dataPoints.length;
    const hasHypoxia = hypoxia && hypoxia.dataPoints && hypoxia.dataPoints.length;
    const hasHL7 = (hasHypotension || hasHypothermia || hasHypoxia);
    const adverseEventRateTitle = adverseEventRate.dataPoints[0].valueX.substr(0, adverseEventRate.dataPoints[0].valueX.length - 3)
    const specialty = [...new Set(this.state.caseProcedures && this.state.caseProcedures.map((caseProcedure) => caseProcedure.specialty))].join(' · ');
    return (
      <div
        className="Emm-Reports-Overview"
        style={{ display: (tabShowing) ? 'block' : 'none' }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="EMM-Overview-Title">{this.state.caseProcedures && this.state.caseProcedures.map((caseProcedure) => caseProcedure.procedure).join(' · ')}</div>
            <div className="EMM-Overview-Subtitle">
              {`${specialty ? specialty+" — " : ''}${globalFuncs.formatSecsToTime(caseDuration, true)}`}
            </div>
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Paper className="Emm-Paper Score">
                  <div className="Section-Title">
                    {distractionScore.title}
                    <CustomLightTooltip interactive arrow title={EMM_DISTRACTION_TOOLTIP} placement="top" fontSize="small">
                      <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 4px 4px' }} />
                    </CustomLightTooltip>
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
                    <CustomLightTooltip interactive arrow title={EMM_TECHNICAL_TOOLTIP} placement="top" fontSize="small">
                      <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 4px 4px' }} />
                    </CustomLightTooltip>
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
                    <CustomLightTooltip interactive arrow title={EMM_ADVERSEEVENT_TOOLTIP} placement="top" fontSize="small">
                      <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 4px 4px' }} />
                    </CustomLightTooltip>
                  </div>
                  <div>
                    <span className="EMM-Score">{adverseEventRateTitle}<span style={{ fontSize: '26px' }}>/hr</span></span>
                    <span className="EMM-Score-Icon" style={{ backgroundColor: 'rgba(255, 219, 140,.6)' }}><Icon color="#FFC74D" path={mdiAlertRhombusOutline} size={'32px'} /></span>
                  </div>
                </Paper>
              </Grid>
              {/* HL7 KPIs */}
              <Grid item xs={12} className={`HL7 ${hasHL7 ? '' : 'unavailable'}`}>
                <Paper className="Emm-Paper Score">
                  <Grid container spacing={9}>
                    <Grid item xs={4} className="EMM-HL7 relative">
                      {hasHypotension ? <CustomLightTooltip interactive arrow title={hypotension.body} placement="top" fontSize="small">
                        <span className="Score-Speedometer">{this.getSpeedometer(hypotension.description)}</span>
                      </CustomLightTooltip> : ''}
                      <div className="Section-Title">
                        Hypotension
                        {hasHypotension ? <CustomLightTooltip interactive arrow title={<HorizontalBarChart dataPoints={hypotension.dataPoints} title={hypotension.subTitle} />} placement="top" fontSize="small">
                          <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 4px 4px' }} />
                        </CustomLightTooltip> : ''}
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
                    <Grid item xs={4} className="EMM-HL7 relative">
                      {hasHypothermia ? <CustomLightTooltip interactive arrow title={hypothermia.body} placement="top" fontSize="small">
                        <span className="Score-Speedometer">{this.getSpeedometer(hypothermia.description)}</span>
                      </CustomLightTooltip> : ''}
                      <div className="Section-Divider" />
                      <div className="Section-Title">
                        Hypothermia
                        {hasHypothermia ? <CustomLightTooltip interactive arrow title={<HorizontalBarChart dataPoints={hypothermia.dataPoints} title={hypothermia.subTitle} />} placement="top" fontSize="small">
                          <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 4px 4px' }} />
                        </CustomLightTooltip> : ''}
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
                    <Grid item xs={4} className="EMM-HL7 relative">
                      {hasHypoxia ? <CustomLightTooltip interactive arrow title={hypoxia.body} placement="top" fontSize="small">
                        <span className="Score-Speedometer" style={{ marginRight: 10 }}>{this.getSpeedometer(hypoxia.description)}</span>
                      </CustomLightTooltip> : ''}
                      <div className="Section-Divider" />
                      <div className="Section-Title">
                        Hypoxia
                        {hasHypoxia ? <CustomLightTooltip interactive arrow title={<HorizontalBarChart dataPoints={hypoxia.dataPoints} title={hypoxia.subTitle} />} placement="top" fontSize="small">
                          <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 4px 4px' }} />
                        </CustomLightTooltip> : ''}
                      </div>
                      <div>
                        <span className="EMM-Score">{
                          (!hasHypoxia) ?
                            <span className="performance-unavailable">-</span>
                            : <span>{hypoxia.total}<sup className="Score-Unit">%</sup></span>
                        }</span>
                        <span className="EMM-Score-Icon" style={{ backgroundColor: 'rgba(200, 200, 200,.6)' }}><Icon color="#575757" path={mdiDivingScubaTank} size={'32px'} /></span>
                      </div>
                    </Grid>
                    { !hasHL7 && <Grid item xs={12} className="HL7-unavailable">HL7 data not available</Grid>}
                  </Grid>

                </Paper>
              </Grid>


              {(checklistScore) &&
                <Grid item xs={12}>
                  <Paper className="Emm-Paper">
                    <div className="Section-Title">Surgical Safety Checklist</div>
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
                  <div className="Section-Title">Complications</div>
                  <CaseInformation
                    complications={emmReportData.complicationNames}
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