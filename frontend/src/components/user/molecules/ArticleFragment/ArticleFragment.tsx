import "./ArticleFragment.scss";
import FooterImage from "../../../../assets/images/footer-image.jpg";
import Food2 from "../../../../assets/images/food2.png";
import { FC } from "react";
import { ArticleProps } from "../../../../common/types";

const ArticleFragment: FC<ArticleProps> = ({
  hasImage,
  hasVideo,
  hasImages,
}) => {
  return (
    <div className="article-wrapper">
      <h3>1. Planiranje i proračun</h3>
      <p>
        Prije nego krenete na svoje putovanje, važno je postaviti realan budžet.
        To uključuje troškove kao što su smještaj, hrana, prijevoz, zabava i
        eventualni troškovi ulaznica za muzeje ili atrakcije. Postavljanjem
        budžeta i praćenjem troškova možete bolje upravljati svojim financijama
        tijekom putovanja. Kako biste precizno odredili budžet, razmislite o
        svojim prioritetima na putovanju. Možda želite izdvojiti više novca za
        određene aktivnosti ili doživljaje, dok ćete u drugim aspektima moći
        štedjeti. Također, budite svjesni da se budžet može mijenjati tijekom
        putovanja, pa budite spremni prilagoditi ga prema potrebi.
      </p>
      {hasImage && (
        <div className="article-fragment-image-wrapper">
          {" "}
          <img src={Food2} alt="" />
        </div>
      )}
      {hasImages && (
        <div className="article-fragment-images-wrapper">
          <img src={FooterImage} alt="" />
          <img src={FooterImage} alt="" />
        </div>
      )}

      {hasVideo && (
        <div className="article-fragment-video-wrapper">
          <h4>Pogledajte naš video:</h4>
          <iframe src="https://www.youtube.com/embed/tgbNymZ7vqY"></iframe>
        </div>
      )}
    </div>
  );
};

export default ArticleFragment;
