import React from 'react';
import './style.scss';
import layout from './img/layout2.jpg';

class DistractionsORInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="Distractions-Room dark-blue">
        <h3 className="Card-Header">{this.props.room[0]}</h3>
        <hr />
        <div className="OR-Room-Content center-align dark-blue">
          <img src={layout} />
          <h5>Distractions per hour: </h5>
          <div className="OR-Room-Stat inline">
            Alarms/<br />Alerts <br />
            <span className="stat purple bold">{this.props.room[2]}</span><br />
            <span className="purple">Instances</span>
          </div>
          <div className="OR-Room-Stat inline">
            Duration of Door Open <br />
            <span className="stat purple bold">{this.props.room[3]}</span><br />
            <span className="purple">Minutes</span>
          </div>
          <div className="OR-Room-Stat inline">
            External<br />Comm. <br />
            <span className="stat purple bold">{this.props.room[4]}</span><br />
            <span className="purple">Minutes</span>
          </div>
          <div className="OR-Room-Stat inline">
            In & Out<br />Traffic <br />
            <span className="stat purple bold">{this.props.room[5]}</span><br />
            <span className="purple">Times</span>
          </div>

        </div>
      </div>
    );
  }
}

export default DistractionsORInfo;
