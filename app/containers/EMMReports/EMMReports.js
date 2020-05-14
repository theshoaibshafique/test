import React from 'react';
import Button from '@material-ui/core/Button';
import logo from './images/emmLogo.png';
import './style.scss';
import Icon from '@mdi/react'
import { mdiClose, mdiInformationOutline  } from '@mdi/js';
import globalFuncs from '../../utils/global-functions';
import EMMOverview from './EMMOverview'
import EMMPhase from './EMMPhase'
import { Drawer, List, ListItem, ListItemText, Grid, Typography, Card, Paper } from '@material-ui/core';

export default class EMMReports extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedEMMTab: 'overview'
    };
  }

  goBack() {
    this.props.goBack();
  };

  switchTab(currentTab) {
    let { selectedEMMTab } = this.state;
    if (currentTab != selectedEMMTab) {
      this.setState({
        selectedEMMTab: (selectedEMMTab == 'overview') ? 'phase' : 'overview'
      })
    }
  }

  render() {
    let { selectedEMMTab } = this.state;
    return (
      <div className="EMM-REPORTS full-height relative">
        <div className="close-emm" onClick={()=>this.props.hideEMMReport()}><Icon color="#000000" path={mdiClose} size={'14px'} /> Close Report</div>
        <div className="EMM-Reports-Header relative center-align">
          <img className="absolute" src={logo} />
          <div className="EMM-Tab-Selector">
            <div
              className={`EMM-Tab center-align ${(selectedEMMTab == 'overview') && 'selected'}`}
              onClick={()=>this.switchTab('overview')}>
                Overview
            </div>
            <div
              className={`EMM-Tab center-align ${(selectedEMMTab == 'phase') && 'selected'}`}
              onClick={()=>this.switchTab('phase')}>
                Phase Analysis
            </div>
          </div>
        </div>
        {selectedEMMTab == 'overview' ? <EMMOverview /> : <EMMPhase />}
      </div>
    );
  }
}
