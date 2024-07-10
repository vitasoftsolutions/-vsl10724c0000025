import { Statistic } from "antd";
import CountUp from "react-countup";

const formatter = (value) => <CountUp end={value} separator="," />;

export const StatisticComponent = (props) => {
  const { children, title, icon, color, value } = props;
  return <Statistic value={"122433"} formatter={formatter} precision={2} />;
};
