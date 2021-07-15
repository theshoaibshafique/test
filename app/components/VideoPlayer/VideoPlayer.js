import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectEMMPresenterMode } from '../../containers/App/emm-selectors';
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
  playbackRates: [0.5, 1, 2, 3, 4],
  userActions: {
    hotkeys: true
  }
};

export function VideoPlayer(props) {
  const { videoId } = props;

  const userToken = useSelector(makeSelectToken());
  const emmPresenterMode = useSelector(selectEMMPresenterMode());
  const drmType = checkDrmType();
  const [Node, setNode] = React.useState(0);
  const mediaURL = `${(emmPresenterMode) ? process.env.PRESENTER_API : process.env.MEDIA_API}?asset=${videoId}&drm_type=${drmType}`;

  useEffect(() => {
    if (!Node || !videoId){
      return;
    }
    globalFunctions.axiosFetchWithCredentials(mediaURL, 'get', userToken, {})
      .then(result => {
        result = result.data
        const player = videojs(
          Node,
          videoOptions,
          function onPlayerReady() { }
        );
        // setMyPlayer(player);

        const { src, token } = result;
        if (typeof player.eme === 'function') {
          player.eme();
        }

        let playerConfig;
        if (emmPresenterMode) {
          playerConfig = {
            src: src,
            type: 'application/dash+xml',
            // withCredentials: true,
          };
        } else if (drmType === 'Widevine') {

          playerConfig = {
            src: src,
            type: 'application/dash+xml',
            // withCredentials: true,
            keySystems: {
              'com.widevine.alpha': {
                url: licenseUri,
                licenseHeaders: {
                  'pallycon-customdata-v2': token
                },
                videoRobustness: 'SW_SECURE_CRYPTO',
                audioRobustness: 'SW_SECURE_CRYPTO'
              }
            }
          };
        } else if (drmType === 'PlayReady') {
          playerConfig = {
            src: src,
            type: 'application/dash+xml',
            // withCredentials: true,
            keySystems: {
              'com.microsoft.playready': {
                url: licenseUri,
                licenseHeaders: {
                  'pallycon-customdata-v2': token
                },
                videoRobustness: 'SW_SECURE_CRYPTO',
                audioRobustness: 'SW_SECURE_CRYPTO'
              }
            }
          };
        }
        player.src(playerConfig);
      });
  }, [Node,videoId])
  return (
    <div className="video-player">
      <link
        href="https://vjs.zencdn.net/7.10.2/video-js.css"
        rel="stylesheet"
      />
      <link
        href="https://unpkg.com/@videojs/themes@1/dist/forest/index.css"
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
      <div data-vjs-player>
        <video
          ref={node => (setNode(node))}
          className="video-js vjs-theme-forest"
        />
        <div className="vjs-playlist" />
      </div>
    </div>
  )
}