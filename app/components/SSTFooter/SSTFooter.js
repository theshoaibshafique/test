import React from 'react';
import SST from './img/SST_logo_wide.png';
import './style.scss';

class SSTFooter extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <footer className="grey small center-align flex vertical-center">
        <div className="inline">
          <img src={SST} alt="Surgical Safety Technologies" />
        </div>
        <div className="inline left-align">
          Copyright &copy; 2018 Surgical Safety Technologies Inc. | This document is proprietary an confidential.<br />
          No part of this document may be disclosed in any manner to a third party without hte prior written consent of Surgical Safety Techologies Inc.
        </div>
      </footer>
    );
  }
}

export default SSTFooter;
