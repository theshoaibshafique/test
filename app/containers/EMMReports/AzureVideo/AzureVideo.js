import React from 'react';
import globalFunctions from '../../../utils/global-functions';
import Button from '@material-ui/core/Button';
import { createTimelineMarkerPlugin } from './timeLineMarkers';
export default class AzureVideo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      // title: this.props.title,
      // selected: this.props.selected,
      // index: this.props.index,
      // currentEvent: this.props.currentEvent,
      videoID:`azuremediaplayer${this.props.title.replace(/\W/g, '')}`,
      showVideo: false
    }
  }

  componentDidMount() {
    createTimelineMarkerPlugin(this.state.videoID);

    let plugins = {};
    plugins[this.state.videoID] = {
      markertime: this.props.annoationTimes
    };
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


  componentDidUpdate() {
    if (this.state.currentEvent != this.props.currentEvent || this.state.index != this.props.index && this.state.selected != this.props.selected) {
      this.myPlayer && this.myPlayer.pause();
    }
  }

  dllm() {
    this.myPlayer.currentTime(120)
  }

  render() {
    return (
      <div>
        {(this.state.showVideo) &&
            <video id={`azuremediaplayer${this.props.title.replace(/\W/g, '')}`} className="azuremediaplayer amp-default-skin amp-big-play-centered" tabIndex="0" data-setup='{"fluid": true}'></video>
        }
        <Button onClick={()=>this.dllm()}>Click Me</Button>
      </div>
    );
  }
}