import React from 'react';
import './style.scss';


class InsightDate extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="dark-blue bold center-align">
        Data from:<br />
        <div className="bold light-blue">Q{this.props.quarter} | {this.props.year}</div>
      </div>
    );
  }
}

export default InsightDate;
