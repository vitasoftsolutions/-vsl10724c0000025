import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateCustomerGroupMutation } from "../../redux/services/customerGroup/customerGroupApi";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import CustomerGroupForm from "./CustomerGroupForm";

const CustomerGroupCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);

  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createCustomerGroup, { isLoading }] = useCreateCustomerGroupMutation();

  const handleSubmit = async (values) => {
    //console.log(values);

    const { data, error } = await createCustomerGroup({
      data: { ...values, percentage: values.percentage.toString() },
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
    <CustomDrawer title={"Create Customer Group"} open={isCreateDrawerOpen}>
      <CustomerGroupForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default CustomerGroupCreate;
