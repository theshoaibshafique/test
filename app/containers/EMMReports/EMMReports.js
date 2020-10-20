import React from 'react';
import emmLogo from './images/emmLogo.png';
import emmVideo from './images/emmVideo.png';
import emmSummary from './images/emmSummary.png';
import './style.scss';
import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import globalFuncs from '../../utils/global-functions';
import EMMOverview from './EMMOverview'
import EMMPhaseAnalysis from './EMMPhaseAnalysis'

const ConfirmPublishDialog = (props) => {
  const { dialogOpen, closePublishDialog } = props;
  return (
    <Dialog
      open={dialogOpen}
      onClose={()=>closePublishDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="publish-dialog"
    >
      <DialogTitle>Are you sure you want to publish?</DialogTitle>
      <DialogContent>
        <DialogContentText className="confirm-publish-text">
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

const ConfirmPresenterDialog = (props) => {
  const { dialogOpen, closePresenterDialog } = props;
  return (
    <Dialog
      open={dialogOpen}
      onClose={()=>closePresenterDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="publish-dialog"
    >
      <DialogTitle className="red">Warning</DialogTitle>
      <DialogContent>
        <DialogContentText className="confirm-publish-text">
        Turning on Presenter Mode will cause the videos in this report to be no longer secured, but will enable sharing over video conferencing tools. Do you wish to proceed?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>closePresenterDialog(false)} className="cancel-publish" color="primary">
          Cancel
        </Button>
        <Button onClick={()=>closePresenterDialog(true)} variant="outlined" className="primary publish-button" color="primary" autoFocus>
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const OnBoardDialog = (props) => {
  const { dialogOpen, dialogClose } = props;
  return (
    <Dialog
      className="onboarding-dialog"
      open={dialogOpen}
      onClose={()=>dialogClose()}
    >
      <DialogContent className="onboarding-dialog-content relative">
        <IconButton disableRipple disableFocusRipple onClick={() => dialogClose()} className='close-button absolute'><CloseIcon fontSize='small' /></IconButton>
        <h2>What is the Enhanced M&M Report</h2>
        <p className="title-p">The Enhanced M&M report offers video-based insights into a specific case.<br />The report is broken down into two key sections: Overview and Phase Analysis.</p>
        <div className="content-container flex">
          <div className="content-tile">
            <h5>Overview</h5>
            <img src={emmSummary} />
            <p className="content-p">Overview highlights the basic case details, including the conduct of the surgical safety checklist, and results on key indices of performance.</p>
          </div>
          <div className="content-tile">
            <h5>Phase Analysis</h5>
            <img src={emmVideo} />
            <p className="content-p">Phase Analysis offers the ability to either view the entire procedural video, or to focus on video clips that identify both non-routine, and intra-operative adverse events.</p>
          </div>
        </div>
        <div className="right-align">
          <Button disableElevation disableRipple variant="contained" className="secondary" style={{ marginTop: 40 }} onClick={() => dialogClose()}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


export default class EMMReports extends React.PureComponent {
  constructor(props) {
    super(props);
    this.ONBOARD_TYPE = "EMMReport";
    this.state = {
      isScriptReady: false,
      isPublished: false,
      publishDialogOpen: false,
      onBoardDialogOpen: false,
      isSafari: navigator.vendor.includes('Apple')
    }
  }

  componentDidMount() {
    this.loadAMPScript();
    this.getReport();
    this.openOnboarding();
  };

  openOnboarding() {
    //If they already did the onboard - Dont bother checking API
    if (localStorage.getItem(`${this.props.userEmail}-${this.ONBOARD_TYPE}`)) {
      return;
    }
    globalFuncs.axiosFetch(process.env.ONBOARD_API, 'get', this.props.userToken, {})
      .then(result => {
        var data = result.data;

        if (data && data.onboardCompleted && data.onboardCompleted.includes && data.onboardCompleted.includes(this.ONBOARD_TYPE)) {
          return;
        }
        this.setState({ onBoardDialogOpen: true })
        this.updateOnboardStatus();
      }).catch((error) => {

      });
  }

  updateOnboardStatus() {
    let jsonBody = { onboardCompleted: [this.ONBOARD_TYPE] };
    globalFuncs.axiosFetch(process.env.USERDETAILSMODIFY_API, 'post', this.props.userToken, jsonBody)
      .then(result => {
        //Cache onboard report name so we know not to open it again automatically
        if (result.data) {
          localStorage.setItem(`${this.props.userEmail}-${this.ONBOARD_TYPE}`, true);
        }
      }).catch((error) => {

      });
  }

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
    scriptTag.src = '//amp.azure.net/libs/amp/latest/azuremediaplayer.min.js';
    linkTag.href = '//amp.azure.net/libs/amp/latest/skins/amp-default/azuremediaplayer.min.css';
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

  closePresenterDialog(choice) {
    const { setEMMPresenterMode, setEMMPresenterDialog } = this.props;
    (choice) && setEMMPresenterMode(choice);
    setEMMPresenterDialog(false);
  }

  closeEMMReport() {
    this.props.setEMMPresenterMode(false);
    this.props.hideEMMReport();
  }

  render() {
    const { emmReportData, emmReportTab, emmPublishAccess, emmPresenterDialog, emmPresenterMode } = this.props;
    const { isPublished, publishDialogOpen, onBoardDialogOpen, isSafari } = this.state;

    let showPublishButton;
    if (emmReportData)
      showPublishButton = emmPublishAccess && !emmReportData.published && !isPublished

    return (
      <div className="EMM-REPORTS-SCROLL">
        {(isSafari && !emmPresenterMode) && <div className="Presenter-Mode-Banner safari-warning">Warning: Enhanced M&M Reports contains videos that are currently not supported on Safari. You may still access the reports and view its contents, but we recommend using the latest version of Google Chrome or Microsoft Edge browsers for the full experience.</div>}
        {(emmPresenterMode) &&
          <div className="Presenter-Mode-Banner">You are in Presenter Mode</div>
        }
        <ConfirmPublishDialog
          dialogOpen={publishDialogOpen}
          closePublishDialog={(choice)=>this.closePublishDialog(choice)}
          />
        <ConfirmPresenterDialog
          dialogOpen={emmPresenterDialog}
          closePresenterDialog={(choice)=>this.closePresenterDialog(choice)}
        />
        <OnBoardDialog
          dialogOpen={onBoardDialogOpen}
          dialogClose={()=>this.setState({ onBoardDialogOpen: false })}
        />
        {(emmReportData) &&
          <div className={`EMM-REPORTS ${(isSafari && !emmPresenterMode) ? 'safari-banner' : (emmPresenterMode) && 'presenter-banner'} relative`}>
            <div className="close-emm" onClick={()=>this.closeEMMReport()}><Icon color="#000000" path={mdiClose} size={'14px'} /> Close Report</div>
            <div className={`EMM-Reports-Header relative center-align ${(showPublishButton) && 'has-publish-button'}`}>
              <img className="absolute" src={emmLogo} />
              <div className="onboarding-open absolute" onClick={()=>this.setState({ onBoardDialogOpen: true })}>What’s this report about?</div>
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
          {(emmReportTab === 'overview') ?
            <EMMOverview
              tabShowing={emmReportTab === 'overview'}
            /> :
            <EMMPhaseAnalysis
              tabShowing={emmReportTab === 'phase'}
              scriptReady={this.state.isScriptReady}
              phases={emmReportData.enhancedMMPages}
            />
          }
          </div>
        }
      </div>
    );
  }
}
