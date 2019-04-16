import React from 'react';
import './style.scss';

class NoDataCard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="empty-card flex vertical-center center-align full-height">
        <div>No data found, please reselect search criteria</div>
      </div>
    );
  }
}

export default NoDataCard;
