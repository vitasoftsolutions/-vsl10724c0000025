import { Col, Form, Row } from "antd";
import { useEffect } from "react";
import { fullColLayout, rowLayout } from "../../layout/FormLayout";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import { WarehouseTransferComponent } from "../Transfer/WarehouseTransferComponent";
import { RequestProductTable } from "./RequestProductTable";

export const StockRequestForm = ({
  formValues,
  setFormValues,
  products,
  setProducts,
  ...props
}) => {
  const warehouseId = Form.useWatch("warehouse_id", props.form);

  useEffect(() => {
    if (warehouseId) {
      setFormValues({ product_list: { qty: {}, min_qty: {} } });
      setProducts([]);
    }
  }, [setFormValues, setProducts, warehouseId]);

  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        {/* <Col {...mdColLayout}>
          <WarehouseComponent name="from_warehouse_id" title="From Warehouse" />
        </Col>
        <Col {...mdColLayout}>
          <WarehouseComponent name="to_warehouse_id" title="To Warehouse" />
        </Col> */}

        <WarehouseTransferComponent fullLayout={true} />

        <RequestProductTable
          formValues={formValues}
          setFormValues={setFormValues}
          products={products}
          setProducts={setProducts}
        />

        <Col {...fullColLayout}>
          <CustomInput
            label="Note"
            multiple={true}
            type={"textarea"}
            name={"note"}
          />
        </Col>
      </Row>
    </CustomForm>
  );
};
