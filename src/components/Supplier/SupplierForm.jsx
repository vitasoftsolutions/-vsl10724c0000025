import { Col, Form, Row } from "antd";
import { countries } from "../../assets/data/countries";
import {
  colLayout,
  fullColLayout,
  mdColLayout,
  rowLayout,
} from "../../layout/FormLayout";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomSelect from "../Shared/Select/CustomSelect";

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

const SupplierForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...colLayout}>
          <CustomInput
            label="Name"
            type={"text"}
            required={true}
            name={"name"}
          />
        </Col>

        <Col {...colLayout}>
          <CustomInput
            label="Email"
            type={"email"}
            // required={true}
            name={"email"}
          />
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
          <CustomInput
            label="Company Name"
            type={"text"}
            required={true}
            name={"company_name"}
          />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput label="Vat Number" type={"text"} name={"vat_number"} />
        </Col>
        <Col {...mdColLayout}>
          <CountriesForm />
        </Col>
        <Col {...mdColLayout}>
          <CitiesForm />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput
            label="State"
            type={"text"}
            // required={true}
            name={"state"}
          />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput
            label="Postal Code"
            type={"number"}
            // required={true}
            name={"postal_code"}
          />
        </Col>
        <Col {...fullColLayout}>
          <CustomInput
            label="Address"
            type={"textarea"}
            required={true}
            name={"address"}
          />
        </Col>
      </Row>
    </CustomForm>
  );
};

export default SupplierForm;
