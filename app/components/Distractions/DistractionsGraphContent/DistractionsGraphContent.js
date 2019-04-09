import React from 'react';
import './style.scss';

class DistractionsGraphContent extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    let graphBars = Object.keys(this.props.graphFilter).map((key, index) => {
      if(this.props.graphFilter[key])
        return <div key={key} className={`Distractions-Bar relative ` + key} style={{width: (this.props.plotPoints[index] / this.props.graphMax * 100 + '%')}}></div>
    });

    return (
      <div className="Distractions-Graph flex vertical-center">
        <div className="center-align bold" style={{width: this.props.graphWidth[0]}}>
          <div className="small dark-blue">({this.props.caseNo} cases captured)</div>
          <div className="dark-blue">{this.props.procedure}</div>
        </div>
        <div style={{width: this.props.graphWidth[1]}}>
          {graphBars}
        </div>
      </div>
    );
  }
}

export default DistractionsGraphContent;