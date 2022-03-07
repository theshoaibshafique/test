import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './style.scss';
import logo from 'images/SST-Product_Insights_sketch.png';
import { List, ListItem, Collapse, Grid, MenuItem, Menu } from '@material-ui/core';
import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';
import LoadingOverlay from 'react-loading-overlay';
import { mdiCogOutline, mdiShieldAccountVariantOutline, mdiShieldAccountVariant, mdiClipboardTextOutline } from '@mdi/js';
import Icon from '@mdi/react';
import globalFunctions from '../../utils/global-functions';
import { redirectLogin } from '../../utils/Auth';
import IdleTimer from 'react-idle-timer';
import * as CONSTANTS from '../../constants';
import { ProfileIcon, SwitchFacilityModal } from '../SharedComponents/SharedComponents';

class SSTNav extends React.Component {
  constructor(props) {
    super(props);
    this.sscLinks = ['/sschecklist', '/compliance', '/engagement', '/quality'];
    this.efficiencyLinks = ['/efficiency', '/daysStarting', '/turnovertime', '/orUtilization', '/caseAnalysis'];
    this.efficiencyV2Links = ['/efficiencyV2', '/efficiencyV2/case-on-time', '/efficiencyV2/turnover-time', '/efficiencyV2/or-utilization', '/efficiencyV2/case-scheduling'];
    this.emmLinks = ['/emmcases', '/emm', '/emmpublish', '/requestemm'];
    this.state = {
      pathname: this.props.pathname,
      isSSCOpen: this.isInNav(this.sscLinks, this.props.pathname),
      isEfficiencyOpen: this.isInNav(this.efficiencyLinks, this.props.pathname),
      isEfficiencyV2Open: this.isInNav(this.efficiencyV2Links, this.props.pathname),
      isEMMOpen: this.isInNav(this.emmLinks, this.props.pathname),
      menu: null,
      switchFacility: false
    }
    this.onIdle = this._onIdle.bind(this)
  }

  componentDidUpdate() {
    if (this.props.pathname != this.state.pathname) {
      this.setState({
        isSSCOpen: this.isInNav(this.sscLinks, this.props.pathname),
        // isEfficiencyOpen: this.isInNav(this.efficiencyLinks, this.props.pathname),
        // isEfficiencyV2Open: this.isInNav(this.efficiencyV2Links, this.props.pathname),
        isEMMOpen: this.isInNav(this.emmLinks, this.props.pathname),
        pathname: this.props.pathname
      });
    }
  }

  isInNav(links, pathname) {
    return new RegExp(links.join('|')).test(pathname);
  }

  toggleSSC() {
    this.setState({ isSSCOpen: !this.state.isSSCOpen });
  }

  toggleEfficiency = () => {
    this.setState({ isEfficiencyOpen: !this.state.isEfficiencyOpen });
  }
  toggleEfficiencyV2 = () => {
    this.setState({ isEfficiencyV2Open: !this.state.isEfficiencyV2Open });
  }
  toggleEMM() {
    this.setState({ isEMMOpen: !this.state.isEMMOpen });
  }

  openMenu(e) {
    this.setState({ menu: e.currentTarget });
  }
  closeMenu() {
    this.setState({ menu: null });
  }

  logout() {
    const { refreshToken, expiresAt } = JSON.parse(localStorage.getItem('refreshToken')) || {};
    const body = {
      refresh_token: refreshToken || ''
    };
    const { logger } = this.props;
    logger?.manualAddLog('session', 'user-logout');
    logger?.sendLogs();
    localStorage.setItem('refreshToken', null);
    globalFunctions.authFetch(`${process.env.AUTH_API}revoke`, 'POST', body)
      .then((result) => {
        window.location.replace(redirectLogin());
      }).catch((error) => {
        console.error(error);
        window.location.replace(redirectLogin());
      });
  }

  _onIdle(e) {
    this.logout();
  }

  handleSwitchFacility(isSwitching) {
    this.setState({
      switchFacility: isSwitching,
      menu: null
    });
  }

  canSwitchFacility() {
    return Object.keys(this.props.facilityDetails).length >= 2;
  }

  render() {
    const hasEMMPages = this.props.emmPublishAccess || this.props.emmRequestAccess;

    let facilityMenuItem = '';
    if (this.canSwitchFacility()) {
      facilityMenuItem = (
        <MenuItem className="sst-menu-item">
          <div onClick={() => this.handleSwitchFacility(true)}>Switch Facility</div>
        </MenuItem>
      );
    }
    return (
      <Grid container spacing={0} className="sstnav subtle-subtext" style={{ height: '100%' }}>
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
              <ListItem disableGutters id="caseDiscovery-nav"><NavLink to="/caseDiscovery" className="text-link" >Case Discovery</NavLink></ListItem>
            }
            {/* 
            {(this.props.efficiencyAccess) &&
            <ListItem disableGutters>
              <NavLink to="/efficiency" className="text-link">
                <div>Efficiency</div>
                <div
                  style={{
                    position: 'absolute', right: 8, top: 14, cursor: 'pointer'
                  }}
                  onClick={this.toggleEfficiency}
                >
                  {this.state.isEfficiencyOpen ? <IconExpandLess /> : <IconExpandMore />}
                </div>
              </NavLink>

            </ListItem>
            }

            {(this.props.efficiencyAccess) &&
            <Collapse in={this.state.isEfficiencyOpen} timeout="auto" unmountOnExit>
              <ListItem disableGutters><NavLink to="/daysStarting" className="text-link sub-item" >First Case On-Time</NavLink></ListItem>
              <ListItem disableGutters><NavLink to="/turnoverTime" className="text-link sub-item" >Turnover Time</NavLink></ListItem>
              <ListItem disableGutters><NavLink to="/orUtilization" className="text-link sub-item" >Block Utilization</NavLink></ListItem>
            </Collapse>
            } */}

            {(this.props.efficiencyAccess) &&
              <ListItem disableGutters>
                <NavLink exact to="/efficiencyV2" className="text-link">
                  <div>Efficiency</div>
                  <div
                    style={{
                      position: 'absolute', right: 8, top: 14, cursor: 'pointer'
                    }}
                    onClick={this.toggleEfficiencyV2}
                  >
                    {this.state.isEfficiencyV2Open ? <IconExpandLess /> : <IconExpandMore />}
                  </div>
                </NavLink>

              </ListItem>
            }

            {(this.props.efficiencyAccess) &&
              <Collapse in={this.state.isEfficiencyV2Open} timeout="auto" unmountOnExit>
                <ListItem disableGutters><NavLink to="/efficiencyV2/or-utilization" className="text-link sub-item" >Block Utilization</NavLink></ListItem>
                <ListItem disableGutters><NavLink to="/efficiencyV2/case-on-time" className="text-link sub-item" >Case On-Time Start</NavLink></ListItem>
                <ListItem disableGutters><NavLink to="/efficiencyV2/case-scheduling" className="text-link sub-item" >Case Scheduling</NavLink></ListItem>
                <ListItem disableGutters><NavLink to="/efficiencyV2/turnover-time" className="text-link sub-item" >Turnover Time</NavLink></ListItem>
              </Collapse>
            }

            {(this.props.emmAccess) &&
              <ListItem disableGutters>
                <NavLink to="/emmcases" className="text-link" >
                  <div>eM&M</div>
                  {hasEMMPages && <div
                    style={{
                      position: 'absolute', right: 8, top: 14, cursor: 'pointer'
                    }}
                    onClick={() => this.toggleEMM()}
                  >
                    {this.state.isEMMOpen ? <IconExpandLess /> : <IconExpandMore />}
                  </div>
                  }
                </NavLink>
              </ListItem>
            }
            {hasEMMPages && (
              <Collapse in={this.state.isEMMOpen} timeout="auto" unmountOnExit>
                {(this.props.emmPublishAccess) && <ListItem disableGutters><NavLink to="/emmpublish" className="text-link sub-item" >eM&M Publisher</NavLink></ListItem>}
                {(this.props.emmRequestAccess) &&
                  <ListItem disableGutters>
                    <NavLink to="/requestemm" className="text-link  sub-item" >
                      Request for eM&M
                    </NavLink>
                  </ListItem>
                }
              </Collapse>
            )}

            {(this.props.sscAccess) &&
              <ListItem disableGutters>
                <NavLink to="/sschecklist" className="text-link">
                  <div>Surgical Safety Checklist</div>
                  <div
                    style={{
                      position: 'absolute', right: 8, top: 14, cursor: 'pointer'
                    }}
                    onClick={() => this.toggleSSC()}
                  >
                    {this.state.isSSCOpen ? <IconExpandLess /> : <IconExpandMore />}
                  </div>
                </NavLink>
              </ListItem>
            }
            {(this.props.sscAccess) &&
              <Collapse in={this.state.isSSCOpen} timeout="auto" unmountOnExit>
                <ListItem disableGutters><NavLink to="/compliance" className="text-link sub-item" >Compliance</NavLink></ListItem>
                <ListItem disableGutters><NavLink to="/engagement" className="text-link sub-item" >Engagement</NavLink></ListItem>
                <ListItem disableGutters><NavLink to="/quality" className="text-link sub-item" >Quality</NavLink></ListItem>
              </Collapse>
            }

          </List>
        </Grid>
        <Grid item xs={12} style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 20 }}>
          <List disablePadding style={{ width: '100%' }}>

            {(this.props.settingsAccess) &&
              <ListItem disableGutters>
                <NavLink to="/settings" className="text-link" ><Icon color="#000" style={{ marginRight: 16 }} path={mdiCogOutline} size={'24px'} />Settings</NavLink>
              </ListItem>
            }
            {(this.props.adminPanelAccess) &&
              <ListItem disableGutters>
                <NavLink to="/adminPanel" className="text-link" ><Icon color="#000" style={{ marginRight: 16 }} path={mdiShieldAccountVariantOutline} size={'24px'} />Admin Panel</NavLink>
              </ListItem>
            }
            {(this.props.sstAdminAccess) &&
              <ListItem disableGutters>
                <NavLink to="/sstAdmin" className="text-link" ><Icon color="#000" style={{ marginRight: 16 }} path={mdiShieldAccountVariant} size={'24px'} />SST Admin</NavLink>
              </ListItem>
            }
            <ListItem disableGutters >

              <div className="text-link my-account pointer" onClick={(e) => this.openMenu(e)}>
                <span><ProfileIcon size={24} className={'subtle-text'} firstName={this.props.firstName} lastName={this.props.lastName} /></span>
                My Account
              </div>
            </ListItem>
            <Menu
              anchorEl={this.state.menu}
              open={Boolean(this.state.menu)}
              onClose={() => this.closeMenu()}
              style={{ left: 90 }}
            >
              <MenuItem className="sst-menu-item">
                <NavLink to="/my-profile" onClick={() => this.closeMenu()} style={{ color: 'unset', textDecoration: 'none' }} >
                  My Profile
                </NavLink>
              </MenuItem>
              {facilityMenuItem}
              <MenuItem className="sst-menu-item">
                <div onClick={() => this.logout()}>Logout</div>
              </MenuItem>
            </Menu>
          </List>
          {(this.canSwitchFacility()) &&
            <SwitchFacilityModal
              history={this.props.history}
              setProfile={this.props.setProfile}
              userFacility={this.props.userFacility}
              facilityDetails={this.props.facilityDetails}
              open={Boolean(this.state.switchFacility)}
              toggleModal={this.handleSwitchFacility.bind(this)} />
          }
        </Grid>
        <IdleTimer
          element={document}
          onIdle={this.onIdle}
          timeout={CONSTANTS.idleTimeout}
        />
      </Grid>
    );
  }
}

export default SSTNav;
