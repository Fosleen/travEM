// @ts-nocheck

import React from "react";
import "./ArticleTableOfContents.scss";
import TableOfContentsItem from "../../atoms/TableOfContentsItem";

const ArticleTableOfContents = ({ article }) => {
  return (
    <div className="article-table-of-contents-wrapper">
      <div className="article-table-of-contents-items-wrapper">
        <h4>Članak se sastoji od:</h4>

        <ul>
          {article?.sections?.map((section, index) => {
            const sectionId = `odlomak-${index}`;
            return (
              <TableOfContentsItem
                key={index}
                icon={section?.section_icon?.url}
                text={section?.subtitle}
                href={`#${sectionId}`} // Use sectionId here
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ArticleTableOfContents;
