import { Button, Form, Select, Space, Spin } from "antd";
import { GlobalUtilityStyle } from "../../../container/Styled";

export const CustomSelectButton = (props) => {
  const {
    name,
    label,
    placeholder,
    required = false,
    requireMsg = undefined,
    onClick,
    showSearch,
    icon,
    mode = "single",
    options = [],
    isLoading,
    styleProps,

    //for mb-0
    size = "large",
    customStyle,
  } = props;

  const filterOption = (input, option) =>
    (option?.label ?? "").toLocaleLowerCase().includes(input);

  const filterSort = (optionA, optionB) =>
    (optionA?.label ?? "")
      .toLowerCase()
      .localeCompare((optionB?.label ?? "").toLowerCase());

  return (
    <GlobalUtilityStyle>
      <Form.Item
        label={label}
        required={required}
        className={customStyle && "mb-0"}
      >
        <Space.Compact style={{ width: "100%" }}>
          <Form.Item
            name={name}
            rules={[
              {
                required: required,
                message: `Please Select ${requireMsg ?? label}!`,
              },
            ]}
            noStyle
          >
            {showSearch ? (
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={filterOption}
                filterSort={filterSort}
                placeholder={`Select ${placeholder ?? label}`}
                className="mt-1 custom-selector"
                size={size}
                loading={isLoading}
                options={options}
                mode={mode}
                notFoundContent={
                  isLoading && (
                    <Spin
                      size="small"
                      className="w-full flex justify-center items-center"
                    />
                  )
                }
                style={{
                  ...styleProps,
                }}
                allowClear={true}
              />
            ) : (
              <Select
                placeholder={`Select ${placeholder ?? label}`}
                className="mt-1 custom-selector"
                size="large"
                loading={isLoading}
                options={options}
                mode={mode}
                notFoundContent={
                  isLoading && (
                    <Spin
                      size="small"
                      className="w-full flex justify-center items-center"
                    />
                  )
                }
                style={{
                  ...styleProps,
                }}
                allowClear={true}
              />
            )}
          </Form.Item>
          <Button
            onClick={onClick}
            icon={icon}
            className="border-2 mt-1"
            size={size}
          />
        </Space.Compact>
      </Form.Item>
    </GlobalUtilityStyle>
  );
};
