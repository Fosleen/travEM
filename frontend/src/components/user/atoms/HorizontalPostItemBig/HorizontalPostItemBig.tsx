import { FC } from "react";
import "./HorizontalPostItemBig.scss";
import { Link } from "react-router-dom";
import { formatDate } from "../../../../utils/global";
import { HorizontalPostItemBigProps } from "../../../../common/types";

const HorizontalPostItemBig: FC<HorizontalPostItemBigProps> = ({
  stretched,
  thin,
  hasDate = true,
  type = "article",
  data = {
    id: null,
    main_image_url:
      "https://cdn.pixabay.com/photo/2014/06/03/19/38/board-361516_640.jpg",
    title: "-defaultni naslov-",
    name: "",
    subtitle: null,
    date_written: null,
  },
}) => {
  return (
    <Link
      to={
        type == "article" ? `/clanak/${data.id}` : `/destinacija/${data.name}`
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
    </Link>
  );
};

export default HorizontalPostItemBig;
