// @ts-nocheck

import React from "react";
import "./TableOfContentsItem.scss";

const TableOfContentsItem = ({ icon, text, href, sectionId }) => {
  return (
    <div className="table-of-contents-item">
      <div className="table-of-contents-item-image">
        <img src={icon} alt="" />
      </div>
      <a href={href} id={sectionId}>
        {" "}
        {/* Include id attribute here */}
        <li>{text}</li>
      </a>
    </div>
  );
};

export default TableOfContentsItem;
