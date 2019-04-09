import React from 'react';
import './style.scss';

class DistractionsLegends extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    if (this.props.isByOR) {
      return (
        <div className="Distractions-Legends center-align small grey">
          <div className="higher inline vertical-top"></div>Higher than 80% of all users' ORs &nbsp;&nbsp;
          <div className="lower inline vertical-top"></div>Lower than 80% of all users' ORs
        </div>
      )
    } else {
      return (
        <div className="Distractions-Legends center-align small grey">
          <div className="door inline vertical-top"></div>Door Open  &nbsp;&nbsp;
          <div className="alert inline vertical-top"></div>Alters/Alarms &nbsp;&nbsp;
          <div className="external inline vertical-top"></div>External Communications
        </div>
      );
    }
  }
}

export default DistractionsLegends;
