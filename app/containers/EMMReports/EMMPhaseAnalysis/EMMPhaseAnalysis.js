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

  render() {
    let { currentPhase, phaseTitles } = this.state;
    let { scriptReady, phases } = this.props;
    return (
      <div className="Emm-Phases">
        <h1>Case Timeline</h1>
        <EMMPhaseSelector
          selectedPhase={currentPhase}
          phases={phaseTitles}
          changePhase={(phaseIndex)=>this.changePhase(phaseIndex)}
        />
        <h2>{phaseTitles[currentPhase]}</h2>
          {(scriptReady) &&
            <EMMPhaseVideoContainer
              phaseData={phases[currentPhase]}
            />
          }
      </div>
    );
  }
}