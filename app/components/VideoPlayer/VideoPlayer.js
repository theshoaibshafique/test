import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectToken } from '../../containers/App/selectors';
import globalFunctions from '../../utils/global-functions';
import videojs from 'video.js';
import eme from 'videojs-contrib-eme'; //eslint-disable-line
import { checkDrmType, licenseUri } from './pallycon-helper';

const videoOptions = {
  autoplay: true,
  controls: true,
  preload: 'auto',
  errorDisplay: true,
  fluid: true,
  aspectRatio: '16:9',
  controlBar: true,
  // playbackRates: [0.5, 1, 2, 3, 4],
  userActions: {
    hotkeys: true
  }
};

export function VideoPlayer(props) {
  const { params, presenterMode } = props;

  const userToken = useSelector(makeSelectToken());
  const drmType = checkDrmType();
  const [Node, setNode] = React.useState(0);
  const [mediaPlayer, setPlayer] = React.useState(null);

  //Delete the player on close
  useEffect(() => {
    return () => {
      mediaPlayer?.dispose();
    }
  }, [])

  useEffect(() => {
    if (!Node || !params) {
      return;
    }
    let player = mediaPlayer;
    const mediaUrl = `${process.env.CASE_DISCOVERY_API}media${params}`;
    globalFunctions.axiosFetchWithCredentials(`${mediaUrl}&drm_type=${drmType}`, 'get', userToken, {})
      .then(result => {
        result = result.data
        //Re-use the player if src swap (player already exists)
        player = player || videojs(
          Node,
          videoOptions,
          function onPlayerReady() { }
        );

        const { src } = result;
        if (typeof player.eme === 'function') {
          player.eme();
        }

        let playerConfig = {
          src: src,
          // 'private' in src means url is video is HLS, otherwise dash made by AWS MediaConvert
          type: src.includes('private') ? 'application/x-mpegURL' : 'application/dash+xml',
          withCredentials: true,
        };
        player.src(playerConfig);
        setPlayer(player);
      });
  }, [Node, presenterMode, params])
  return (
    <div className="video-player">
      <link
        href="https://unpkg.com/video.js@7/dist/video-js.min.css"
        rel="stylesheet"
      />
      <link
        href="https://unpkg.com/@videojs/themes@1/dist/sea/index.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/videojs-playlist-ui@3.8.0/dist/videojs-playlist-ui.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/videojs-playlist-ui@3.8.0/dist/videojs-playlist-ui.vertical.css"
        rel="stylesheet"
      />
      <div data-vjs-player >
        <video
          ref={node => (setNode(node))}
          className="video-js vjs-theme-sea"
        />
        <div className="vjs-playlist" />
      </div>
    </div>
  )
}
