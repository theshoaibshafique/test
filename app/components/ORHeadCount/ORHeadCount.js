import React from 'react';
import './style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ORHeadCount extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    let peopleIcon = [...Array(15).keys()].map((index) => {
      if ((index + 1) <= this.props.headCount)
        return <FontAwesomeIcon key={index} icon="user" color="#004f6e" size="2x" style={{marginRight: '5px'}}/>
      else
        return <FontAwesomeIcon key={index} icon="user" color="#51596C" size="2x" style={{marginRight: '5px'}}/>
    })


    return (
      <div className="Card-Content-Wrapper center-align">
        <div className="People-Icon-Wrapper">
          {peopleIcon}
        </div>
        <h1 className="purple">{this.props.headCount} people</h1>
        <div className="grey">
          Average number of people present in the OR during a procedure
        </div>
      </div>
    );
  }
}

export default ORHeadCount;
