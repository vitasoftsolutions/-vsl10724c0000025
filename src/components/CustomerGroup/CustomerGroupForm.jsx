import { Col, Row } from "antd";
import CustomForm from "../Shared/Form/CustomForm";
import { mdColLayout, rowLayout } from "../../layout/FormLayout";
import CustomInput from "../Shared/Input/CustomInput";

const CustomerGroupForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...mdColLayout}>
          <CustomInput
            label="Name"
            type={"text"}
            required={true}
            name={"name"}
          />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput
            label="Percentage (%)"
            type={"number_with_percent"}
            required={true}
            name={"percentage"}
            tooltip="If you want to sell your product at default price, then the percentage should be 0 percent."
          />
        </Col>
      </Row>
    </CustomForm>
  );
};

export default CustomerGroupForm;
