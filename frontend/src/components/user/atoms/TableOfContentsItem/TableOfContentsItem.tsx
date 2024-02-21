// @ts-nocheck
import React from "react";
import "./TableOfContentsItem.scss";

const TableOfContentsItem = ({ icon, text, href }) => {
  return (
    <div className="table-of-contents-item">
      <div className="table-of-contents-item-image">
        <img src={icon} alt="" />
      </div>
      <li>
        <a href={href}>{text}</a>
      </li>
    </div>
  );
};

export default TableOfContentsItem;
