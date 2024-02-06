import VideoItem from "../../atoms/VideoItem";
import vlogIcon from "../../../../assets/images/vlog-icon.png";
import "./DestinationVideos.scss";
import { Key } from "react";

const DestinationVideos = ({ data }) => {
  return (
    <div className="destination-videos-container">
      <div className="destination-videos-image">
        <img src={vlogIcon} alt="vlogging-camera-icon" />
      </div>
      <div className="destination-videos">
        {data.map((el: { url: string }, index: Key | null | undefined) => (
          <VideoItem key={index} url={el.url} />
        ))}
      </div>
    </div>
  );
};

export default DestinationVideos;
