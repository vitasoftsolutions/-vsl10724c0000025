import { Col, Form, Row } from "antd";
import { fullColLayout, rowLayout } from "../../layout/FormLayout";
import { WarehouseComponent } from "../ReusableComponent/WarehouseComponent";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomUploader from "../Shared/Upload/CustomUploader";
import { AdjustmentProductTable } from "./overview/AdjustmentProductTable";
import { useEffect } from "react";

const AdjustmentForm = ({
  formValues,
  setFormValues,
  products,
  setProducts,
  ...props
}) => {
  const warehouseId = Form.useWatch("warehouse_id", props.form);

  useEffect(() => {
    if (warehouseId) {
      setFormValues({ product_list: { qty: {}, action: {} } });
      setProducts([]);
    }
  }, [setFormValues, setProducts, warehouseId]);

  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...fullColLayout}>
          <WarehouseComponent />
        </Col>

        <AdjustmentProductTable
          formValues={formValues}
          setFormValues={setFormValues}
          products={products}
          setProducts={setProducts}
        />

        <Col {...fullColLayout}>
          <CustomUploader label="Attach Documents" name={"attachment"} />
        </Col>
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

export default AdjustmentForm;
