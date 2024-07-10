import { Col, Row } from "antd";
import { fullColLayout, rowLayout } from "../../layout/FormLayout";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";

export const RolesForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...fullColLayout}>
          <CustomInput
            label="Name"
            type={"text"}
            required={true}
            name={"name"}
          />
        </Col>
      </Row>
    </CustomForm>
  );
};
