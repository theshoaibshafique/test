import React from 'react';

const PhasesOfInterest = (props) => {
  const { phases } = props;
  const filteredPhases = (phases.length > 3) ? phases.slice(0, 3) : phases;

  return (
    <div className="Phases-Of-Interests-Container flex">
      {
        filteredPhases.map((phase) => {
          return <div className="phase-of-interest left-align">
                  <div className="phase-title text-ellipsis">{phase.title}</div>
                  <div className="phase-event main-text flex"><div className="event-circle"></div>{phase.valueY}</div>
                 </div>
        })
      }
    </div>
  )
}

export default PhasesOfInterest;