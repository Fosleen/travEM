import "./TableOfContentsItem.scss";

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
