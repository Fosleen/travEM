import vlogIcon from "@/assets/images/vlog-icon.png";
import "./DestinationVideos.scss";
import { VideoProps } from "@/common/types";
import Image from "next/image";
import VideoItem from "../../atoms/VideoItem";

const DestinationVideos = ({ data }) => {
  return (
    <div className="destination-videos-container">
      {data && (
        <>
          <div className="destination-videos-image">
            <Image
              src={vlogIcon}
              alt="vlogging-camera-icon"
              width={112}
              height={112}
              className="vlog-icon"
            />
          </div>
          <div className="destination-videos">
            {data.map(
              (el: VideoProps, index: number) =>
                el.url && <VideoItem key={index} url={el.url.trim()} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DestinationVideos;
