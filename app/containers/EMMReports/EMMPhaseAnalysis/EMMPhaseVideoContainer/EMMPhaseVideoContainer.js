import React from 'react';
import './style.scss';
import globalFunctions from '../../../../utils/global-functions';
import EMMPhaseEvents from '../EMMPhaseEvents';
import ChecklistAnalysis from './ChecklistAnalysis';
import VideoTimeline from './VideoTimeline';

const videoOptions = {
  "nativeControlsForTouch": false,
  controls: true,
  width: '975px',
  height: '548px',
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

export default class EMMPhaseVideoContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      videoID:'phaseAnalysisVideo',
      noVideo: false
    }
  }
  componentDidMount() {
    this.destroyVideoPlayer()
    this.changeVideo()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.phaseData != this.props.phaseData) {
      this.changeVideo();
    }
  }

  componentWillUnmount() {
    this.destroyVideoPlayer()
  }

  getVideoID() {
    const { phaseData } = this.props;
    if (phaseData.name !== 'SurgicalProcedure') {
      if (phaseData.enhancedMMData.length > 0)
        return phaseData.enhancedMMData[0].assets[0];
      else
        return null
    } else {
        return phaseData.enhancedMMVideo[0].assets[0]
    }
  }

  changeVideo(updatedVideoID = null) {
    const videoID = (updatedVideoID !== null) ? updatedVideoID : this.getVideoID();
    if (videoID) {
      this.createVideoPlayer(videoID, this.props.phaseData)
    } else {
      this.setState({ noVideo: true })
      this.destroyVideoPlayer()
    }

  }

  createVideoPlayer(videoID, phaseData) {
    this.setState({ noVideo: false })
    globalFunctions.genericFetch('https://test-insightsapi.surgicalsafety.com/api/media/' + videoID, 'get', this.props.userToken, {})
      .then(result => {
        if (result) {
          this.myPlayer = amp(this.state.videoID, videoOptions);
          this.myPlayer.src([{
            src: result.url,
            type: "application/vnd.ms-sstr+xml",
            protectionInfo: [
              {
                "type": "PlayReady",
                "authenticationToken": result.token
              },
              {
                "type": "Widevine",
                "authenticationToken": result.token
              }
            ]
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

  render() {
    const { phaseData } = this.props;
    const { noVideo } = this.state;
    return (
      <div className="Emm-Phase-Video-Container">
        {
          (noVideo) ?
            <div className="no-data-container">There are no Adverse Events or Surgical Safety Checklist information during this phase.</div>
          :
          <div className="flex">
            <div className="phase-video">
              <video id="phaseAnalysisVideo" className="azuremediaplayer amp-default-skin amp-big-play-centered" tabIndex="0" data-setup='{"fluid": true}'></video>
              {
                (phaseData.name === 'SurgicalProcedure' && phaseData.enhancedMMData.length > 0) &&
                  <VideoTimeline
                    duration={phaseData.endTime - phaseData.startTime}
                    procedureSteps={phaseData.enhancedMMData}
                    seekVideo={(time)=>this.seekVideo(time)}
                    currentVideoTime={this.props.emmVideoTime}
                  />
              }
            </div>
            <div
              className="Phase-Events-Container"
              style={(phaseData.name === 'SurgicalProcedure' && phaseData.enhancedMMData.length > 0) ? {height: '578px'} : {}}
            >
              <EMMPhaseEvents
                phaseTitle={phaseData.name}
                phaseData={phaseData.enhancedMMData}
                seekVideo={(time)=>this.seekVideo(time)}
                changeVideo={(videoID)=>this.changeVideo(videoID)}
                currentVideoTime={this.props.emmVideoTime}
              />
            </div>
          </div>
        }

        {(phaseData.checklistData) &&
          <ChecklistAnalysis
            checklistData={phaseData.checklistData}
          />
        }
      </div>
    );
  }
}