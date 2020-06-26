import React from 'react';
import logo from './images/emmLogo.png';
import './style.scss';
import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import globalFuncs from '../../utils/global-functions';
import EMMOverview from './EMMOverview'
import EMMPhaseAnalysis from './EMMPhaseAnalysis'

const ConfirmPublishDialog = (props) => {
  const { publishDialogOpen, closePublishDialog } = props;
  return (
    <Dialog
      open={publishDialogOpen}
      onClose={()=>closePublishDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="publish-dialog"
    >
      <DialogTitle id="alert-dialog-title">Are you sure you want to publish?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Publishing a report will allow customers to access it from eM&M Cases. This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>closePublishDialog(false)} className="cancel-publish" color="primary">
          Cancel
        </Button>
        <Button onClick={()=>closePublishDialog(true)} variant="outlined" className="primary publish-button" color="primary" autoFocus>
          Publish
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default class EMMReports extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isScriptReady: false,
      isPublished: false,
      publishDialogOpen: false
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
    const jsonBody = {
      "name": emmReportData.name,
      "published": true
    }
    globalFuncs.genericFetch(process.env.EMMPUBLISH_API, 'PATCH', userToken, jsonBody)
      .then(result => {
        if (result !== 'error' && result !== 'conflict') {
          this.setState({ isPublished: true })
        }
      });
  }

  closePublishDialog(choice) {
    if (choice) {
      this.publishReport();
    }
    this.setState({
      publishDialogOpen: false
    })
  }

  render() {
    const { emmReportData, emmReportTab, emmPublishAccess } = this.props;
    const { isPublished, publishDialogOpen } = this.state;

    let showPublishButton;
    if (emmReportData)
      showPublishButton = emmPublishAccess && !emmReportData.published && !isPublished

    return (
      <div className="EMM-REPORTS-SCROLL">
        <ConfirmPublishDialog
          publishDialogOpen={publishDialogOpen}
          closePublishDialog={(choice)=>this.closePublishDialog(choice)}
        />
        {(emmReportData) &&
          <div className="EMM-REPORTS relative">
            <div className="close-emm" onClick={()=>this.props.hideEMMReport()}><Icon color="#000000" path={mdiClose} size={'14px'} /> Close Report</div>
            <div className={`EMM-Reports-Header relative center-align ${(showPublishButton) && 'has-publish-button'}`}>
              <img className="absolute" src={logo} />
              {
                (showPublishButton) &&
                  <Button variant="outlined" className="primary publish-button" onClick={() => this.setState({ publishDialogOpen : true })}>{(isPublished) ? 'Unpublish' : 'Publish'} Report</Button>
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
