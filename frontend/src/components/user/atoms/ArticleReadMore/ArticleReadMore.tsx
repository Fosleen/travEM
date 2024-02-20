import "./ArticleReadMore.scss";
import ReadMore from "../../../../assets/images/read_more.png";

const ArticleReadMore = ({ section }) => {
  return (
    <div className="article-read-more-wrapper">
      <img src={ReadMore} alt="" />
      {/* <h2>Pročitaj:</h2> */}
      <a href={section.link_url} target="blank">
        {section.link_title}
      </a>
    </div>
  );
};

export default ArticleReadMore;
