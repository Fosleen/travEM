// @ts-nocheck

import VideoItem from "../../atoms/VideoItem";
import vlogIcon from "../../../../assets/images/vlog-icon.png";
import "./DestinationVideos.scss";
import { VideoProps } from "../../../../common/types";

const DestinationVideos = ({ data }) => {
  return (
    <div className="destination-videos-container">
      {data && (
        <>
          <div className="destination-videos-image">
            <img src={vlogIcon} alt="vlogging-camera-icon" />
          </div>
          <div className="destination-videos">
            {data.map((el: VideoProps, index: number) => (
              <VideoItem key={index} url={el.url} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DestinationVideos;
