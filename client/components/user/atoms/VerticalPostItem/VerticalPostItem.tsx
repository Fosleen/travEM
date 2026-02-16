import "./VerticalPostItem.scss";
import Link from "next/link";
import { FC } from "react";
import { Article } from "../../../../common/types";

const VerticalPostItem: FC<{ article: Article }> = ({ article }) => {
  return (
    <Link
      href={`/clanak/${article.id}`}
      className="vertical-post-item-container"
      aria-label={article.title}
    >
      <div className="vertical-post-item-image-container">
        <div className="overlay" />
        <img src={article.main_image_url} alt={article.title} />
      </div>

      <div className="vertical-post-item-text-container">
        <p className="text-title">{article.title}</p>
        <p className="text-description">{article.subtitle}</p>
      </div>
    </Link>
  );
};

export default VerticalPostItem;
