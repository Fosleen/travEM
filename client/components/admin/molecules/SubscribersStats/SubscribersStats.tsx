import SubscribersStatItem from "../../atoms/SubscribersStatItem";
import "./SubscribersStats.scss";

const SubscribersStats = ({
  data,
}: {
  data: {
    subscribers30days: number;
    subscribers7days: number;
    subscribers3days: number;
    subscribers24hours: number;
  };
}) => {
  return (
    <div className="new-subscribers-container">
      <SubscribersStatItem
        data={data.subscribers30days}
        text={"Novih pretplatnika u posljednjih 30 dana:"}
      />
      <SubscribersStatItem
        data={data.subscribers7days}
        text={"Novih pretplatnika u posljednjih 7 dana:"}
      />
      <SubscribersStatItem
        data={data.subscribers3days}
        text={"Novih pretplatnika u posljednja 3 dana:"}
      />
      <SubscribersStatItem
        data={data.subscribers24hours}
        text={"Novih pretplatnika u posljednja 24 sata:"}
      />
    </div>
  );
};

export default SubscribersStats;
