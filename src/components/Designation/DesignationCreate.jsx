import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateDesignationMutation } from "../../redux/services/hrm/designation/designationApi";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { DesignationForm } from "./DesignationForm";

export const DesignationCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createDesignation, { isLoading }] = useCreateDesignationMutation();

  const handleSubmit = async (values) => {
    //console.log(values);
    const { data, error } = await createDesignation({
      data: values,
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
    <CustomDrawer title={"Create Designation"} open={isCreateDrawerOpen}>
      <DesignationForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};
