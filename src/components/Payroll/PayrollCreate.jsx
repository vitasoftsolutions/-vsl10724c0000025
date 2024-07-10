import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreatePayrollMutation } from "../../redux/services/hrm/payroll/payrollApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import { sanitizeObj } from "../../utilities/lib/sanitizeObj";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { PayrollForm } from "./PayrollForm";

export const PayrollCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createPayroll, { isLoading }] = useCreatePayrollMutation();

  const handleSubmit = async (values) => {
    const formData = new FormData();

    const postData = {
      ...sanitizeObj(values),
      is_send_email: values?.is_send_email == true ? 1 : 0,
      bonus: Number(values?.bonus).toFixed(2),
      loan: Number(values?.loan).toFixed(2),
      salary: Number(values?.salary).toFixed(2),
    };

    appendToFormData(postData, formData);

    const { data, error } = await createPayroll({
      data: formData,
    });

    if (data?.success) {
      dispatch(closeCreateDrawer());
      form.resetFields();
    }
    if (error) {
      const errorFields = Object.keys(error?.data?.errors).map((fieldName) => ({
        name: fieldName,
        errors: error?.data?.errors[fieldName],
      }));
      setErrorFields(errorFields);
    }
  };

  return (
    <CustomDrawer title={"Create Payroll"} open={isCreateDrawerOpen}>
      <PayrollForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};
