import { Col } from "antd";
import { fullColLayout } from "../../../layout/FormLayout";
import CustomProductTable from "../Table/CustomProductTable";

export const ProductTable = ({
  columns,
  dataSource,
  styleProps,
  tableStyle,
}) => {
  const tableStyleProps = {
    // bordered: true,
    scroll: {
      x: 1000,
      y: 350,
    },
  };

  return (
    <Col {...fullColLayout} className="my-5">
      <CustomProductTable
        columns={columns}
        dataSource={dataSource}
        showPaging={false}
        tableStyleProps={
          styleProps
            ? { ...styleProps, ...tableStyle }
            : { ...tableStyleProps, ...tableStyle }
        }
      />
    </Col>
  );
};
