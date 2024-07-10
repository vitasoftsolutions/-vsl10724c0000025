import { Col, Divider, Form, Radio, Row } from "antd";
import { currencies } from "currencies.json";
import CustomInput from "../../Shared/Input/CustomInput";
import CustomSelect from "../../Shared/Select/CustomSelect";

const rowLayout = {
  gutter: 25,
  align: "middle",
  justify: "start",
};

const colLayout = {
  xs: 24,
  md: 12,
  lg: 8,
};

const CurrencySettingComponent = () => {
  const currenciesOptions = currencies.map(({ name, symbol, code }) => {
    return { label: `${name} (${symbol})`, value: code };
  });

  return (
    <>
      <Divider orientation="left" orientationMargin={0}>
        Currency Settings
      </Divider>
      <Row {...rowLayout}>
        <Col {...colLayout}>
          <CustomSelect
            name={"currency"}
            label={"Currency"}
            options={currenciesOptions}
            required={true}
          />
        </Col>
        <Col {...colLayout}>
          <CustomInput
            name={"decimal_point"}
            label={"Digits After Decimal Point"}
            type={"number"}
            required={true}
          />
        </Col>
        <Col {...colLayout}>
          <Form.Item label="Currency Position" name={"currency_position"}>
            <Radio.Group>
              <Radio value="0">Prefix</Radio>
              <Radio value="1">Suffix</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default CurrencySettingComponent;
