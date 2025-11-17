import { useEffect, useState } from "react";
import DestinationHero from "../../../components/user/molecules/DestinationHero";
import DestinationPosts from "../../../components/user/molecules/DestinationPosts";
import DestinationVideos from "../../../components/user/molecules/DestinationVideos";
import RecommendedPosts from "../../../components/user/molecules/RecommendedPosts";
import "./DestinationPlace.scss";
import { getPlacesByName } from "../../../api/places";
import { useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { Helmet } from "react-helmet";

const DestinationPlace = () => {
  const [place, setPlace] = useState<{
    id: number;
    name: string;
    description: string;
    main_image_url: string;
    articles: Array<object>;
    videos: Array<string>;
  }>();
  const { placeName } = useParams();
  const [metaKeywords, setMetaKeywords] = useState("");
  const [title, setTitle] = useState("");

  const fetchData = async () => {
    try {
      const data = await getPlacesByName(placeName!, 1, 1);
      setPlace(data.data[0]);
      setMetaKeywords(
        `${data.data[0].name}, ${data.data[0].country.name}, ${data.data[0].name} ${data.data[0].country.name}, ${data.data[0].name} putovanje, ${data.data[0].name} putopis, ${data.data[0].name} što posjetiti, ${data.data[0].name} travem`
      );
      setTitle(
        `putujEM s travEM - ${data.data[0].name}, ${data.data[0].country.name}`
      );
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return place ? (
    <>
      <Helmet>
        <meta name="keywords" content={metaKeywords} />
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:description"
          content={place?.description || "Otkrijte svijet uz Emu i Matiju!"}
        />
        <meta property="og:image" content={place?.main_image_url} />
        <meta property="og:site_name" content="putujEM s travEM" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta
          name="twitter:description"
          content={place?.description || "Otkrijte svijet uz Emu i Matiju!"}
        />
        <meta name="twitter:image" content={place?.main_image_url} />
      </Helmet>
      <div className="destination-place-page-container">
        <DestinationHero
          name={place.name}
          description={place.description}
          main_image_url={place.main_image_url}
        />
        {place && place.articles && place.articles.length > 0 && (
          <div className="destination-place-posts-container">
            <h2>Saznajte više</h2>
            <div className="destination-place-posts">
              <DestinationPosts data={place.articles} />
            </div>
          </div>
        )}
        {place && place.videos && place.videos.length > 0 && (
          <div className="destination-place-videos-container">
            <h2>Vlogovi i video putopisi</h2>
            <div className="destination-place-videos">
              <DestinationVideos data={place.videos} />
            </div>
          </div>
        )}
        <div className="destination-place-posts-container">
          <RecommendedPosts type={"place-page"} id={place.id} />
        </div>
      </div>
    </>
  ) : (
    <>
      <ThreeDots
        height="80"
        width="80"
        radius="8"
        color="#2BAC82"
        ariaLabel="three-dots-loading"
        wrapperStyle={{ justifyContent: "center" }}
        visible={true}
      />
    </>
  );
};

export default DestinationPlace;
