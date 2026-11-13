// @ts-nocheck
import React from "react";
import "./ArticleTableOfContents.scss";
import TableOfContentsItem from "../../atoms/TableOfContentsItem";

const ArticleTableOfContents = ({ article }) => {
  // Safety check - return null if article or sections don't exist
  if (!article || !article.sections || article.sections.length === 0) {
    return null;
  }

  const checkIfAtLeastOneSectionHasSubitle = () => {
    return article.sections.some((section) => section.subtitle && section.section_icon?.url?.trim());
  };

  if (!checkIfAtLeastOneSectionHasSubitle()) {
    return null;
  }

  return (
    <div className="article-table-of-contents-wrapper">
      <div className="article-table-of-contents-items-wrapper">
        <h4>Članak se sastoji od:</h4>
        <ul>
          {article.sections.map((section, index) => {
            const sectionId = `odlomak-${index}`;
            return (
              section.subtitle && section.section_icon?.url?.trim() && (
                <TableOfContentsItem
                  key={index}
                  icon={section.section_icon.url.trim()}
                  text={section.subtitle}
                  href={`#${sectionId}`}
                />
              )
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ArticleTableOfContents;
