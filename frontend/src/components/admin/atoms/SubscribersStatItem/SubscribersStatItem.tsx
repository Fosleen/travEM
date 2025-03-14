import "./SubscribersStatItem.scss";

const SubscribersStatItem = ({
  data,
  text,
}: {
  data: number;
  text: string;
}) => {
  return (
    <div className="new-subscribers-item">
      <p>{text}</p>
      <p>{data == null ? "..." : data}</p>
    </div>
  );
};

export default SubscribersStatItem;
