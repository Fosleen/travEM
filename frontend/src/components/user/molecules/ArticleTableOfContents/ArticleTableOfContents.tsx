import "./ArticleTableOfContents.scss";
import JournalIcon from "../../../../assets/images/journal_icon.png";
import MoneyIcon from "../../../../assets/images/money_icon.png";
import PercentageIcon from "../../../../assets/images/percentage_icon.png";
import PlaneIcon from "../../../../assets/images/plane_icon.png";
import PlaneIcon2 from "../../../../assets/images/plane_icon2.png";
import StudentIcon from "../../../../assets/images/student_icon.png";
import TableOfContentsItem from "../../atoms/TableOfContentsItem";

const ArticleTableOfContents = () => {
  return (
    <div className="article-table-of-contents-wrapper">
      <div className="article-table-of-contents-items-wrapper">
        <h4>Članak se sastoji od:</h4>

        <ul>
          <TableOfContentsItem
            icon={MoneyIcon}
            text={"Planiranje i Proračun"}
          />
          <TableOfContentsItem
            icon={PlaneIcon}
            text={"Istraživanje i Pronalaženje Jeftinih Alternativa"}
          />
          <TableOfContentsItem
            icon={PlaneIcon2}
            text={"Putovanje Uz Popuste"}
          />
          <TableOfContentsItem
            icon={PercentageIcon}
            text={"Planiranje Fleksibilnih Putovanja"}
          />
          <TableOfContentsItem
            icon={JournalIcon}
            text={"Ispunite Svoj Putnički Dnevnik"}
          />
          <TableOfContentsItem
            icon={StudentIcon}
            text={"Učenje i Istraživanje"}
          />
        </ul>
      </div>
    </div>
  );
};

export default ArticleTableOfContents;
