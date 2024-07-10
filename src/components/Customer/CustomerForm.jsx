import { Col, Form, Row } from "antd";
import { useEffect } from "react";
import { countries } from "../../assets/data/countries";
import {
  colLayout,
  fullColLayout,
  mdColLayout,
  rowLayout,
} from "../../layout/FormLayout";
import { useGetAllCustomerGroupQuery } from "../../redux/services/customerGroup/customerGroupApi";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomSelect from "../Shared/Select/CustomSelect";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";

const CustomerGroupComonent = () => {
  const form = Form.useFormInstance();

  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllCustomerGroupQuery({ params });

  const options = data?.results?.customergroup?.map((item) => ({
    value: item.id?.toString(),
    label: item.name,
  }));

  useEffect(() => {
    form.setFieldValue("customer_group_id", options?.[0]?.value);
  }, [form, options]);

  return (
    <CustomSelect
      label="Customer Group"
      required={true}
      options={options}
      isLoading={isLoading}
      showSearch={true}
      name="customer_group_id"
    />
  );
};

const CountriesForm = () => {
  const options = Object.keys(countries).map((country) => ({
    value: country,
    label: country,
  }));

  return (
    <CustomSelect
      label="Country"
      // required={true}
      options={options}
      showSearch={true}
      name="country"
    />
  );
};

const CitiesForm = () => {
  const form = Form.useFormInstance();
  const selectedCountry = Form.useWatch("country", form);

  const options =
    countries[selectedCountry]?.map((city) => ({
      value: city,
      label: city,
    })) ?? [];

  return (
    <CustomSelect
      label="City"
      // required={true}
      options={options}
      showSearch={true}
      name="city"
    />
  );
};

export const CustomerForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...mdColLayout}>
          <CustomerGroupComonent />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput
            label="Company Name"
            type={"text"}
            name={"company_name"}
          />
        </Col>
        <Col {...colLayout}>
          <CustomInput
            label="Name"
            type={"text"}
            required={true}
            name={"name"}
          />
        </Col>

        <Col {...colLayout}>
          <CustomInput label="Email" type={"email"} name={"email"} />
        </Col>
        <Col {...colLayout}>
          <CustomInput
            label="Phone Number"
            type={"phone"}
            required={true}
            name={"phone_number"}
          />
        </Col>

        <Col {...mdColLayout}>
          <CountriesForm />
        </Col>
        <Col {...mdColLayout}>
          <CitiesForm />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput label="State" type={"text"} name={"state"} />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput
            label="Postal Code"
            type={"number"}
            name={"postal_code"}
          />
        </Col>
        <Col {...fullColLayout}>
          <CustomInput label="Address" type={"textarea"} name={"address"} />
        </Col>
      </Row>
    </CustomForm>
  );
};
