import { Form } from "antd";
import { useEffect } from "react";

export const useInitialFormField = (name, options) => {
  const form = Form.useFormInstance();

  useEffect(() => {
    if (options?.length && !form.getFieldValue(name)) {
      form.setFieldValue(name, options[0].value);
    }
  }, [form, name, options]);
};

export const useSetFieldValue = (field, value) => {
  const form = Form.useFormInstance();
  useEffect(() => {
    form.setFieldValue(field, value);
  }, [form, field, value]);
};
