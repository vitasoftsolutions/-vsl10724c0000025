import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useGetLeaveTypeDetailsQuery,
  useUpdateLeaveTypeMutation,
} from "../../redux/services/settings/leaveType/leaveTypeApi";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { LeaveTypeForm } from "./LeaveTypeForm";

export const LeaveTypeEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetLeaveTypeDetailsQuery(
    { id },
    { skip: !id }
  );

  const [updateLeaveType, { isLoading }] = useUpdateLeaveTypeMutation();

  useEffect(() => {
    if (data) {
      const fieldData = [
        {
          name: "name",
          value: data?.name,
          errors: "",
        },
        {
          name: "need_attachment",
          value: data?.need_attachment === 1 ? true : false,
          errors: "",
        },
      ];

      setFields(fieldData);
    }
  }, [data, setFields]);

  const handleUpdate = async (values) => {
    const { data, error } = await updateLeaveType({
      id,
      data: { ...values, _method: "PUT" },
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
      title={"Edit Leave Type"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <LeaveTypeForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
      />
    </CustomDrawer>
  );
};
