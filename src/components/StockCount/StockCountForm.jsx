import { Col, Row } from "antd";
import { useEffect } from "react";
import { fullColLayout, rowLayout } from "../../layout/FormLayout";
import CustomForm from "../Shared/Form/CustomForm";
import CustomSelect from "../Shared/Select/CustomSelect";
import PartialForm from "./PartialForm";

const options = [
  {
    // full
    value: "Full",
    label: "Full",
  },
  {
    // partial
    value: "Partial",
    label: "Partial",
  },
];

const StockCountForm = (props) => {
  const form = props.form;

  useEffect(() => {
    if (!form?.getFieldValue("type")) {
      form.setFieldValue("type", "Full");
    }
  }, [form]);

  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...fullColLayout}>
          <CustomSelect
            label="Type"
            options={options}
            name={"type"}
            required={true}
          />
        </Col>

        <PartialForm />
      </Row>
    </CustomForm>
  );
};

export default StockCountForm;
