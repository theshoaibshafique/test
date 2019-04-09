import React from 'react';
import './style.scss';

class PackageHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="Package-Header-Wrapper">
        <div className="Package-Header-Title light-green bold capitalize">
          {this.props.packagetitle}
        </div>
        <div className="Package-Header-SST dark-blue bold">
          Powered by OR Black Box Insights &trade;
        </div>
      </div>
    );
  }
}

export default PackageHeader;
