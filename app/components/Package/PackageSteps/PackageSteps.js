import React from 'react';
import './style.scss';

class PackageSteps extends React.Component { // eslint-disable-line react/prefer-stateless-function
  changeToStep() {
    this.props.setStep();
  }

  render() {
    return (
      <a className="Package-Step dark-blue relative" onClick={(e) => this.changeToStep()}>
        {/* {(this.props.showStep) ? this.props.packageStepName : ''} */}
        {this.props.packageStepName}
      </a>
    );
  }
}

export default PackageSteps;
