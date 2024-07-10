import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateAnnouncementMutation } from "../../redux/services/hrm/announcement/announcementApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { AnnouncementForm } from "./AnnouncementForm";

export const AnnoucementCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();

  const handleSubmit = async (values) => {
    const formData = new FormData();

    const postData = {
      ...values,
      is_send_email: values?.is_send_email ? 1 : 0,
      department_ids: JSON.stringify(values?.department_ids),
    };

    appendToFormData(postData, formData);
    const { data, error } = await createAnnouncement({
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
    <CustomDrawer title={"Create Announcement"} open={isCreateDrawerOpen}>
      <AnnouncementForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};
