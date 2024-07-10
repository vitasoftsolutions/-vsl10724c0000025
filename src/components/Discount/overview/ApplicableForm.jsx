import { Col } from "antd";
import { colLayout } from "../../../layout/FormLayout";
import CustomSelect from "../../Shared/Select/CustomSelect";

const ApplicableForm = () => {
  return (
    <Col {...colLayout}>
      <CustomSelect
        label="Applicable For"
        options={[
          {
            label: "All Products",
            value: "all",
          },
          {
            label: "Specific Products",
            value: "specific",
          },
        ]}
        name={"applicable_for"}
        required={true}
      />
    </Col>
  );
};

export default ApplicableForm;
