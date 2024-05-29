//@ts-nocheck

import React from "react";
import "./TableOfContentsItem.scss";

const TableOfContentsItem = ({ icon, text, href }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const targetElement = document.getElementById(href.substring(1));
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="table-of-contents-item">
      <div className="table-of-contents-item-image">
        <img src={icon} alt="" />
      </div>
      <li>
        <a href={href} onClick={handleClick}>
          {text}
        </a>
      </li>
    </div>
  );
};

export default TableOfContentsItem;
