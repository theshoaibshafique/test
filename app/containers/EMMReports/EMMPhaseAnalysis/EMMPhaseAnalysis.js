import React from 'react';
import './style.scss';
import EMMPhaseSelector from './EMMPhaseSelector';
import EMMPhaseVideoContainer from './EMMPhaseVideoContainer';
import globalFuncs from '../../../utils/global-functions';

export default class EMMPhaseAnalysis extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    let { phases } = this.props;
    this.state = {
      phaseTitles: phases.map(phase => phase.title),
      phaseEvents: phases.map((phase) => {
        if (phase.name=="SurgicalProcedure") {
          let eventsCounter = new Set();
          phase.enhancedMMData.forEach((procedureStep) => {
            procedureStep.dataPoints.forEach((data) => {
              eventsCounter.add(data.title + '' + data.valueX)
            })
          })
          return eventsCounter.size + phase.enhancedMMOpenData.length;
        } else {
          return phase.enhancedMMData.length
        }
      })
    }
  }

  changePhase(phaseIndex) {
    this.props.setEmmPhaseIndex(phaseIndex)
    const {logger} = this.props;
    const { phaseTitles } = this.state;
    logger && logger.manualAddLog('click', `switch-tab-${phaseTitles[phaseIndex]}`);
  }

  getPhaseTime(startTime, endTime) {
    if (startTime == endTime) {
      return <span>0 minutes</span>
    } else {
      return <span>{globalFuncs.formatSecsToTime(endTime - startTime, true)} ({globalFuncs.formatSecsToTime(startTime)} - {globalFuncs.formatSecsToTime(endTime)})</span>
    }
  }

  render() {
    const {phases, emmPhaseIndex, tabShowing, isPublished } = this.props;
    const { phaseTitles, phaseEvents } = this.state;
    const selectedPhase = phases[emmPhaseIndex];
    return (
      <div
        className="Emm-Phases">
        <h1>Case Timeline</h1>
        <EMMPhaseSelector
          selectedPhase={emmPhaseIndex}
          phases={phaseTitles}
          phaseEvents={phaseEvents}
          changePhase={(phaseIndex)=>this.changePhase(phaseIndex)}
        />
        <h2>{phaseTitles[emmPhaseIndex]}</h2>
        <div className="phase-duration main-text">
          Duration: {this.getPhaseTime(selectedPhase.startTime, selectedPhase.endTime)}
        </div>
          {(tabShowing) &&
            <EMMPhaseVideoContainer
              title={'testingVideo'}
              phaseData={phases[emmPhaseIndex]}
              isPublished={isPublished}
            />
          }
      </div>
    );
  }
}