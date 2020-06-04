import React from 'react';
import './style.scss';
import globalFunctions from '../../../../utils/global-functions';
import EMMPhaseEvents from '../EMMPhaseEvents';
import ChecklistAnalysis from './ChecklistAnalysis';
import VideoTimeline from './VideoTimeline';

export default class EMMPhaseVideoContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {

      videoID:`azuremediaplayer${this.props.title.replace(/\W/g, '')}`,
      showVideo: false
    }
  }
  componentDidMount() {
    let myOptions = {
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
      }
      // plugins: plugins
    }

    globalFunctions.genericFetch('https://test-insightsapi.surgicalsafety.com/api/media/test/abcd-test.mp4', 'get', this.props.userToken, {})
      .then(result => {
        if (result) {
          this.setState({showVideo: true})
          this.myPlayer = amp(this.state.videoID, myOptions);
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
    let { phaseData } = this.props;
    return (
      <div className="Emm-Phase-Video-Container">
        <div className="flex">
          <div className="phase-video">
            <video id={`azuremediaplayer${this.props.title.replace(/\W/g, '')}`} className="azuremediaplayer amp-default-skin amp-big-play-centered" tabIndex="0" data-setup='{"fluid": true}'></video>
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

        {
          (phaseData.name === 'SurgicalProcedure' && phaseData.enhancedMMData.length > 0) &&
            <VideoTimeline
              duration={phaseData.endTime - phaseData.startTime}
              procedureSteps={phaseData.enhancedMMData}
            />
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