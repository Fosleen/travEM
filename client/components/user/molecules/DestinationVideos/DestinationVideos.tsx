import "./DestinationVideos.scss";
import { VideoProps } from "@/common/types";
import Image from "next/image";
import VideoItem from "../../atoms/VideoItem";

const DestinationVideos = ({ data }: any) => {
  const videos =
    data?.filter((el: VideoProps) => el.url && el.url.trim()) || [];

  const videosCountClass =
    videos.length === 1
      ? "one-video"
      : videos.length === 2
      ? "two-videos"
      : "three-videos";

  if (!videos.length) return null;

  return (
    <div className="destination-videos-container">
      <div className="destination-videos-image">
        <Image
          src="/images/vlog-icon.png"
          alt="vlogging-camera-icon"
          width={112}
          height={112}
          className="vlog-icon"
        />
      </div>

      <div className={`destination-videos ${videosCountClass}`}>
        {videos.map((el: VideoProps, index: number) => (
          <VideoItem key={index} url={el.url.trim()} />
        ))}
      </div>
    </div>
  );
};

export default DestinationVideos;