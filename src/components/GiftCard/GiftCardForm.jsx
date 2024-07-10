import { Col, Form, Row } from "antd";
import { RiRefreshLine } from "react-icons/ri";
import {
  colLayout,
  fullColLayout,
  mdColLayout,
  rowLayout,
} from "../../layout/FormLayout";
import { useGetAllCustomerQuery } from "../../redux/services/customer/customerApi";
import { generateRandomCode } from "../../utilities/lib/generateCode";
import { GiftCardTypeComponent } from "../ReusableComponent/GiftCardTypeComponent";
import CustomCheckbox from "../Shared/Checkbox/CustomCheckbox";
import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomInputButton from "../Shared/Input/CustomInputButton";
import CustomSelect from "../Shared/Select/CustomSelect";

// const GiftCardTypeComponent = () => {
//   const params = useGlobalParams({
//     selectValue: DEFAULT_SELECT_VALUES,
//   });

//   const { data, isFetching } = useGetAllGiftCardTypeQuery({ params });

//   const options = data?.results?.giftcardtype?.map((giftCardType) => ({
//     value: giftCardType.id?.toString(),
//     label: giftCardType.name,
//   }));

//   return (
//     <CustomSelect
//       label="Gift Card Type"
//       name={"gift_card_type_id"}
//       options={options}
//       isLoading={isFetching}
//       required={true}
//     />
//   );
// };

const GiftCardComponent = () => {
  const form = Form.useFormInstance();

  const generate = () => {
    const randomCode = generateRandomCode(8);

    form?.setFieldValue("card_no", randomCode);
  };

  return (
    <CustomInputButton
      label="Coupon Code"
      type={"text"}
      required={true}
      name={"card_no"}
      placeholder={"Generate Coupon Code"}
      onClick={generate}
      icon={<RiRefreshLine className="text-xl" />}
      // btnText={"Generate"}
    />
  );
};

const EmployeeComponent = () => {
  const { data, isLoading } = useGetAllCustomerQuery({});

  const options = data?.results?.customer?.map((customer) => ({
    value: customer.id?.toString(),
    label: customer.name,
  }));

  return (
    <CustomSelect
      label="User"
      name={"user"}
      options={options}
      isLoading={isLoading}
      required={true}
    />
  );
};

const CustomerComponent = () => {
  const { data, isLoading } = useGetAllCustomerQuery({});

  const options = data?.results?.customer?.map((customer) => ({
    value: customer.id?.toString(),
    label: customer.name,
  }));

  return (
    <CustomSelect
      label="Customer"
      name={"customer_id"}
      options={options}
      isLoading={isLoading}
      required={true}
    />
  );
};

const RecieverComponent = () => {
  const form = Form.useFormInstance();
  const user = Form.useWatch("for_user", form);

  if (user) return <EmployeeComponent />;

  return <CustomerComponent />;
};

const GiftCardForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...colLayout}>
          <GiftCardTypeComponent />
        </Col>
        <Col {...colLayout}>
          <GiftCardComponent />
        </Col>
        <Col {...colLayout}>
          <CustomInput label="Amount" name={"amount"} required={true} />
        </Col>

        <Col {...fullColLayout} className="mb-2">
          <CustomCheckbox label={"User"} name={"for_user"} />
        </Col>
        <Col {...mdColLayout}>
          <RecieverComponent />
        </Col>
        <Col {...mdColLayout}>
          <CustomDatepicker
            label={"Expired Date"}
            name={"expired_date"}
            required={true}
          />
        </Col>
      </Row>
    </CustomForm>
  );
};

export default GiftCardForm;
