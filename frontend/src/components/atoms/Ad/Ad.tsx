import { FC, useEffect } from "react";

const Ad: FC<{ dataAdSlot: string }> = ({ dataAdSlot }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3489990178681903"
        data-ad-format="auto"
        data-ad-slot={dataAdSlot}
        data-full-width-responsive="true"
      ></ins>
    </>
  );
};

export default Ad;
