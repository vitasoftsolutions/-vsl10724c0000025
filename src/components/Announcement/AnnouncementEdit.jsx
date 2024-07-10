import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import { useGetAnnouncementDetailsQuery } from "../../redux/services/hrm/announcement/announcementApi";
import { useUpdateLeaveTypeMutation } from "../../redux/services/settings/leaveType/leaveTypeApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import {
  fieldsToUpdate,
  updateFieldValues,
} from "../../utilities/lib/fieldsToUpdate";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { AnnouncementForm } from "./AnnouncementForm";

export const AnnouncementEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetAnnouncementDetailsQuery(
    {
      id,
      params: {
        child: 1,
      },
    },
    { skip: !id }
  );

  const [updateLeaveType, { isLoading }] = useUpdateLeaveTypeMutation();

  useEffect(() => {
    if (data) {
      const fieldData = fieldsToUpdate(data);

      const updateFieldData = [
        {
          name: "department_ids",
          value: data?.departments?.map((item) => item?.id?.toString()),
          erros: "",
        },
      ];

      const newFieldData = updateFieldValues(fieldData, updateFieldData);

      setFields(newFieldData);
    }
  }, [data, setFields]);

  const handleUpdate = async (values) => {
    const formData = new FormData();

    const postData = {
      ...values,
      is_send_email: values?.is_send_email ? 1 : 0,
      department_ids: JSON.stringify(values?.department_ids),
      _method: "PUT",
    };

    appendToFormData(postData, formData);

    const { data, error } = await updateLeaveType({
      id,
      data: formData,
    });

    if (data?.success) {
      setId(undefined);
      dispatch(closeEditDrawer());
    }

    if (error) {
      const errorFields = errorFieldsUpdate(fields, error);

      setFields(errorFields);
    }
  };

  return (
    <CustomDrawer
      title={"Edit Annoucement"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <AnnouncementForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
      />
    </CustomDrawer>
  );
};
