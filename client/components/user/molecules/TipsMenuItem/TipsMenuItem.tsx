import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import "./TipsMenuItem.scss";
import { convertToSlug } from "../../../../utils/global";
import { FC, MouseEventHandler } from "react";

const TipsMenuItem: FC<{
  title: string;
  icon: StaticImageData;
  onClick?: MouseEventHandler<HTMLElement>;
}> = ({ title, icon, onClick }) => {
  return (
    <Link
      href={`/savjeti/${convertToSlug(title)}`}
      className="tips-menu-item-container"
      onClick={onClick}
    >
      <h2>{title}</h2>
      <Image src={icon} alt="icon" className="icon-top-left" />
      <Image src={icon} alt="icon" className="icon-bottom-right" />
    </Link>
  );
};
export default TipsMenuItem;
