import React from 'react';
import logo from './images/emmLogo.png';
import './style.scss';
import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js';
import { Button } from '@material-ui/core';
import globalFuncs from '../../utils/global-functions';
import EMMOverview from './EMMOverview'
import EMMPhaseAnalysis from './EMMPhaseAnalysis'
import emmData from '../../src/emm.json';

export default class EMMReports extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isScriptReady: false,
      isPublished: false
    }
  }

  componentDidMount() {
    this.loadAMPScript();
    this.getReport();
  };

  getReport() {
    const { emmReportID, userToken } = this.props;
    globalFuncs.genericFetch(process.env.EMMREPORT_API + '/' + emmReportID, 'get', userToken, {})
      .then(caseData => {
        this.props.setEMMReport(caseData)
        this.setState({
          isPublished: caseData.published
        })
      });
  };

  loadAMPScript() {
    if (document.querySelector('#amp-azure')) {
      this.setState({ isScriptReady: true });
    };
    var scriptTag = document.createElement('script');
    var linkTag = document.createElement('link');
    linkTag.rel = 'stylesheet';
    scriptTag.id = 'amp-azure';
    scriptTag.src = '//amp.azure.net/libs/amp/2.2.4/azuremediaplayer.min.js';
    linkTag.href = '//amp.azure.net/libs/amp/2.2.4/skins/' + "amp-default" + '/azuremediaplayer.min.css';
    document.body.appendChild(scriptTag);
    document.head.insertBefore(linkTag, document.head.firstChild);
    scriptTag.onload = () => {
      this.setState({ isScriptReady: true });
    };
  }

  switchTab(currentTab) {
    const { emmReportTab } = this.props;
    if (currentTab != emmReportTab) {
      this.props.setEmmTab((emmReportTab == 'overview') ? 'phase' : 'overview')
    }
  }

  publishReport() {
    let { emmReportData, userToken } = this.props;
    let { isPublished } = this.state;
    const jsonBody = {
      "name": emmReportData.name,
      "published": !isPublished
    }
    globalFuncs.genericFetch(process.env.EMMPUBLISH_API, 'PATCH', userToken, jsonBody)
      .then(result => {
        if (result !== 'error' && result !== 'conflict') {
          this.setState({ isPublished: !isPublished })
        }
      });
  }

  render() {
    const { emmReportData, emmReportTab, emmPublishAccess } = this.props;
    const { isPublished } = this.state;

    // let isReportPublished;
    // if (emmReportData)
    //   isReportPublished = emmPublishAccess && !emmReportData.published

    return (
      <div className="EMM-REPORTS full-height relative">
        {(emmReportData) &&
          <div>
            <div className="close-emm" onClick={()=>this.props.hideEMMReport()}><Icon color="#000000" path={mdiClose} size={'14px'} /> Close Report</div>
            <div className={`EMM-Reports-Header relative center-align ${(emmPublishAccess) && 'has-publish-button'}`}>
              <img className="absolute" src={logo} />
              {
                (emmPublishAccess) &&
                  <Button variant="outlined" className="primary publish-button" onClick={() => this.publishReport()}>{(isPublished) ? 'Unpublish' : 'Publish'} Report</Button>
              }
              <div className="EMM-Tab-Selector">
                <div
                  className={`EMM-Tab center-align ${(emmReportTab == 'overview') && 'selected'}`}
                  onClick={()=>this.switchTab('overview')}>
                    Overview
                </div>
                <div
                  className={`EMM-Tab center-align ${(emmReportTab == 'phase') && 'selected'}`}
                  onClick={()=>this.switchTab('phase')}>
                    Phase Analysis
                </div>
              </div>
            </div>
          {
            (emmReportTab === 'overview') ?
            <EMMOverview
            tabShowing={emmReportTab === 'overview'}
          />:
          <EMMPhaseAnalysis
            tabShowing={emmReportTab === 'phase'}
            scriptReady={this.state.isScriptReady}
            phases={emmReportData.enhancedMMPages}/>
          }
          </div>
        }
      </div>
    );
  }
}
