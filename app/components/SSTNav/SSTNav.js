import React from 'react';
import { NavLink } from 'react-router-dom';
import './style.scss';
import logo from 'images/SST-Product_Insights_sketch.png';
import { List, ListItem, Collapse, Grid, MenuItem, Menu } from '@material-ui/core';
import IconExpandLess from '@material-ui/icons/ExpandLess'
import IconExpandMore from '@material-ui/icons/ExpandMore'
import LoadingOverlay from 'react-loading-overlay';
import alphaTag from 'images/alpha-tag.svg';
import globalFunctions from '../../utils/global-functions';
import { redirectLogin } from '../../utils/Auth';
import IdleTimer from 'react-idle-timer';
import * as CONSTANTS from '../../constants';

class SSTNav extends React.Component {
  constructor(props) {
    super(props);
    this.sscLinks = ["/sschecklist", "/compliance", "/engagement", "/quality"]
    this.efficiencyLinks = ["/efficiency", "/daysStarting", "/turnoverTime", "/orUtilization", "/caseAnalysis"]
    this.state = {
      pathname: this.props.pathname,
      isSSCOpen: this.isInNav(this.sscLinks, this.props.pathname),
      isEfficiencyOpen: this.isInNav(this.efficiencyLinks, this.props.pathname),
      menu: null
    }
    this.onIdle = this._onIdle.bind(this)
  }

  componentDidUpdate() {
    if (this.props.pathname != this.state.pathname) {
      this.setState({
        isSSCOpen: this.isInNav(this.sscLinks, this.props.pathname),
        isEfficiencyOpen: this.isInNav(this.efficiencyLinks, this.props.pathname),
        pathname: this.props.pathname
      });
    }
  }

  isInNav(links, pathname) {
    return new RegExp(links.join("|")).test(pathname);
  }

  toggleSSC() {
    this.setState({ isSSCOpen: !this.state.isSSCOpen })
  }
  toggleEfficiency() {
    this.setState({ isEfficiencyOpen: !this.state.isEfficiencyOpen })
  }

  openMenu(e) {
    this.setState({ menu: e.currentTarget });
  }
  closeMenu() {
    this.setState({ menu: null })
  }

  logout() {
    const { refreshToken, expiresAt } = JSON.parse(localStorage.getItem('refreshToken')) || {};
    const body = {
      refresh_token: refreshToken || ""
    }
    const { logger } = this.props;
    logger.manualAddLog('session', 'user-logout');
    logger.sendLogs()
    localStorage.setItem('refreshToken', null);
    globalFunctions.authFetch(`${process.env.AUTH_API}revoke`, 'POST', body)
      .then(result => {
        window.location.replace(redirectLogin())
      }).catch(error => {
        console.error(error)
        window.location.replace(redirectLogin())
      });
  }

  _onIdle(e) {
    this.logout();
  }
  render() {

    return (
      <Grid container spacing={0} className="sstnav subtle-subtext" style={{ height: "100%" }}>
        <Grid item xs={12}>
          <List disablePadding >
            <ListItem className="Package-Location center-align" disableGutters>
              <NavLink to="/dashboard">
                <img className="Package-Logo" src={logo} />
              </NavLink>
            </ListItem>

            {this.props.isLoading &&
              <ListItem disableGutters><LoadingOverlay
                active={this.props.isLoading}
                spinner
                className="overlays text-link"
                styles={{
                  overlay: (base) => ({
                    ...base,
                    background: 'none',
                    color: '#000'
                  }),
                  spinner: (base) => ({
                    ...base,
                    width: 40,
                    '& svg circle': {
                      stroke: 'rgba(0, 0, 0, 0.5)'
                    }
                  })
                }}
              >

              </LoadingOverlay>
              </ListItem>
            }
            {(this.props.caseDiscoveryAccess) &&
              <ListItem disableGutters id="caseDiscovery-nav"><NavLink to="/caseDiscovery" className='text-link' >Case Discovery</NavLink></ListItem>
            }
            {(this.props.efficiencyAccess) &&
              <ListItem disableGutters>
                <NavLink to="/efficiency" className='text-link'>
                  <div>Efficiency</div>
                  <div style={{ position: 'absolute', right: 8, top: 14, cursor: 'pointer' }} onClick={() => this.toggleEfficiency()}>
                    {this.state.isEfficiencyOpen ? <IconExpandLess /> : <IconExpandMore />}
                  </div>
                </NavLink>

              </ListItem>
            }
            {(this.props.efficiencyAccess) &&
              <Collapse in={this.state.isEfficiencyOpen} timeout="auto" unmountOnExit>
                <ListItem disableGutters><NavLink to="/daysStarting" className='text-link sub-item' >First Case On-Time</NavLink></ListItem>
                <ListItem disableGutters><NavLink to="/turnoverTime" className='text-link sub-item' >Turnover Time</NavLink></ListItem>
                <ListItem disableGutters><NavLink to="/orUtilization" className='text-link sub-item' >Block Utilization</NavLink></ListItem>
              </Collapse>
            }
            
            {(this.props.emmAccess) &&
              <ListItem disableGutters><NavLink to="/emmcases" className='text-link' >eM&M</NavLink></ListItem>
            }
            {(this.props.emmPublishAccess) &&
              <ListItem disableGutters><NavLink to="/emmpublish" className='text-link' >eM&M Publisher</NavLink></ListItem>
            }

            
            

            {(this.props.sscAccess) &&
              <ListItem disableGutters>
                <NavLink to="/sschecklist" className='text-link'>
                  <div>Surgical Safety Checklist</div>
                  <div style={{ position: 'absolute', right: 8, top: 14, cursor: 'pointer' }} onClick={() => this.toggleSSC()}>
                    {this.state.isSSCOpen ? <IconExpandLess /> : <IconExpandMore />}
                  </div>
                </NavLink>
              </ListItem>
            }
            {(this.props.sscAccess) &&
              <Collapse in={this.state.isSSCOpen} timeout="auto" unmountOnExit>
                <ListItem disableGutters><NavLink to="/compliance" className='text-link sub-item' >Compliance</NavLink></ListItem>
                <ListItem disableGutters><NavLink to="/engagement" className='text-link sub-item' >Engagement</NavLink></ListItem>
                <ListItem disableGutters><NavLink to="/quality" className='text-link sub-item' >Quality</NavLink></ListItem>
              </Collapse>
            }
            
          </List>
        </Grid>
        <Grid item xs={12} style={{ display: 'flex', alignItems: 'flex-end' }}>
          <List disablePadding style={{ width: '100%' }}>
            {(this.props.emmRequestAccess) &&
              <ListItem disableGutters><NavLink to="/requestemm" className='text-link' >Request for eM&M</NavLink></ListItem>
            }
            {(this.props.adminPanelAccess) &&
              <ListItem disableGutters><NavLink to="/adminPanel" className='text-link' >Admin Panel</NavLink></ListItem>
            }
            <ListItem disableGutters style={{ marginBottom: 20 }}><div className='text-link' onClick={(e) => this.openMenu(e)}>My Account</div></ListItem>
            <Menu
              anchorEl={this.state.menu}
              open={Boolean(this.state.menu)}
              onClose={() => this.closeMenu()}
              style={{ left: 90 }}
            >
              <MenuItem className="sst-menu-item">
                <NavLink to="/my-profile" onClick={() => this.closeMenu()} style={{ color: 'unset', textDecoration: 'none' }} >My Profile</NavLink>
              </MenuItem>
              <MenuItem className="sst-menu-item">
                <div onClick={() => this.logout()}>Logout</div>
              </MenuItem>
            </Menu>
            {/* <div hidden ><NavLink to="/" className='text-link' isActive={() => false} >{this.props.userLogin}</NavLink></div> */}

          </List>
        </Grid>
        <IdleTimer
          element={document}
          onIdle={this.onIdle}
          timeout={CONSTANTS.idleTimeout} />
      </Grid>
    );
  }
}

export default SSTNav;