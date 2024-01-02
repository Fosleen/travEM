import HorizontalPostItemBig from "../../../components/atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import "./TipsAndTricks.scss";

const TipsAndTricks = () => {
  return (
    <div className="tips-and-tricks-parent-wrapper">
      <div className="tips-and-tricks-text-wrapper">
        <h2>Let avionom</h2>
        <h4>Sve što ne znate o letovima, a trebate znati</h4>
      </div>
      <div className="tips-and-tricks-grid-wrapper">
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
      </div>
      <div className="tips-and-tricks-text-articles-wrapper">
        <h2>Povezani članci</h2>
      </div>

      <div className="tips-and-tricks-connected-articles-wrapper">
        <HorizontalPostItemBig stretched />
        <HorizontalPostItemBig stretched />
        <HorizontalPostItemBig stretched />
        <HorizontalPostItemBig stretched />
      </div>
    </div>
  );
};

export default TipsAndTricks;
