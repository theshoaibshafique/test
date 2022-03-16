import React, { useEffect } from 'react';
import videojs from 'video.js';

const videoOptions = {
  autoplay: true,
  controls: true,
  preload: 'auto',
  errorDisplay: true,
  fluid: true,
  aspectRatio: '16:9',
  controlBar: true,
  userActions: {
    hotkeys: true,
  },
};

export function PublicVideoVideoPlayer(props) {
  const {
    src,
  } = props;

  const [Node, setNode] = React.useState(0);
  const [mediaPlayer, setPlayer] = React.useState(null);

  // Delete the player on close
  useEffect(() => () => {
    mediaPlayer?.dispose();
  }, []);

  useEffect(() => {
    if (!Node || !src) {
      return;
    }
    let player = mediaPlayer;
    player = player || videojs(
      Node,
      videoOptions,
      () => { },
    );
    const playerConfig = {
      src,
      type: 'application/x-mpegURL',
      withCredentials: true,
    };
    player.src(playerConfig);
    setPlayer(player);
  }, [Node, src]);
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
      <div data-vjs-player>
        <video
          ref={node => (setNode(node))}
          className="video-js vjs-theme-sea"
        />
        <div className="vjs-playlist"/>
      </div>
    </div>
  );
}
