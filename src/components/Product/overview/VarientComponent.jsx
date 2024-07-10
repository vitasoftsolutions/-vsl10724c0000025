import { Col, Form, Row } from "antd";
import { fullColLayout, rowLayout } from "../../../layout/FormLayout";
import CustomCheckbox from "../../Shared/Checkbox/CustomCheckbox";

export const VarientComponent = () => {
  const form = Form.useFormInstance();

  const has_varient = Form.useWatch("has_varient", form);
  const has_expired_date = Form.useWatch("has_expired_date", form);

  if (!has_expired_date)
    return (
      <Row {...rowLayout}>
        <Col {...fullColLayout}>
          <CustomCheckbox label="This Product has varient" name="has_varient" />
        </Col>

        {has_varient && <Col {...fullColLayout}>i need info</Col>}
      </Row>
    );
};
