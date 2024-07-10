import { Col, Form } from "antd";
import { useEffect } from "react";
import { colLayout } from "../../../layout/FormLayout";
import CustomInput from "../../Shared/Input/CustomInput";
import CustomSelect from "../../Shared/Select/CustomSelect";

const options = [
  {
    value: "Cash",
    label: "Cash",
  },
  {
    value: "Card",
    label: "Card",
  },
  {
    value: "Cheque",
    label: "Cheque",
  },
];

const PaymentType = () => {
  const form = Form.useFormInstance();

  useEffect(() => {
    form.setFieldValue("payment_type", options[0].value);
  }, [form]);

  return (
    <CustomSelect
      label="Payment Type"
      options={options}
      name={"payment_type"}
      required={true}
    />
  );
};

export const PaymentTypeComponent = () => {
  return (
    <>
      <Col {...colLayout}>
        <PaymentType />
      </Col>

      <Col {...colLayout}>
        <CustomInput
          type={"number"}
          name="paid_amount"
          label="Paid Amount"
          required={true}
        />
      </Col>
    </>
  );
};
