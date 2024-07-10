import { Col, Row } from "antd";
import CustomForm from "../Shared/Form/CustomForm";
import { mdColLayout, rowLayout } from "../../layout/FormLayout";
import CustomInput from "../Shared/Input/CustomInput";
import CustomSelect from "../Shared/Select/CustomSelect";

const DiscountPlanForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...mdColLayout}>
          <CustomInput
            label="Name"
            type={"text"}
            required={true}
            name={"name"}
            placeholder={"Name"}
          />
        </Col>
        <Col {...mdColLayout}>
          <CustomSelect label="Customer" required={true} name={"customer"} />
        </Col>
      </Row>
    </CustomForm>
  );
};

export default DiscountPlanForm;
