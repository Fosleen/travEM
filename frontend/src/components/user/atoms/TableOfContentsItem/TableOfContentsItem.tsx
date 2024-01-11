import "./TableOfContentsItem.scss";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignoreS
const TableOfContentsItem = ({ icon, text }) => {
  return (
    <div className="table-of-contents-item">
      <div className="table-of-contents-item-image">
        <img src={icon} alt="" />
      </div>
      <li> {text}</li>
    </div>
  );
};

export default TableOfContentsItem;
