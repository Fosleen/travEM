import "./ArticleTableOfContents.scss";
import MoneyIcon from "../../../../assets/images/money_icon.png";
import TableOfContentsItem from "../../atoms/TableOfContentsItem";
import { useEffect } from "react";

const ArticleTableOfContents = ({ article }) => {
  useEffect(() => {
    console.log("Article koji dobijem je", article);
  });
  return (
    <div className="article-table-of-contents-wrapper">
      <div className="article-table-of-contents-items-wrapper">
        <h4>Članak se sastoji od:</h4>

        <ul>
          {article?.sections?.map((section) => {
            return (
              <TableOfContentsItem
                icon={section.section_icon.url}
                text={section.text}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ArticleTableOfContents;
