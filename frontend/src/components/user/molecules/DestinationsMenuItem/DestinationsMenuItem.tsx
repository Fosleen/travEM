import { CaretRight } from "@phosphor-icons/react";
import DestinationItem from "../../atoms/DestinationItem";
import "./DestinationsMenuItem.scss";
import { Link } from "react-router-dom";

const DestinationsMenuItem = ({ title }) => {
  return (
    <div className="destinations-menu-item-container">
      <div className="destinations-menu-item-header">
        <h2>{title}</h2>
        <Link to="destinacije/afrika">
          <CaretRight size={32} color="#1abb6f" weight="duotone" />
        </Link>
      </div>
      <hr />
      <div className="destinations-menu-items">
        <DestinationItem filterMenuItem name="Bosna i Hercegovina" />
        <DestinationItem filterMenuItem name="Češka" />
        <DestinationItem filterMenuItem name="Engleska" />
        <DestinationItem filterMenuItem name="Finska" />
        <DestinationItem filterMenuItem name="Hrvatska" />
      </div>
    </div>
  );
};

export default DestinationsMenuItem;
