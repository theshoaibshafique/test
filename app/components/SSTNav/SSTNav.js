import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import {PACKAGE_NAME} from '../../../app/constants.js';
import PackageSelector from '../MainDashboard/PackageSelector';
import DistractionLogo from './img/distraction.svg';
import CultureSurveyLogo from './img/culture-survey.svg';
import RoomTrafficLogo from './img/room-traffic.svg';

class SSTNav extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    let path = window.location.pathname.split('/');
    let mainPackage, subPackage;
    if (path.length > 1) {
      mainPackage = path[1].replace('-', ' ').replace('/', '');
      subPackage = (path[2] != undefined) ? path[2] : undefined;
    }


    let PackageCollection = Object.keys(PACKAGE_NAME).map((key) => {
      return <PackageSelector
        key={PACKAGE_NAME[key].name}
        packageName={PACKAGE_NAME[key].name}
        packageURL={PACKAGE_NAME[key].link}
        subPackage={PACKAGE_NAME[key].subPackage}
        selectedMain={mainPackage}
        currentPath={window.location.pathname}
      />;
    })

    let PackageLogo;

    switch(mainPackage) {
      case 'distractions':
        PackageLogo = <img className="Package-Logo" src={DistractionLogo} />;
        break;
      case 'culture survey':
        PackageLogo = <img className="Package-Logo" src={CultureSurveyLogo} />;
        break;
      case 'room traffic':
        PackageLogo = <img className="Package-Logo" src={RoomTrafficLogo} />;
        break;
      default:
        PackageLogo = <span className="dark-green small"><em>Insights</em></span>

    }

    return (
      <div>
        <div className="Package-Location center-align">
          <img className="Package-Logo" src={DistractionLogo} />
          {PackageLogo}<br />
        </div>
        <ul className="dark-blue">
          <li>eM&M</li>

          {/* 
            <li>Efficiency</li>
            <li>Surgical Safety Checklist</li>
            {PackageCollection}
            <li>Request for eM&M</li>
          */}

          <li><Link to="/usermanagement" className='text-link'>User Management</Link></li>
          <li><Link to="/my-profile" className='text-link'>My Profile</Link></li>
          <li>Logout</li>
        </ul>
      </div>
    );
  }
}

export default SSTNav;
