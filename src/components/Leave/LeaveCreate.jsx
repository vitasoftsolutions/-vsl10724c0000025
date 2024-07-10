import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateLeaveMutation } from "../../redux/services/hrm/leave/leaveApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { LeaveForm } from "./LeaveForm";

export const LeaveCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createLeave, { isLoading }] = useCreateLeaveMutation();

  const handleSubmit = async (values) => {
    const formData = new FormData();
    const postData = {
      ...values,
      leave_end_date:
        values?.leave_type === "Half Day" || values?.leave_type === "Single Day"
          ? values?.leave_start_date
          : values?.leave_end_date,
      is_send_email: values?.is_send_email == true ? 1 : 0,
    };

    if (values?.attachment?.length > 0) {
      postData.attachment = values?.attachment?.[0]?.originFileObj;
    }

    appendToFormData(postData, formData);

    const { data, error } = await createLeave({
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
    <CustomDrawer title={"Create Leave"} open={isCreateDrawerOpen}>
      <LeaveForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};
