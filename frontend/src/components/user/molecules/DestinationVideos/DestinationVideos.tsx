import VideoItem from "../../atoms/VideoItem";
import vlogIcon from "../../../../assets/images/vlog-icon.png";
import "./DestinationVideos.scss";

const DestinationVideos = () => {
  return (
    <div className="destination-videos-container">
      <div className="destination-videos-image">
        <img src={vlogIcon} alt="vlogging-camera-icon" />
      </div>
      <div className="destination-videos">
        <VideoItem />
        <VideoItem />
        <VideoItem />
      </div>
    </div>
  );
};

export default DestinationVideos;
