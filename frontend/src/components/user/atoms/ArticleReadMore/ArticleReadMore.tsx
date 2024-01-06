import "./ArticleReadMore.scss";
import ReadMore from "../../../../assets/images/read_more.png";
import { Link } from "react-router-dom";

const ArticleReadMore = () => {
  return (
    <div className="article-read-more-wrapper">
      <img src={ReadMore} alt="" />
      <h2>Pročitaj:</h2>
      <Link to="/">Kako smo išli na Mjesec i natrag?</Link>
    </div>
  );
};

export default ArticleReadMore;
