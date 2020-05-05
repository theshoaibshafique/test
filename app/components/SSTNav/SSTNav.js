import React from 'react';
import { NavLink } from 'react-router-dom';
import './style.scss';
import logo from './img/SST-Product_Insights_sketch.png';
import { List, ListItem, Collapse, Grid, MenuItem, Menu } from '@material-ui/core';
import IconExpandLess from '@material-ui/icons/ExpandLess'
import IconExpandMore from '@material-ui/icons/ExpandMore'
class SSTNav extends React.Component {
  constructor(props) {
    super(props);
    this.sscLinks = ["/sschecklist", "/checklistScore", "/engagementScore", "/qualityScore"]
    this.state = {
      pathname: this.props.pathname,
      isSSCOpen: this.isSSCNav(this.props.pathname),
      menu: null
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

  openMenu(e) {
    this.setState({ menu: e.currentTarget });
  }
  closeMenu() {
    this.setState({ menu: null })
  }

  render() {
    return (
      <Grid container spacing={0} className="sstnav dark-blue" style={{ height: "100%" }}>
        <Grid item xs={12}>
          <List disablePadding >
            <ListItem className="Package-Location center-align" disableGutters>
              <img className="Package-Logo" src={logo} />
            </ListItem>

            <ListItem disableGutters><NavLink to="/dashboard" className='text-link '>Dashboard</NavLink></ListItem>
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
            {(this.props.emmPublishAccess) && 
              <ListItem disableGutters>
                <NavLink to="/sschecklist" className='text-link'>
                  <div>Surgical Safety Checklist</div>
                </NavLink>
                <div style={{ marginRight: 8, position: 'absolute', right: 0 }} onClick={() => this.toggleSSC()}>
                  {this.state.isSSCOpen ? <IconExpandLess /> : <IconExpandMore />}
                </div>
              </ListItem>
            }
            {(this.props.emmPublishAccess) && 
              <Collapse in={this.state.isSSCOpen} timeout="auto" unmountOnExit>
                <ListItem disableGutters><NavLink to="/checklistScore" className='text-link sub-item' >Checklist Score</NavLink></ListItem>
                <ListItem disableGutters><NavLink to="/engagementScore" className='text-link sub-item' >Engagement Score</NavLink></ListItem>
                <ListItem disableGutters><NavLink to="/qualityScore" className='text-link sub-item' >Quality Score</NavLink></ListItem>
              </Collapse>
            }
          </List>
        </Grid>
        <Grid item xs={12} style={{ display: 'flex', alignItems: 'flex-end' }}>
          <List disablePadding style={{ width: '100%' }}>
            {(this.props.emmRequestAccess) &&
              <ListItem disableGutters><NavLink to="/requestemm" className='text-link' >Request for eM&M</NavLink></ListItem>
            }
            {(this.props.userManagementAccess) &&
              <ListItem disableGutters><NavLink to="/usermanagement" className='text-link' >User Management</NavLink></ListItem>
            }
            <ListItem disableGutters style={{ marginBottom: 20 }}><div className='text-link' onClick={(e) => this.openMenu(e)}>My Account</div></ListItem>
            <Menu
              anchorEl={this.state.menu}
              open={Boolean(this.state.menu)}
              onClose={() => this.closeMenu()}
              style={{ left: 90 }}
            >
              <MenuItem>
                <NavLink to="/my-profile" onClick={() => this.closeMenu()} style={{ color: 'unset', textDecoration: 'none' }} >My Profile</NavLink>
              </MenuItem>
              <MenuItem>
                <div onClick={() => { this.props.logoutRef.current && this.props.logoutRef.current.click() }}>Logout</div>
              </MenuItem>
            </Menu>
            <div hidden ><NavLink to="/" className='text-link' isActive={() => false} >{this.props.userLogin}</NavLink></div>

          </List>
        </Grid>

      </Grid>
    );
  }
}

export default SSTNav;