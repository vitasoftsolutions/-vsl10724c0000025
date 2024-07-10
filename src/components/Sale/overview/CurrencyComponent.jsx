import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Form, Row, Tooltip } from "antd";
import { currencies } from "currencies.json";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCurrency } from "../../../redux/services/pos/posSlice";
import CustomInput from "../../Shared/Input/CustomInput";
import CustomSelect from "../../Shared/Select/CustomSelect";

const CurrencyComponent = () => {
  const form = Form.useFormInstance();

  const options = currencies.map(({ name, symbol, code }) => {
    return { label: `${name} (${symbol})`, value: code };
  });

  const currency = useSelector(useCurrency);

  useEffect(() => {
    if (options?.length && !form.getFieldValue("currency")) {
      form.setFieldValue("currency", currency?.name);
    }
  }, [currency?.name, form, options]);

  return (
    <CustomSelect
      placeholder={"currency"}
      showSearch={true}
      options={options}
      required={true}
      name="currency"
    />
  );
};

const CurrencyExchangeComponent = () => {
  const form = Form.useFormInstance();

  useEffect(() => {
    form.setFieldValue("exchange_rate", 1);
  }, [form]);

  const content = (
    <Tooltip title="Cuurency Exchange Rate">
      <InfoCircleOutlined
        style={{
          color: "rgba(0,0,0,.45)",
        }}
      />
    </Tooltip>
  );

  return (
    <CustomInput
      type={"number"}
      required={true}
      name={"exchange_rate"}
      placeholder={"Exchange Rate"}
      suffix={content}
    />
  );
};

export const CurrencyFormComponent = () => {
  return (
    <Form.Item label={"Currency Exchange Rate"} className="mb-0">
      <Row gutter={5}>
        <Col xs={14}>
          <CurrencyComponent />
        </Col>
        <Col xs={10}>
          <CurrencyExchangeComponent />
        </Col>
      </Row>
    </Form.Item>
  );
};
