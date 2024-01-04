import ArticleImage from "../../atoms/ArticleImage";
import "./ArticleHero.scss";

const ArticleHero = () => {
  return (
    <div className="article-hero-container">
      <div className="article-hero-left">
        <div className="article-hero-titles">
          <h2>STUDIRANJE I PUTOVANJE - TIPS AND TRICKS</h2>
          <h2 className="top">STUDIRANJE I PUTOVANJE - TIPS AND TRICKS</h2>
        </div>
        <h5>5.5.2023. Ema</h5>
        <p>
          Kao student, često se suočavate s ograničenim financijskim sredstvima,
          ali to ne znači da morate odustati od putovanja. U stvari, putovanje
          kao student može biti jedno od najuzbudljivijih iskustava u vašem
          životu. U ovom blog postu istražit ćemo kako putovati s studentskim
          budžetom, iskoristiti prilike za učenje i istraživanje i stvoriti
          uspomene koje će vas pratiti kroz cijeli život.
        </p>
      </div>
      <div className="article-hero-right">
        <ArticleImage />
      </div>
    </div>
  );
};

export default ArticleHero;
