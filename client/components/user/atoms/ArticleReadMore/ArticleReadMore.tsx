// @ts-nocheck
import Image from "next/image";
import "./ArticleReadMore.scss";

const ArticleReadMore = ({ section }) => {
  return (
    <div className="article-read-more-wrapper">
      <Image
        src="/images/read_more.png"
        alt="procitaj vise"
        width={50}
        height={50}
        quality={100}
        priority
      />
      {/* <h2>Pročitaj:</h2> */}
      <a href={section.link_url} target="_blank" rel="noopener noreferrer">
        {section.link_title}
      </a>
    </div>
  );
};

export default ArticleReadMore;
