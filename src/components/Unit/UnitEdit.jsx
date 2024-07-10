import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useGetUnitDetailsQuery,
  useUpdateUnitMutation,
} from "../../redux/services/unit/unitApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import { fieldsToUpdate } from "../../utilities/lib/fieldsToUpdate";
import { sanitizeObj } from "../../utilities/lib/sanitizeObj";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import UnitForm from "./UnitForm";

export const UnitdEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetUnitDetailsQuery({ id }, { skip: !id });

  const [updateUnit, { isLoading }] = useUpdateUnitMutation();

  useEffect(() => {
    if (data && isEditDrawerOpen) {
      const fieldData = fieldsToUpdate(data);

      setFields(fieldData);
    }
  }, [data, isEditDrawerOpen, setFields]);

  const handleUpdate = async (values) => {
    const formData = new FormData();

    const postData = {
      ...sanitizeObj(values),
      _method: "PUT",
    };

    appendToFormData(postData, formData);

    const { data, error } = await updateUnit({
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
      title={"Edit Unit"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <UnitForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
      />
    </CustomDrawer>
  );
};
