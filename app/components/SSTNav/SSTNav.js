import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import DistractionLogo from './img/distraction.svg';

class SSTNav extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const PackageLogo = <div><img className="Package-Logo" src={DistractionLogo} /><span className="dark-green small"><em>Insights</em></span></div>;

    return (
      <div>
        <div className="Package-Location center-align">
          {PackageLogo}
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