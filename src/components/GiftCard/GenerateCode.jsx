import { Button, Col, Form, Input, Row } from "antd";
import { GlobalUtilityStyle } from "../../container/Styled";
import { fullColLayout } from "../../layout/FormLayout";
import { generateRandomCode } from "../../utilities/lib/generateCode";

const rowLayout = {
  gutter: 8,
  align: "middle",
};

const GenerateCode = () => {
  const form = Form.useFormInstance();

  const handleGenerateCode = () => {
    const randomCode = generateRandomCode();
    form?.setFieldValue("code", randomCode);
  };

  const onCodeChange = (e) => {
    form.setFieldValue("code", e.target.value);
  };

  return (
    <GlobalUtilityStyle>
      <Form.Item
        label="Generate Code"
        extra={
          <span className="pl-1">Click button to generate a unique code</span>
        }
      >
        <Col {...fullColLayout}>
          <Row {...rowLayout}>
            <Col span={18}>
              <Form.Item
                name="code"
                className="mb-5"
                rules={[
                  {
                    validator: (_, value) => {
                      if (/^\d+$/.test(value)) {
                        // Use regex to check if value consists of digits only
                        return Promise.resolve(); // Resolve if the value contains only digits
                      } else {
                        return Promise.reject(
                          new Error("Only numbers are allowed for this field")
                        ); // Reject if the value contains non-numeric characters
                      }
                    },
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Enter Code"
                  className="border-2"
                  onChange={onCodeChange}
                  size="large"
                  allowClear={true}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Button
                size="large"
                className="mb-5"
                onClick={handleGenerateCode}
              >
                Generate Code
              </Button>
            </Col>
          </Row>
        </Col>
      </Form.Item>
    </GlobalUtilityStyle>
  );
};

export default GenerateCode;
