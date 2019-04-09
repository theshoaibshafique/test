import React from 'react';
import PackageSteps from '../PackageSteps';
import './style.scss';

class PackageStepper extends React.Component { // eslint-disable-line react/prefer-stateless-function
  setStep(index) {
    this.props.setStep(index);
  }

  render() {
    let packageStepsMarkup = this.props.packageSteps.map((key, index) => {
      return <PackageSteps key={key} packageStepName={key} showStep={index === this.props.stepToShow? true : false} setStep={(e) => this.setStep(index)}/>
    });

    return (
      <div className="Package-Stepper-Wrapper">
        <hr />
        <div className="Package-Steps">
          {packageStepsMarkup}
        </div>
      </div>
    );
  }
}

export default PackageStepper;
