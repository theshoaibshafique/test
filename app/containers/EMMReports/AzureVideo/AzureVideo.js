import React from 'react';
import globalFunctions from '../../../utils/global-functions';
import { createTimelineMarkerPlugin } from './timeLineMarkers';
export default class AzureVideo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      // title: this.props.title,
      // selected: this.props.selected,
      // index: this.props.index,
      // currentEvent: this.props.currentEvent,
      videoID:`azuremediaplayer${this.props.title.replace(/\W/g, '')}`
    }
  }

  componentDidMount() {
    createTimelineMarkerPlugin(this.state.videoID);

    let plugins = {};
    // plugins[this.state.videoID] = {
    //   markertime: this.props.annoationTimes

    // };
    let myOptions = {
      "nativeControlsForTouch": false,
      controls: true,
      fuild: true,
      plugins: plugins
    }

    let videoToken = 'Bearer=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm46bWljcm9zb2Z0OmF6dXJlOm1lZGlhc2VydmljZXM6Y29udGVudGtleWlkZW50aWZpZXIiOiIxNGJkNzEyOC1lOTI2LTQ0ZTEtYjE3ZC0yMDBmZDE4MjcyZjUiLCJuYmYiOjE1ODk1NTI3MjksImV4cCI6MTU4OTU1NjYyOSwiaXNzIjoiU3VyZ2ljYWwgU2FmZXR5IFRlY2hub2xvZ2llcyIsImF1ZCI6Imluc2lnaHRzLnN1cmdpY2Fsc2FmZXR5LmNvbSJ9.MUUlCFFJrv9yDu4cbaxflScD_AJoNCLk81HhWuyEUt0'
    // globalFunctions.genericFetch('https://insightsapi.surgicalsafety.com/api/media/test/abcd-test.mp4', 'get', this.props.userToken, {})
    //   .then(result => {
    //     debugger;
    //     if (result) {
          this.myPlayer = amp(this.state.videoID, myOptions);
          this.myPlayer.src([{
            src: 'https://sstmediaservice-usct.streaming.media.azure.net/8509b561-a0fc-4022-a997-b0f1a724edeb/test.ism/manifest(format=mpd-time-csf,encryption=cenc',
            type: "application/vnd.ms-sstr+xml",
            protectionInfo: [
              {
                "type": "PlayReady",
                "authenticationToken": videoToken
              },
              {
                "type": "Widevine",
                "authenticationToken": videoToken
              }
            ]
          }]);
      //   }
      // });

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