import { Col, Row } from "antd";
import { colLayout, rowLayout } from "../../layout/FormLayout";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";

const CurrencyForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...colLayout}>
          <CustomInput
            label={"Currency Name"}
            type={"text"}
            required={true}
            name={"name"}
          />
        </Col>
        <Col {...colLayout}>
          <CustomInput
            label={"Currency Code"}
            type={"text"}
            required={true}
            name={"code"}
          />
        </Col>
        <Col {...colLayout}>
          <CustomInput
            label={"Exchange Rate"}
            type={"number"}
            required={true}
            name={"exchange_rate"}
          />
        </Col>
      </Row>
    </CustomForm>
  );
};

export default CurrencyForm;
