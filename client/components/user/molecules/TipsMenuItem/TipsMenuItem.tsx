import Link from "next/link";
import Image from "next/image";
import "./TipsMenuItem.scss";
import { convertToSlug } from "../../../../utils/global";
import { FC, MouseEventHandler } from "react";

const TipsMenuItem: FC<{
  title: string;
  icon: string;
  onClick?: MouseEventHandler<HTMLElement>;
}> = ({ title, icon, onClick }) => {
  return (
    <Link
      href={`/savjeti/${convertToSlug(title)}`}
      className="tips-menu-item-container"
      onClick={onClick}
    >
      <h2>{title}</h2>
      <Image
        src={icon}
        alt="icon"
        className="icon-top-left"
        width={98}
        height={98}
      />
      <Image
        src={icon}
        alt="icon"
        className="icon-bottom-right"
        width={98}
        height={98}
      />
    </Link>
  );
};
export default TipsMenuItem;
