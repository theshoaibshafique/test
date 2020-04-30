import React from 'react';
import { NavLink } from 'react-router-dom';
import './style.scss';
import logo from './img/SST-Product_Insights_sketch.png';
import { List, ListItem } from '@material-ui/core';

class SSTNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="sstnav dark-blue" >
        <List>
          <ListItem className="Package-Location center-align" disableGutters>
            <img className="Package-Logo" src={logo} />
          </ListItem>

          <NavLink to="/dashboard" className='text-link ' ><ListItem >Dashboard</ListItem></NavLink>
          {(this.props.emmAccess) &&
            <NavLink to="/emmcases" className='text-link' ><ListItem >eM&M Cases</ListItem></NavLink>
          }
          {(this.props.emmPublishAccess) &&
            <NavLink to="/emmpublish" className='text-link' ><ListItem >eM&M Publisher</ListItem></NavLink>
          }
          {/* 
            <li>Efficiency</li>
            <li>Surgical Safety Checklist</li>
          */}
        </List>

        <List className="bottom-left">
          {(this.props.emmRequestAccess) &&
            <NavLink to="/requestemm" className='text-link' ><ListItem className="link-border">Request for eM&M</ListItem></NavLink>
          }
          {(this.props.userManagementAccess) &&
            <NavLink to="/usermanagement" className='text-link' ><ListItem >User Management</ListItem></NavLink>
          }
          <NavLink to="/my-profile" className='text-link' ><ListItem >My Profile</ListItem></NavLink>

          <NavLink to="/" className='text-link' isActive={()=>false} ><ListItem className="link-border text-link">{this.props.userLogin}</ListItem></NavLink>
        </List>


      </div>
    );
  }
}

export default SSTNav;