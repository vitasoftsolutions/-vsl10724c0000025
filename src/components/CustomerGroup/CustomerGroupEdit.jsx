import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetCustomerGroupDetailsQuery,
  useUpdateCustomerGroupMutation,
} from "../../redux/services/customerGroup/customerGroupApi";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import { fieldsToUpdate } from "../../utilities/lib/fieldsToUpdate";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import CustomerGroupForm from "./CustomerGroupForm";

export const CustomerGroupEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetCustomerGroupDetailsQuery(
    { id },
    { skip: !id }
  );
  const [updateCustomerGroup, { isLoading }] = useUpdateCustomerGroupMutation();

  useEffect(() => {
    if (data) {
      const fieldData = fieldsToUpdate(data);

      setFields(fieldData);
    }
  }, [data, setFields]);

  const handleUpdate = async (values) => {
    const { data, error } = await updateCustomerGroup({
      id,
      data: {
        ...values,
        percentage: values.percentage.toString(),
        _method: "PUT",
      },
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
      title={"Edit Customer Group"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <CustomerGroupForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
      />
    </CustomDrawer>
  );
};
