import React from 'react';
import './style.scss';
import EMMPhaseSelector from './EMMPhaseSelector';
import EMMPhaseVideoContainer from './EMMPhaseVideoContainer';

export default class EMMPhaseAnalysis extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      currentPhase: 0,
      phaseTitles: this.props.phases.map(phase => phase.title)
    }
  }

  changePhase(phaseIndex) {
    this.setState({currentPhase: phaseIndex})
  }

  formatSecsToTime (seconds, toWords = false) {
    var hh = Math.floor(seconds / 3600);
    var mm = Math.floor((seconds - (hh * 3600)) / 60);
    var ss = seconds - (hh * 3600) - (mm * 60);

    if (!toWords)
      return `${this.pad(hh)}:${this.pad(mm)}:${this.pad(ss)}`;
    else
      return `${this.formatWords(hh, 'hour')} ${this.formatWords(mm, 'minute')} ${this.formatWords(ss, 'second')}`;
  }

  formatWords(value, word) {
    return `${(value > 0) ? `${value} ${word}${(value > 1) ? `s` : ''}`  : '' }`
  }

  pad (string) {
    return ('0' + string).slice(-2)
  }


  render() {
    let { currentPhase, phaseTitles } = this.state;
    let { scriptReady, phases } = this.props;
    let selectedPhase = phases[currentPhase];
    return (
      <div className="Emm-Phases">
        <h1>Case Timeline</h1>
        <EMMPhaseSelector
          selectedPhase={currentPhase}
          phases={phaseTitles}
          changePhase={(phaseIndex)=>this.changePhase(phaseIndex)}
        />
        <h2>{phaseTitles[currentPhase]}</h2>
        <div className="phase-duration main-text">
          Duration: {this.formatSecsToTime(selectedPhase.endTime - selectedPhase.startTime, true)} ({this.formatSecsToTime(selectedPhase.startTime)} - {this.formatSecsToTime(selectedPhase.endTime)})
        </div>
          {(scriptReady) &&
            <EMMPhaseVideoContainer
              title={'testingVideo'}
              phaseData={phases[currentPhase]}
            />
          }
      </div>
    );
  }
}