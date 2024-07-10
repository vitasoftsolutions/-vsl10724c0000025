import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateAttendenceMutation } from "../../redux/services/hrm/attendence/attendenceApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { AttendanceForm } from "./AttendanceForm";

const AttendanceCreate = ({
  subDrawer,
  isSubDrawerOpen,
  handleCloseSubDrawer,
}) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [subForm] = Form.useForm();

  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createAttendence, { isLoading }] = useCreateAttendenceMutation();

  const handleSubmit = async (values) => {
    const formData = new FormData();

    const timeString = values?.hours ?? "00:00:00";
    const [hours, minutes] = timeString.split(":").map(Number);

    const postData = {
      ...values,
      date: values.date,
      check_in: values.check_in.format("HH:mm:ss"),
      check_out: values.check_out.format("HH:mm:ss"),
      hours: hours + ":" + minutes,
    };

    appendToFormData(postData, formData);

    const { data, error } = await createAttendence({
      data: formData,
    });

    if (data?.success) {
      if (subDrawer) {
        handleCloseSubDrawer();
        subForm.resetFields();
      } else {
        dispatch(closeCreateDrawer());
        form.resetFields();
      }
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
    <CustomDrawer
      title={"Create Attendance"}
      open={subDrawer ? isSubDrawerOpen : isCreateDrawerOpen}
      onClose={subDrawer && handleCloseSubDrawer}
    >
      <AttendanceForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={subDrawer ? subForm : form}
        onClose={subDrawer && handleCloseSubDrawer}
      />
    </CustomDrawer>
  );
};

export default AttendanceCreate;
