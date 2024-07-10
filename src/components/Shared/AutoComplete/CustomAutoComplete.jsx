import { AutoComplete, Form } from "antd";
import { GlobalUtilityStyle } from "../../../container/Styled";

const CustomAutoComplete = (props) => {
  const {
    label,
    name,
    required,
    requireMsg,
    options = [],
    onSearch,
    placeholder,
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
      >
        <AutoComplete
          options={options}
          onSearch={onSearch}
          allowClear={true}
          size="large"
          placeholder={placeholder ?? `Enter ${label}`}
          className="mt-2"
        />
      </Form.Item>
    </GlobalUtilityStyle>
  );
};

export default CustomAutoComplete;
