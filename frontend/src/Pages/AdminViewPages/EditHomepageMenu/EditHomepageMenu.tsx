import EditHomepageMenuItem from "../../../components/admin/atoms/EditHomepageMenuItem";
import "./EditHomepageMenu.scss";

const EditHomepageMenu = () => {
  return (
    <div className="edit-homepage-menu-container">
      <h2>Što želiš mijenjati od sadržaja bloga?</h2>
      <div className="edit-homepage-menu-items">
        <EditHomepageMenuItem text="Hero" url="/admin/uredi-hero" />
        <EditHomepageMenuItem text="Top 3 članka" url="/admin/uredi-top-tri" />
        <EditHomepageMenuItem
          text="Ravni banner i preporučeni članci"
          url="/admin/uredi-banner"
        />
        <EditHomepageMenuItem
          text="Preporuka gradova - karta"
          url="/admin/uredi-kartu"
        />
        <EditHomepageMenuItem
          text="Statistika putovanja"
          url="/admin/uredi-statistiku"
        />
        <EditHomepageMenuItem
          text="Omiljeni članci"
          url="/admin/uredi-omiljene-clanke"
        />
        <EditHomepageMenuItem
          text="Linkovi na mreže"
          url="/admin/uredi-mreze"
        />
        <EditHomepageMenuItem text="Footer" url="/admin/uredi-footer" />
      </div>
    </div>
  );
};

export default EditHomepageMenu;
