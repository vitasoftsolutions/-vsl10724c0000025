import { Col, Row } from "antd";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";

const rowLayout = {
  gutter: 25,
};

const colLayout = {
  xs: 24,
};

const TypeForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...colLayout}>
          <CustomInput
            label={"Type Name"}
            type={"text"}
            required={true}
            name={"name"}
          />
        </Col>
      </Row>
    </CustomForm>
  );
};

export default TypeForm;
