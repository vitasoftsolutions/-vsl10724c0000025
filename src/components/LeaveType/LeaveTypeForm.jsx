import { Col, Row } from "antd";
import { fullColLayout, rowLayout } from "../../layout/FormLayout";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomCheckbox from "../Shared/Checkbox/CustomCheckbox";

export const LeaveTypeForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...fullColLayout}>
          <CustomInput
            label="Leave Type Name"
            type={"text"}
            required={true}
            name={"name"}
          />
        </Col>
        <Col {...fullColLayout}>
          <CustomCheckbox label="Need Attachment" name={"need_attachment"} />
        </Col>
      </Row>
    </CustomForm>
  );
};
