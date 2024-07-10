import { Col, Row } from "antd";
import { fullColLayout, rowLayout } from "../../layout/FormLayout";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";

export const GiftCardTypeForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...fullColLayout}>
          <CustomInput label="Name" name={"name"} required={true} />
        </Col>
      </Row>
    </CustomForm>
  );
};
