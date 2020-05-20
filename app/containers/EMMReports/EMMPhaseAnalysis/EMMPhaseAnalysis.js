import React from 'react';
import './style.scss';
import EMMPhaseSelector from './EMMPhaseSelector';
import AzureVideo from '../AzureVideo'
import { Grid, Paper } from '@material-ui/core';

export default class EMMPhaseAnalysis extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      currentPhase: 0,
      phases: ['Room Setup', 'Intubation and Patient Prep', 'Surgical Procedure', 'Emergence']
    }
  }

  changePhase(phaseIndex) {
    this.setState({currentPhase: phaseIndex})
  }

  render() {
    let { currentPhase, phases } = this.state;
    let { scriptReady } = this.props;
    return (
      <div className="Emm-Phases">
        <h1>Case Timeline</h1>
        <EMMPhaseSelector
          selectedPhase={currentPhase}
          phases={phases}
          changePhase={(phaseIndex)=>this.changePhase(phaseIndex)}
        />
        <h2>{phases[currentPhase]}</h2>
          {(scriptReady) &&
        <div className="flex phase-video-container">
            <div className="phase-video"><AzureVideo
              title={'testvideo'} /></div>
            <div className="phase-events">

            </div>
        </div>
          }
      </div>
    );
  }
}