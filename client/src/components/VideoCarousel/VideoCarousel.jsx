import 'react-responsive-carousel/lib/styles/carousel.min.css';

import {
  useEffect,
  Carousel,
  PropTypes
} from './index'

const VideoCarousel = ({ videos }) => {
  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    };

    const onYouTubeIframeAPIReady = () => {
      videos.forEach((video, index) => {
        new window.YT.Player(`ytplayer-${index}`, {
          events: {
            onStateChange: onPlayerStateChange,
          },
        });
      });
    };

    const onPlayerStateChange = (event) => {
      const playerState = event.data;
      const carousel = document.querySelector('.carousel');

      if (playerState === window.YT.PlayerState.PLAYING) {
        if (carousel) {
          carousel.pause();
        }
      } else if (playerState === window.YT.PlayerState.PAUSED || playerState === window.YT.PlayerState.ENDED) {
        if (carousel) {
          carousel.cycle();
        }
      }
    };

    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    loadYouTubeAPI();

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, [videos]);

  return (
    <Carousel showThumbs={false} showStatus={false} infiniteLoop useKeyboardArrows>
      {videos.map((video, index) => (
        <div key={video._id} className="video-embed">
          <iframe
            id={`ytplayer-${index}`}
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${video.videoId}?enablejsapi=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          ></iframe>
        </div>
      ))}
    </Carousel>
  );
};

VideoCarousel.propTypes = {
  videos: PropTypes.array.isRequired
}


export default VideoCarousel;
