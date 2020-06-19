import React from 'react';
import './style.scss';
import globalFunctions from '../../../../utils/global-functions';
import EMMPhaseEvents from '../EMMPhaseEvents';
import ChecklistAnalysis from './ChecklistAnalysis';
import VideoTimeline from './VideoTimeline';

export default class EMMPhaseVideoContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      videoID:'phaseAnalysisVideo',
      noVideo: false
    }
  }
  componentDidMount() {
    this.updateVideo()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.phaseData != this.props.phaseData) {
      this.updateVideo();
    }
  }

  componentWillUnmount() {
    this.destroyVideo()
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

  updateVideo() {
    const videoID = this.getVideoID();

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
      // plugins: plugins
    }

    if (videoID) {
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
          }
        });
    } else {
      this.setState({ noVideo: true })
      this.destroyVideo()
    }

  }

  destroyVideo() {
    if (this.myPlayer)
      this.myPlayer.dispose();
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