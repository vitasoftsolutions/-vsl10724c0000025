import { Col, Row } from "antd";
import CustomForm from "../../../../components/Shared/Form/CustomForm";
import CustomInput from "../../../../components/Shared/Input/CustomInput";

const rowLayout = {
  gutter: 25,
  // align: "middle",
  // justify: "start",
};

const colLayout = {
  xs: 24,
  md: 12,
};

const colLayoutDescription = {
  xs: 24,
};

const RolePermissionForm = (props) => {
  return (
    <CustomForm
      handleSubmit={handleSubmit}
      className=""
      fields={fields}
      isLoading={isLoading}
    >
      <Row {...rowLayout}>
        <Col {...colLayout}>
          <CustomInput
            label="Name"
            type={"text"}
            required={true}
            name={"name"}
            placeholder={"Name"}
          />
        </Col>
        <Col {...colLayoutDescription}>
          <CustomInput
            label="Description"
            type={"textarea"}
            required={true}
            name={"description"}
            placeholder={"Description"}
          />
        </Col>
      </Row>
    </CustomForm>
  );
};

export default RolePermissionForm;
