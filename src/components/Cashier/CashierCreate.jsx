import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateCashierMutation } from "../../redux/services/cashier/cashierApi";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import CashierForm from "./CashierForm";

const CashierCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);

  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createSupplier, { isLoading }] = useCreateCashierMutation();

  const handleSubmit = async (values) => {
    const { data, error } = await createSupplier({ data: values });

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
    <CustomDrawer title={"Create Cashier"} open={isCreateDrawerOpen}>
      <CashierForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default CashierCreate;
