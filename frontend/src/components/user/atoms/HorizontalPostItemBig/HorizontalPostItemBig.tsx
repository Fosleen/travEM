import { FC } from "react";
import "./HorizontalPostItemBig.scss";
import { Link } from "react-router-dom";
import { formatDate } from "../../../../utils/global";
import { HorizontalPostItemBigProps } from "../../../../common/types";

const HorizontalPostItemBig: FC<HorizontalPostItemBigProps> = ({
  stretched,
  thin,
  hasDate = true,
  article = {
    id: null,
    main_image_url:
      "https://cdn.pixabay.com/photo/2014/06/03/19/38/board-361516_640.jpg",
    title: "-defaultni naslov-",
    subtitle: "-defaultni podnaslov-",
    date_written: null,
  },
}) => {
  return (
    <Link to={`/clanak/${article.id}`}>
      <div
        className={`horizontal-post-item-big-container ${
          stretched ? "stretched" : ""
        }${thin ? "thin" : ""}`}
      >
        <div className="horizontal-post-item-big-image-container">
          <img src={article.main_image_url} alt="post-image" />
        </div>
        <div className="horizontal-post-item-big-text-container">
          <h4>{article.title}</h4>
          <div className="horizontal-post-item-big-inner-text-container">
            <p>{article.subtitle} </p>
            {!stretched && hasDate && article.date_written && (
              <p>{formatDate(article.date_written)}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HorizontalPostItemBig;
