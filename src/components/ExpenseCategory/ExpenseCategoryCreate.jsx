import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateExpenseCategoryMutation } from "../../redux/services/expense/expenseCategoryApi";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import ExpenseCategoryForm from "./ExpenseCategoryForm";
import { Form } from "antd";

const ExpenseCategoryCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);

  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createExpenseCategory, { isLoading }] =
    useCreateExpenseCategoryMutation();

  const handleSubmit = async (values) => {
    const { data, error } = await createExpenseCategory({ data: values });

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
    <CustomDrawer title={"Create Expense Category"} open={isCreateDrawerOpen}>
      <ExpenseCategoryForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default ExpenseCategoryCreate;
