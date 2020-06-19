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
      showVideo: false
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
    this.myPlayer.dispose();
  }

  getVideoID() {
    const { phaseData } = this.props;
    if (phaseData.name !== 'SurgicalProcedure') {
      return '54DA222E-317F-4DD8-BC26-BBACE35E586D-F624B368-6681-47DE-8452-8A64CCEA0728';
    } else {
      return '54DA222E-317F-4DD8-BC26-BBACE35E586D-DE11E686-EDE9-4DD0-9B47-6B693C893C99';
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

    globalFunctions.genericFetch('https://test-insightsapi.surgicalsafety.com/api/media/' + videoID, 'get', this.props.userToken, {})
      .then(result => {
        if (result) {
          this.setState({showVideo: true})
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
  }

  seekVideo(time) {
      this.myPlayer.currentTime(time)
  }

  render() {
    const { phaseData } = this.props;
    return (
      <div className="Emm-Phase-Video-Container">
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

        {(phaseData.checklistData) &&
          <ChecklistAnalysis
            checklistData={phaseData.checklistData}
          />
        }
      </div>
    );
  }
}