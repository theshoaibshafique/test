import React from 'react';
import './style.scss';

class DistractionsGraphHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    let graphHeaderMarkup = this.props.steps.map((marker, index) => {
      if (index == (this.props.steps.length - 1))
        return <div key={marker} className="Distractions-Graph-Header-Marker inline dark-grey absolute" style={{width: this.props.stepWidth + '%'}}>{marker}%</div>;

      return <div key={marker} className="Distractions-Graph-Header-Marker inline dark-grey relative" style={{width: this.props.stepWidth + '%'}}>{marker}%</div>;
    })
    return (
      <div className="Distractions-Graph-Header relative">
        {graphHeaderMarkup}
      </div>
    );
  }
}

export default DistractionsGraphHeader;
