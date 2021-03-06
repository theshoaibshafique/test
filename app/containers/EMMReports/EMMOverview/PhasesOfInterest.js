import React from 'react';
import { connect } from 'react-redux';
import { setEMMTab, setEMMPhaseIndex } from '../../App/store/EMM/emm-actions';


class PhasesOfInterest extends React.Component {
  constructor(props) {
    super(props)
  }

  selectPhaseOfInterest(phaseName) {
    const phaseIndex = this.props.allPhases.map((phase) => phase.name).indexOf(phaseName)
    this.props.setEmmTab('phase')
    this.props.setEmmPhaseIndex(phaseIndex)
  }

  render() {
    const { phases } = this.props;
    const filteredPhases = (phases.length > 3) ? phases.slice(0, 3) : phases;
    return (
      <div className="Phases-Of-Interests-Container flex">
        {
          filteredPhases.map((phase, index) => {
            return <div className="phase-of-interest" key={`phaseOfInterest${index}`}>
                    <div className="phase-title text-ellipsis log-click" id={`phase-of-interest-${phase.title}`} title={phase.title} onClick={()=>this.selectPhaseOfInterest(phase.valueX)}>{phase.title}</div>
                    <div className="phase-event subtle-subtext main-text flex"><div className="event-circle"></div>{phase.valueY}</div>
                   </div>
          })
        }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setEmmTab: (data) => { dispatch(setEMMTab(data)); },
    setEmmPhaseIndex: (data) => { dispatch(setEMMPhaseIndex(data)); }
  };
};

export default connect(null, mapDispatchToProps)(PhasesOfInterest);