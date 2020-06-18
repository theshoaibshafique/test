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
          let eventsCounter = 0;
          phase.enhancedMMData.forEach((procedureStep) => {
            eventsCounter += procedureStep.dataPoints.length
          })
          return eventsCounter;
        } else {
          return phase.enhancedMMData.length
        }
      })
    }
  }

  changePhase(phaseIndex) {
    this.props.setEmmPhaseIndex(phaseIndex)
  }

  render() {
    const { scriptReady, phases, emmPhaseIndex, tabShowing } = this.props;
    const { phaseTitles, phaseEvents } = this.state;
    const selectedPhase = phases[emmPhaseIndex];
    return (
      <div
        className="Emm-Phases"
        style={{display: (tabShowing) ? 'block' : 'none'}}  >
        <h1>Case Timeline</h1>
        <EMMPhaseSelector
          selectedPhase={emmPhaseIndex}
          phases={phaseTitles}
          phaseEvents={phaseEvents}
          changePhase={(phaseIndex)=>this.changePhase(phaseIndex)}
        />
        <h2>{phaseTitles[emmPhaseIndex]}</h2>
        <div className="phase-duration main-text">
          Duration: {globalFuncs.formatSecsToTime(selectedPhase.endTime - selectedPhase.startTime, true)} ({globalFuncs.formatSecsToTime(selectedPhase.startTime)} - {globalFuncs.formatSecsToTime(selectedPhase.endTime)})
        </div>
          {(scriptReady) &&
            <EMMPhaseVideoContainer
              title={'testingVideo'}
              phaseData={phases[emmPhaseIndex]}
            />
          }
      </div>
    );
  }
}