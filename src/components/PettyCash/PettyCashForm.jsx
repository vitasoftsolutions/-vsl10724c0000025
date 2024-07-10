import { Col, Row } from "antd";
import { fullColLayout, rowLayout } from "../../layout/FormLayout";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import { WarehouseComponent } from "../Generator/overview/WarehouseComponent";

export const PettyCashForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...fullColLayout}>
          <WarehouseComponent />
        </Col>
        <Col {...fullColLayout}>
          <CustomInput
            label="Opening Balance"
            type="number"
            name="opening_balance"
            required={true}
          />
        </Col>
      </Row>
    </CustomForm>
  );
};
