import { useBreakpoint } from "@ant-design/pro-components";
import { Descriptions } from "antd";
import {
  desLayout,
  detailsLayout,
  singleDesLayout,
} from "../../../layout/DescriptionLayout";

export const CustomDescription = ({ title, items = [], nostyle }) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  const getLayout = () => {
    if (nostyle) return detailsLayout;
    return items.length > 1
      ? desLayout({ isMobile })
      : singleDesLayout({ isMobile });
  };

  const layout = getLayout();

  return <Descriptions {...layout} title={title} items={items} />;
};
