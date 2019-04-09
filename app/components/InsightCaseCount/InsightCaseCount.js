import React from 'react';
import './style.scss';


class InsightCaseCount extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="inline light-blue center-align">
        n = {this.props.casecount}
      </div>
    );
  }
}

export default InsightCaseCount;
