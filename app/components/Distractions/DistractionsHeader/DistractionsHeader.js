import React from 'react';
import InsightCaseCount from '../../InsightCaseCount';
import InsightDate from '../../InsightDate';
import DistractionsLegend from '../DistractionsLegends';

class DistractionsHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="Package-Header-Wrapper">
        <div className="Package-Info center-align">
          <InsightCaseCount casecount={234} /> | <InsightDate date={"Apr19"} />
        </div>
        <DistractionsLegend isByOR={this.props.isByOR} />
      </div>
    );
  }
}

export default DistractionsHeader;
