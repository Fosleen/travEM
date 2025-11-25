import { FC } from "react";
import "./HorizontalPostItemBig.scss";
import { formatDate } from "../../../../utils/global";
import { HorizontalPostItemBigProps } from "../../../../common/types";
import Image from "next/image";
import Link from "next/link";

const HorizontalPostItemBig: FC<HorizontalPostItemBigProps> = ({
  stretched,
  thin,
  hasDate = true,
  type = "article",
  data,
}) => {
  const href =
    type === "article"
      ? `/clanak/${data?.id}`
      : `/destinacija/${data.name?.toLowerCase()}`;

  return (
    <Link href={href}>
      <div
        className={`horizontal-post-item-big-container ${
          stretched ? "stretched" : ""
        }${thin ? "thin" : ""}`}
      >
        <div className="horizontal-post-item-big-image-container">
          <Image
            src={data?.main_image_url}
            alt={data?.title || data?.name || "Post image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="horizontal-post-item-big-text-container">
          <h4>{type == "article" ? data?.title : data?.name}</h4>
          <div className="horizontal-post-item-big-inner-text-container">
            <p>{data?.subtitle} </p>
            {!stretched && hasDate && data?.date_written && (
              <p>{formatDate(data?.date_written)}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HorizontalPostItemBig;
