import Link from "next/link";
import "./MainCountryPost.scss";
import Image from "next/image";

const MainCountryPost = ({ article }: any) => {
  return (
    <Link
      href={`/clanak/${article.id}`}
      className="main-country-post-container"
    >
      <div className="main-country-post-bg-image-container">
        <Image
          src={article.main_image_url}
          alt="post-bg-image"
          width={4000}
          height={2000}
        />
      </div>
      <div className="main-country-top-layer">
        <div className="main-country-post-top-image-container">
          <img
            src={article.main_image_url}
            alt={`${article.title} post-image`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="main-country-icon-container">
          <div className="main-country-icon-circle">
            <Image
              src="/images/main-post-icon.png"
              alt="icon"
              width={80}
              height={40}
            />
          </div>
        </div>
        <div className="main-country-post-text-container">{article.title}</div>
      </div>
    </Link>
  );
};

export default MainCountryPost;
