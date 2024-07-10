import { Form, InputNumber } from "antd";
import { GlobalUtilityStyle } from "../../../container/Styled";

export const CustomQuantityInput = (props) => {
  const {
    name,
    label,
    required = false,
    prefix,
    suffix,
    requireMsg = undefined,
    noStyle = false,
    tooltip,
    onChange,
    value,
  } = props;

  return (
    <GlobalUtilityStyle>
      <Form.Item
        label={label}
        name={name}
        rules={[
          {
            required: required,
            message: `Please input ${requireMsg ?? label}!`,
          },
        ]}
        tooltip={tooltip}
        noStyle={noStyle}
      >
        <InputNumber
          type="number"
          className="mt-1 border-2 w-full"
          size="large"
          prefix={prefix}
          suffix={suffix}
          onChange={onChange}
          controls={false}
          changeOnWheel={false}
          value={value}
        />
      </Form.Item>
    </GlobalUtilityStyle>
  );
};
