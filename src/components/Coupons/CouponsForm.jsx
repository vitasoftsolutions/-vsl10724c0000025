import { Col, Form, Row } from "antd";
import { RiRefreshLine } from "react-icons/ri";
import { mdColLayout, rowLayout } from "../../layout/FormLayout";
import { generateRandomCode } from "../../utilities/lib/generateCode";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInputButton from "../Shared/Input/CustomInputButton";
import CustomSelect from "../Shared/Select/CustomSelect";
import CustomInput from "../Shared/Input/CustomInput";
import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCurrency } from "../../redux/services/pos/posSlice";

const CouponCodeComponent = () => {
  const form = Form.useFormInstance();

  const generate = () => {
    const randomCode = generateRandomCode(6);

    form?.setFieldValue("code", randomCode);
  };

  return (
    <CustomInputButton
      label="Coupon Code"
      type={"text"}
      required={true}
      name={"code"}
      placeholder={"Generate Coupon Code"}
      onClick={generate}
      icon={<RiRefreshLine className="text-xl" />}
      btnText={"Generate"}
    />
  );
};

const options = [
  {
    value: "Percentage",
    label: "Percentage",
  },
  {
    value: "Fixed",
    label: "Fixed",
  },
];

const TypeComponent = () => {
  const form = Form.useFormInstance();

  useEffect(() => {
    form.setFieldValue("type", "Percentage");
  }, [form]);

  return (
    <CustomSelect
      label="Coupon Type"
      required={true}
      name={"type"}
      options={options}
    />
  );
};

const MinAmountComponent = () => {
  // const form = Form.useFormInstance();
  // const type = Form.useWatch("type", form);
  const currency = useSelector(useCurrency);

  return (
    <Col {...mdColLayout} className="">
      <CustomInput
        label="Minimum Amount"
        type={"number_with_money"}
        required={true}
        name={"minimum_amount"}
        suffix={currency?.name}
      />
    </Col>
  );
};

const CouponsForm = (props) => {
  const currency = useSelector(useCurrency);
  const type = Form.useWatch("type", props.form);

  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...mdColLayout}>
          <CouponCodeComponent />
        </Col>
        <Col {...mdColLayout}>
          <TypeComponent />
        </Col>

        <MinAmountComponent />

        <Col {...mdColLayout}>
          <CustomInput
            label="Amount"
            type={
              type === "Percentage"
                ? "number_with_percent"
                : "number_with_money"
            }
            required={true}
            name={"amount"}
            suffix={type === "Percentage" ? "%" : currency?.name}
          />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput
            label="Quantity"
            type={"number"}
            required={true}
            name={"qty"}
          />
        </Col>
        <Col {...mdColLayout}>
          <CustomDatepicker label={"Expired Date"} name={"expired_date"} />
        </Col>
      </Row>
    </CustomForm>
  );
};

export default CouponsForm;
