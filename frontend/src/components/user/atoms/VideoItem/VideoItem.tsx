import { FC } from "react";
import "./VideoItem.scss";

const VideoItem: FC<{ url: string }> = ({ url }) => {
  return (
    <div className="video-item-container">
      <iframe
        height="100%"
        width="100%"
        src={url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoItem;
