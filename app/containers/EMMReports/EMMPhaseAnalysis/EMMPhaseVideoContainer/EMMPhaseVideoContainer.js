import React from 'react';
import './style.scss';
import globalFunctions from '../../../../utils/global-functions';
import EMMPhaseEvents from '../EMMPhaseEvents';
import ChecklistAnalysis from './ChecklistAnalysis';
import VideoTimeline from './VideoTimeline';
import { FormControlLabel, Switch, withStyles } from '@material-ui/core';

const videoOptions = {
  "nativeControlsForTouch": false,
  controls: true,
  fluid: true,
  playbackSpeed: {
    enabled: true,
    initialSpeed: 1.0,
    speedLevels: [
        { name: "x4.0", value: 4.0 },
        { name: "x3.0", value: 3.0 },
        { name: "x2.0", value: 2.0 },
        { name: "x1.0", value: 1.0 },
        { name: "x0.5", value: 0.5 },
    ]
  },
  "logo": { "enabled": false },
}

const SSTSwitch = withStyles((theme) => ({
  switchBase: {
    color: '#ABABAB',
    '&$checked': {
      color: '#3DB3E3',
    },
    '&$checked + $track': {
      opacity: 1,
      backgroundColor: '#028CC8',
    },
  },
  checked: {},
  track: {
    opacity: 1,
    backgroundColor: '#575757'
  }
}))(Switch);

export default class EMMPhaseVideoContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      videoID:'phaseAnalysisVideo',
      noVideo: false,
      selectedVideoClipID: 0
    }
  }

  componentDidMount() {
    this.destroyVideoPlayer();
    this.setSurgicalProcedureData();
    if (this.props.phaseData.name !== 'SurgicalProcedure') {
      this.changeVideo();
    }
  }

  componentDidUpdate(prevProps) {
    let { phaseData, emmPresenterMode } = this.props;
    if (prevProps.phaseData != phaseData) {
      this.setState({
        isProcedureStepWithTabs: false
      }, () => {
        this.setSurgicalProcedureData();
        if (phaseData.name !== 'SurgicalProcedure') {
          this.changeVideo();
        }
      })
    }

    if (prevProps.emmPresenterMode !== emmPresenterMode) {
      this.changeVideo();
    }
  }

  componentWillUnmount() {
    this.destroyVideoPlayer()
  }

  setSurgicalProcedureData() {
    let { phaseData } = this.props;
    if (phaseData.name == 'SurgicalProcedure') {
      const isProcedureStepWithTabs = (phaseData.name === 'SurgicalProcedure' && phaseData.enhancedMMData.length > 0 && phaseData.enhancedMMOpenData.length > 0);
      this.setState({
        isProcedureStepWithTabs: isProcedureStepWithTabs,
        selectedSurgicalTab: (phaseData.enhancedMMData.length > 0) ? 0 : 1
      }, () => {
        this.changeVideo();
      })
    }
  }

  getVideoID() {
    const { selectedSurgicalTab } = this.state;
    const { phaseData } = this.props;
    //Not surgical procedure tab
    if (phaseData.name !== 'SurgicalProcedure') {
      if (phaseData.enhancedMMData.length > 0)
        return phaseData.enhancedMMData[0].assets[0];
      else
        return null
    } else {
        if (selectedSurgicalTab == 0)
          return phaseData.enhancedMMVideo[0].assets[0];
        else
          return phaseData.enhancedMMOpenData[0].assets[0];
    }
  }

  changeVideo(updatedVideoID = null, videoIndex = 0) {
    const videoID = (updatedVideoID !== null) ? updatedVideoID : this.getVideoID();
    const { selectedSurgicalTab } = this.state;
    const { phaseData } = this.props;
    if (videoID) {
      if (phaseData.name !== 'SurgicalProcedure' || selectedSurgicalTab !== 0 ) {
        this.setState({ selectedVideoClipID: videoIndex })
      }
      this.createVideoPlayer(videoID)
    } else {
      this.setState({ noVideo: true })
      this.destroyVideoPlayer()
    }

  }

  createVideoPlayer(videoID) {
    const { emmPresenterMode, userToken } = this.props;
    this.setState({ noVideo: false })
    const mediaURL = `${(emmPresenterMode) ? process.env.PRESENTER_API : process.env.MEDIA_API}${videoID}`;
    globalFunctions.genericFetch(mediaURL, 'get', userToken, {})
      .then(result => {
        if (result) {
          this.myPlayer = amp(this.state.videoID, videoOptions);
          const presenterProtection = [
            {
              "type": "AES",
              "authenticationToken": result.token
            }
          ]
          const normalProtection = [
            {
              "type": "PlayReady",
              "authenticationToken": result.token
            },
            {
              "type": "Widevine",
              "authenticationToken": result.token
            }
          ]
          this.myPlayer.src([{
            src: result.url,
            type: "application/vnd.ms-sstr+xml",
            protectionInfo: (emmPresenterMode) ? presenterProtection : normalProtection
          }]);
          this.myPlayer.addEventListener('timeupdate', (e) => {
            this.props.setEMMVideoTime(parseInt(e.target.player.currentTime()))
          });
        }
      });
  }

  destroyVideoPlayer() {
    if (this.myPlayer) {
      this.myPlayer.dispose();
      this.props.setEMMVideoTime(0);
    }
  }

  seekVideo(time) {
      this.myPlayer.currentTime(time)
  }

  updateSelectedSurgicalTab(index) {
    this.setState({
      selectedSurgicalTab: index
    }, () => {
      this.changeVideo();
    })
  }

  getProcedureTabs() {
    let { selectedSurgicalTab } = this.state;
    const procedureTabTitles = ['Laparoscopic', 'Open']
    return (
      <div className="Surgical-Procedure-Tabs flex">
        {
          procedureTabTitles.map((tabTitle, index) => {
            return <div
              className={`Surgical-Procedure-Tab ${(selectedSurgicalTab == index) && 'selected'}`}
              onClick={()=>this.updateSelectedSurgicalTab(index)}
              >
              {tabTitle} Video</div>
            })
          }
      </div>
    )
  }

  switchPresenterMode = () => {
    const { emmPresenterMode, setEMMPresenterDialog, setEMMPresenterMode } = this.props;
    if (!emmPresenterMode) {
      //need to show warning if previous state is non presenter mode
      setEMMPresenterDialog(true)
    } else {
      //otherwise, can just turn off presenter mode
      setEMMPresenterMode(false)
    }
  }

  render() {
    const { phaseData, emmVideoTime, emmPresenterMode } = this.props;
    const { noVideo, selectedVideoClipID, isProcedureStepWithTabs, selectedSurgicalTab } = this.state;
    const showVideoTimeline = (phaseData.name === 'SurgicalProcedure' && phaseData.enhancedMMData.length > 0 && selectedSurgicalTab == 0)

    return (
      <div className="Emm-Phase-Video-Container relative">
        {(!noVideo) &&
          <div className="absolute" style={{right: '0px', top: '-38px'}}>
            <FormControlLabel
              control={
                <SSTSwitch
                  checked={emmPresenterMode}
                  onChange={this.switchPresenterMode}
                />
              }
              label="Presenter Mode"
            />
          </div>
        }
        {(isProcedureStepWithTabs) && this.getProcedureTabs()}
        {
          (noVideo && phaseData.checklistData.length == 0) ?
            <div className="no-data-container">
              There are no {(phaseData.name === 'SurgicalProcedure') ? 'Adverse' : 'Non-Routine' } Events or Surgical Safety Checklist information during this phase.
            </div>
          :
          (!noVideo) &&
            <div className="flex">
              <div className="phase-video">
                <video id="phaseAnalysisVideo" className="azuremediaplayer amp-default-skin amp-big-play-centered" tabIndex="0" data-setup='{"fluid": true}'></video>
                {
                  (showVideoTimeline) &&
                    <VideoTimeline
                      duration={phaseData.enhancedMMVideo[0].endTime - phaseData.enhancedMMVideo[0].startTime}
                      procedureSteps={phaseData.enhancedMMData}
                      seekVideo={(time)=>this.seekVideo(time)}
                      currentVideoTime={this.props.emmVideoTime}
                    />
                }
              </div>
              <div
                className="Phase-Events-Container"
                style={(showVideoTimeline) ? {height: '655px'} : {}}
              >
                <EMMPhaseEvents
                  phaseTitle={phaseData.name}
                  phaseData={phaseData.enhancedMMData}
                  enhancedMMOpenData={phaseData.enhancedMMOpenData}
                  selectedSurgicalTab={selectedSurgicalTab}
                  seekVideo={(time)=>this.seekVideo(time)}
                  changeVideo={(videoID, videoIndex)=>this.changeVideo(videoID, videoIndex)}
                  currentVideoTime={emmVideoTime}
                  selectedVideoClipID={selectedVideoClipID}
                />
              </div>
            </div>
        }

        {(phaseData.checklistData.length > 0) &&
          <ChecklistAnalysis
            checklistData={phaseData.checklistData}
          />
        }
      </div>
    );
  }
}