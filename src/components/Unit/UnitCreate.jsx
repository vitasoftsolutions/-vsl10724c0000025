import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateUnitMutation } from "../../redux/services/unit/unitApi";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import UnitForm from "./UnitForm";

const UnitCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);

  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createUnit, { isLoading }] = useCreateUnitMutation();

  const handleSubmit = async (values) => {
    const { data, error } = await createUnit({
      data: {
        ...values,
        operator: values.operator ? values.operator : "*",
        operation_value: values.operation_value ? values.operation_value : 1,
      },
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
    <CustomDrawer title={"Create Unit"} open={isCreateDrawerOpen}>
      <UnitForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default UnitCreate;
