import React from 'react';
import './style.scss';
import DistractionsHeader from '../DistractionsHeader';
import DistractionsTypeGraph from '../DistractionsTypeGraph';

class DistractionsType extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="Package-Section Distractions-Type">
        <h4 className="dark-blue">Distraction by Procedure Type</h4>
        <DistractionsHeader />
        <DistractionsTypeGraph />
      </div>
    );
  }
}

export default DistractionsType;
