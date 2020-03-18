import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import logo from './img/SST-Product_Insights_sketch.png';

class SSTNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="sstnav">
        <div className="Package-Location center-align">
          <div><img className="Package-Logo" src={logo} /></div>
        </div>
        <ul className="dark-blue">
          <li className="link-border"><Link to="/maindashboard" className='text-link'>Dashboard</Link></li>
          {(this.props.emmAccess) &&
            <li><Link to="/emmcases" className='text-link'>eM&M Cases</Link></li>
          }
          {/* 
            <li>Efficiency</li>
            <li>Surgical Safety Checklist</li>
          */}

          <div className="bottom-left">
            {(this.props.emmRequestAccess) && 
              <li className="link-border"><Link to="/requestemm" className='text-link'>Request for eM&M</Link></li>
            }
            {(this.props.userManagementAccess) &&
              <li className="link-border"><Link to="/usermanagement" className='text-link'>User Management</Link></li> 
            }
            <li className="link-border"><Link to="/my-profile" className='text-link'>My Profile</Link></li>
          </div>
        </ul>
      </div>
    );
  }
}

export default SSTNav;