import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useGetDesignationDetailsQuery,
  useUpdateDesignationMutation,
} from "../../redux/services/hrm/designation/designationApi";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import { fieldsToUpdate } from "../../utilities/lib/fieldsToUpdate";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { DesignationForm } from "./DesignationForm";

export const DesignationEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetDesignationDetailsQuery(
    {
      id,
      params: {
        parent: 1,
      },
    },
    { skip: !id }
  );

  //console.log(isEditDrawerOpen, id);

  const [updateDesignation, { isLoading }] = useUpdateDesignationMutation();

  useEffect(() => {
    if (data) {
      const fieldData = fieldsToUpdate(data);
      const newFieldData = [
        ...fieldData,
        {
          name: "department_id",
          value: data?.departments?.id.toString(),
          errors: "",
        },
      ];

      setFields(newFieldData);
    }
  }, [data, setFields]);

  const handleUpdate = async (values) => {
    // const formData = new FormData();

    //console.log(values);

    // const postData = {
    //   ...values,
    //   _method: "PUT",
    // };

    // appendToFormData(postData, formData);

    const { data, error } = await updateDesignation({
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
      title={"Edit Designation"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <DesignationForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
      />
    </CustomDrawer>
  );
};
