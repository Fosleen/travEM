import "./TableOfContentsItem.scss";

const TableOfContentsItem = ({ icon, text }) => {
  return (
    <div className="table-of-contents-item">
      <img src={icon} alt="" />
      <li> {text}</li>
    </div>
  );
};

export default TableOfContentsItem;
