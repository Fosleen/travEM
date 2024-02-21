// @ts-nocheck

import "./ArticleTableOfContents.scss";
import TableOfContentsItem from "../../atoms/TableOfContentsItem";

const ArticleTableOfContents = ({ article }) => {
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
