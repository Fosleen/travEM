import Link from "next/link";
import { getArticleUrl } from "@/utils/articleUrl";
import {
  ARTICLE_TYPE_AIRPLANE_TICKET_ID,
  getTipsArticleTypeIcon,
  TIPS_CATEGORY_ICONS,
} from "@/utils/articleTypeHelpers";
import "./FavoritePostItem.scss";
import { FC } from "react";
import { Article } from "../../../../common/types";

const FavoritePostItem: FC<{ article: Article }> = ({ article }) => {
  const articleTypeId = String(article?.articleTypeId ?? article?.article_type_id ?? "");
  const isAirplaneTicket = articleTypeId === ARTICLE_TYPE_AIRPLANE_TICKET_ID;
  const tipIcon = getTipsArticleTypeIcon(articleTypeId);
  const categoryIcon = isAirplaneTicket ? TIPS_CATEGORY_ICONS["let-avionom"] : tipIcon;
  const flagUrl = article?.country?.flag_image_url;

  return (
    <>
      {article && (
        <Link
          href={getArticleUrl(article)}
          className="favorite-post-item-container"
        >
          <div className="favorite-post-item-content">
            <div className="favorite-post-item-content-text">
              <p>{article.title}</p>
            </div>

            <div className="favorite-post-item-content-image">
              {(categoryIcon || flagUrl) && (
                <div
                  className="favorite-post-item-icon-container"
                  role="img"
                  aria-label={tipIcon ? "Savjeti" : isAirplaneTicket ? "Aviokarte" : "Zastava države"}
                >
                  {categoryIcon ? (
                    <img className="favorite-post-item-category-icon" src={categoryIcon} alt="" />
                  ) : (
                    <img className="favorite-post-item-icon" src={flagUrl} alt="" />
                  )}
                </div>
              )}

              <img src={article.main_image_url} alt="post-image" />
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default FavoritePostItem;
