import React from 'react';
import globalFunctions from '../../../utils/global-functions';
import { createTimelineMarkerPlugin } from './timeLineMarkers';
export default class AzureVideo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      selected: this.props.selected,
      index: this.props.index,
      currentEvent: this.props.currentEvent,
      videoID:`azuremediaplayer${this.props.title.replace(/\W/g, '')}`
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
      fuild: true,
      plugins: plugins
    }
    globalFunctions.genericFetch(process.env.MEDIA_API + "/" + this.state.title, 'get', this.props.userToken, {})
      .then(result => {
        if (result) {
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
          // this.setState({src:result.url, token: result.token});
        }
      });

  }
  componentDidUpdate() {
    if (this.state.currentEvent != this.props.currentEvent || this.state.index != this.props.index && this.state.selected != this.props.selected) {
      this.myPlayer && this.myPlayer.pause();
    }
  }

  render() {
    return (
      <div>
        <video id={`azuremediaplayer${this.props.title.replace(/\W/g, '')}`} className="azuremediaplayer amp-default-skin amp-big-play-centered" tabIndex="0" data-setup='{"fluid": true}'></video>
      </div>
    );
  }
}