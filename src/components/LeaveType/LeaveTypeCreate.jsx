import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateLeaveTypeMutation } from "../../redux/services/settings/leaveType/leaveTypeApi";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { LeaveTypeForm } from "./LeaveTypeForm";

export const LeaveTypeCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createLeaveType, { isLoading }] = useCreateLeaveTypeMutation();

  const handleSubmit = async (values) => {
    //console.log(values);
    const { data, error } = await createLeaveType({
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
    <CustomDrawer title={"Create Leave Type"} open={isCreateDrawerOpen}>
      <LeaveTypeForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};
