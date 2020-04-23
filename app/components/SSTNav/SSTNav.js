import React from 'react';
import { NavLink } from 'react-router-dom';
import './style.scss';
import logo from './img/SST-Product_Insights_sketch.png';
import { List, ListItem, Collapse } from '@material-ui/core';
import IconExpandLess from '@material-ui/icons/ExpandLess'
import IconExpandMore from '@material-ui/icons/ExpandMore'
class SSTNav extends React.Component {
  constructor(props) {
    super(props);
    this.sscLinks = ["/sschecklist", "/checklistScore", "/engagementScore", "/qualityScore"]
    this.state = {
      pathname: this.props.pathname,
      isSSCOpen: this.isSSCNav(this.props.pathname)
    }

  }

  componentDidUpdate() {
    if (this.props.pathname != this.state.pathname) {
      this.setState({ isSSCOpen: this.isSSCNav(this.props.pathname), pathname: this.props.pathname });
    }
  }

  isSSCNav(pathname) {
    return new RegExp(this.sscLinks.join("|")).test(pathname);
  }

  toggleSSC() {
    this.setState({ isSSCOpen: !this.state.isSSCOpen })
  }


  render() {
    return (
      <div className="sstnav dark-blue" >
        <List disablePadding >
          <ListItem className="Package-Location center-align" disableGutters>
            <img className="Package-Logo" src={logo} />
          </ListItem>

          <ListItem disableGutters><NavLink to="/maindashboard" className='text-link '>Dashboard</NavLink></ListItem>
          {(this.props.emmAccess) &&
            <ListItem disableGutters><NavLink to="/emmcases" className='text-link' >eM&M Cases</NavLink></ListItem>
          }
          {(this.props.emmPublishAccess) &&
            <ListItem disableGutters><NavLink to="/emmpublish" className='text-link' >eM&M Publisher</NavLink></ListItem>
          }
          {/* 
            <li>Efficiency</li>
            <li>Surgical Safety Checklist</li>
          */}

          <ListItem disableGutters>
            <NavLink to="/sschecklist" className='text-link'>
              <div>Surgical Safety Checklist</div>
            </NavLink>
            <div style={{ marginRight: 16, position: 'absolute', right:0}} onClick={() => this.toggleSSC()}>
              {this.state.isSSCOpen ? <IconExpandLess /> : <IconExpandMore />}
            </div>
          </ListItem>

          <Collapse in={this.state.isSSCOpen} timeout="auto" unmountOnExit>
            <ListItem disableGutters><NavLink to="/checklistScore" className='text-link sub-item' >Checklist Score</NavLink></ListItem>
            <ListItem disableGutters><NavLink to="/engagementScore" className='text-link sub-item' >Engagement Score</NavLink></ListItem>
            <ListItem disableGutters><NavLink to="/qualityScore" className='text-link sub-item' >Quality Score</NavLink></ListItem>
          </Collapse>
        </List>

        <List disablePadding className="bottom-left">
          {(this.props.emmRequestAccess) &&
            <ListItem disableGutters><NavLink to="/requestemm" className='text-link' >Request for eM&M</NavLink></ListItem>
          }
          {(this.props.userManagementAccess) &&
            <ListItem  disableGutters><NavLink to="/usermanagement" className='text-link' >User Management</NavLink></ListItem>
          }
          <ListItem disableGutters><NavLink to="/my-profile" className='text-link' >My Profile</NavLink></ListItem>

          <ListItem disableGutters style={{marginBottom:20}}><NavLink to="/" className='text-link' isActive={() => false} >{this.props.userLogin}</NavLink></ListItem>
        </List>


      </div>
    );
  }
}

export default SSTNav;