import { Col, Divider, Row } from "antd";
import CustomInput from "../../Shared/Input/CustomInput";

const rowLayout = {
  gutter: 25,
  align: "middle",
  justify: "start",
};

const colLayout = {
  xs: 24,
  md: 12,
  lg: 8,
};

const CompanySetting = () => {
  return (
    <div>
      <Divider orientation="left" orientationMargin={0}>
        Compnay Settings
      </Divider>
      <Row {...rowLayout}>
        <Col {...colLayout}>
          <CustomInput
            label={"System Title"}
            type={"text"}
            required={true}
            name={"site_title"}
          />
        </Col>
        <Col {...colLayout}>
          <CustomInput
            name={"company"}
            label={"Company Name"}
            type={"text"}
            required={true}
          />
        </Col>
        <Col {...colLayout}>
          <CustomInput
            name={"reg_number"}
            label={"Vat Registration Number"}
            type={"text"}
            required={true}
          />
        </Col>
      </Row>
    </div>
  );
};

export default CompanySetting;
