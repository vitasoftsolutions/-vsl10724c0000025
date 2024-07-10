import { Form, Radio } from "antd";
import { GlobalUtilityStyle } from "../../../container/Styled";

const CustomRadio = ({ label, required, name, options }) => {
  return (
    <GlobalUtilityStyle>
      <Form.Item
        label={label}
        name={name}
        rules={[{ required: required, message: `Please input ${label}!` }]}
      >
        <Radio.Group>
          {/* <Radio value="1">Yes</Radio>
          <Radio value="0">No</Radio> */}

          {options.map((option) => (
            <Radio value={option.value} key={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    </GlobalUtilityStyle>
  );
};

export default CustomRadio;
