import { Checkbox, Form } from "antd";
import { GlobalUtilityStyle } from "../../../container/Styled";
const { Group } = Checkbox;

const CustomCheckbox = (props) => {
  const {
    label,
    subLabel,
    name,
    required = false,
    mode = "single",
    options = [],
    onChange,
    checked,
  } = props;

  return (
    <GlobalUtilityStyle>
      <Form.Item
        label={label}
        name={name}
        rules={[{ required: required, message: `Please select ${label}!` }]}
        required={required}
        valuePropName={mode === "single" && "checked"}
        noStyle
      >
        {mode === "single" && !onChange && (
          <Checkbox className="my-1" required={required}>
            <span>{label}</span>
            <span className="text-sm text-gray-500 px-2">{subLabel}</span>
          </Checkbox>
        )}

        {mode === "single" && onChange && (
          <Checkbox
            className="my-1"
            required={required}
            onChange={onChange}
            checked={checked}
          >
            <span>{label}</span>
            <span className="text-sm text-gray-500 px-2">{subLabel}</span>
          </Checkbox>
        )}

        {mode === "group" && (
          <>
            <span>{label}</span>
            <Group options={options} className="flex my-5 gap-3" />
          </>
        )}
      </Form.Item>
    </GlobalUtilityStyle>
  );
};

export default CustomCheckbox;
