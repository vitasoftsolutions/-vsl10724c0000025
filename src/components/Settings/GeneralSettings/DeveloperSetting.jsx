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
};
const DeveloperSettingComponent = () => {
  return (
    <>
      <Divider orientation="left" orientationMargin={0}>
        Developer Settings
      </Divider>
      <Row {...rowLayout}>
        <Col {...colLayout}>
          <CustomInput
            name={"developed_by"}
            label={"Developed By"}
            type={"text"}
            required={true}
          />
        </Col>
        <Col {...colLayout}>
          <CustomInput
            name={"developed_by_link"}
            label={"Developed By Link"}
            type={"text"}
            required={true}
          />
        </Col>
      </Row>
    </>
  );
};

export default DeveloperSettingComponent;
