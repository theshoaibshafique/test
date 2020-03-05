import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import DistractionLogo from './img/distraction.svg';
import CultureSurveyLogo from './img/culture-survey.svg';
import RoomTrafficLogo from './img/room-traffic.svg';

class SSTNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let path = window.location.pathname.split('/');
    let mainPackage;
    if (path.length > 1) {
      mainPackage = path[1].replace('-', ' ').replace('/', '');
    }

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
          {(this.props.emmAccess) &&
            <li><Link to="/emmcases" className='text-link'>eM&M Cases</Link></li>
          }
          {/* 
            <li>Efficiency</li>
            <li>Surgical Safety Checklist</li>
          */}
          {(this.props.emmRequestAccess) && 
            <li><Link to="/requestemm" className='text-link'>Request for eM&M</Link></li>
          }
          {(this.props.userManagementAccess) &&
            <li><Link to="/usermanagement" className='text-link'>User Management</Link></li> 
          }
          <li><Link to="/my-profile" className='text-link'>My Profile</Link></li>
        </ul>
      </div>
    );
  }
}

export default SSTNav;