import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateDepartmentMutation } from "../../redux/services/hrm/department/departmentApi";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import DepartmentForm from "./DepartmentForm";

const DepartmentCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);

  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createDepartment, { isLoading }] = useCreateDepartmentMutation();

  const handleSubmit = async (values) => {
    const { data, error } = await createDepartment({
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
    <CustomDrawer title={"Create Department"} open={isCreateDrawerOpen}>
      <DepartmentForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default DepartmentCreate;
