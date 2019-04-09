import React from 'react';
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
        PackageLogo = <span className="dark-green small"><em>Explore our curated insights</em></span>

    }

    return (
      <div>
        <div className="Package-Location center-align">
          {PackageLogo}<br />
        </div>
        <ul className="Package-Selector dark-blue padding0">
          {PackageCollection}
        </ul>
      </div>
    );
  }
}

export default SSTNav;
