// @ts-nocheck

import { FC } from "react";
import "./HorizontalPostItemBig.scss";
import { formatDate } from "../../../../utils/global";
import { HorizontalPostItemBigProps } from "../../../../common/types";

const HorizontalPostItemBig: FC<HorizontalPostItemBigProps> = ({
  stretched,
  thin,
  hasDate = true,
  type = "article",
  data,
}) => {
  return (
    <a
      href={
        type === "article" ? `/clanak/${data.id}` : `/destinacija/${data.title}`
      }
    >
      <div
        className={`horizontal-post-item-big-container ${
          stretched ? "stretched" : ""
        }${thin ? "thin" : ""}`}
      >
        <div className="horizontal-post-item-big-image-container">
          <img src={data.main_image_url} alt="post-image" />
        </div>
        <div className="horizontal-post-item-big-text-container">
          <h4>{type == "article" ? data.title : data.name}</h4>
          <div className="horizontal-post-item-big-inner-text-container">
            <p>{data.subtitle} </p>
            {!stretched && hasDate && data.date_written && (
              <p>{formatDate(data.date_written)}</p>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default HorizontalPostItemBig;
