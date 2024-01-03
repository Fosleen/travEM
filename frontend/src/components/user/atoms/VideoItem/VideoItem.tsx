import "./VideoItem.scss"

const VideoItem = () => {
  return (
    <div className="video-item-container">
      <iframe
        height="100%"
        width="100%"
        src="https://www.youtube.com/embed/0ziriAHSqQs?si=0WYaLFf9JFfY4d6_"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoItem;
