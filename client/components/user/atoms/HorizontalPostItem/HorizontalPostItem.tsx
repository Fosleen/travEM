import Link from "next/link";
import Image from "next/image";
import "./HorizontalPostItem.scss";
import { FC } from "react";
import { Article } from "../../../../common/types";

const HorizontalPostItem: FC<{ isSmall?: boolean; article: Article }> = ({
  isSmall = false,
  article,
}) => {
  return (
    <>
      {article && (
        <Link
          href={`/clanak/${article.id}`}
          className={`horizontal-post-item-container ${isSmall && "small"}`}
        >
          <div
            className={`horizontal-post-item-image-container ${
              isSmall && "small"
            }`}
          >
            <Image
              src={article.main_image_url}
              alt="post-image"
              fill
              sizes="(max-width: 768px) 144px, 144px"
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
          <div className="horizontal-post-item-text-container">
            <p className={`${isSmall && "small"}`}>{article.title}</p>
          </div>
        </Link>
      )}
    </>
  );
};

export default HorizontalPostItem;
