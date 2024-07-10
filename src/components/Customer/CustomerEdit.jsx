import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetCustomerDetailsQuery,
  useUpdateCustomerMutation,
} from "../../redux/services/customer/customerApi";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import { fieldsToUpdate } from "../../utilities/lib/fieldsToUpdate";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { CustomerForm } from "./CustomerForm";

const CustomerEdit = ({ id, setId }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetCustomerDetailsQuery(
    { id },
    { skip: !id }
  );
  const [updateCustomerGroup, { isLoading }] = useUpdateCustomerMutation();

  useEffect(() => {
    if (data) {
      const fieldData = fieldsToUpdate(data);

      setFields(fieldData);
    }
  }, [data, setFields]);

  const handleUpdate = async (values) => {
    const { data, error } = await updateCustomerGroup({
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
      title={"Edit Customer"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <CustomerForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default CustomerEdit;
