import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useGetExpenseCategoryDetailsQuery,
  useUpdateExpenseCategoryMutation,
} from "../../redux/services/expense/expenseCategoryApi";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import { fieldsToUpdate } from "../../utilities/lib/fieldsToUpdate";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import ExpenseCategoryForm from "./ExpenseCategoryForm";

const ExpenseCategoryEdit = ({ id }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetExpenseCategoryDetailsQuery(
    { id },
    { skip: !id }
  );
  const [updateExpenseCategory, { isLoading }] =
    useUpdateExpenseCategoryMutation();

  useEffect(() => {
    if (data) {
      const fieldData = fieldsToUpdate(data);

      setFields(fieldData);
    }
  }, [data, setFields]);

  //console.log(id);

  const handleUpdate = async (values) => {
    const { data, error } = await updateExpenseCategory({
      id,
      data: { ...values, _method: "PUT" },
    });

    if (data?.success) {
      dispatch(closeEditDrawer());
    }

    if (error) {
      const errorFields = errorFieldsUpdate(fields, error);

      setFields(errorFields);
    }
  };
  return (
    <CustomDrawer
      title={"Edit Expense Category"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <ExpenseCategoryForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default ExpenseCategoryEdit;
