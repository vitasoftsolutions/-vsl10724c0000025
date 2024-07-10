import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Form } from "antd";
import {
  useGetCategoryDetailsQuery,
  useUpdateCategoryMutation,
} from "../../redux/services/category/categoryApi";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import { fieldsToUpdate } from "../../utilities/lib/fieldsToUpdate";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import CategoryForm from "./CategoryForm";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import defaultUser from "../../assets/data/defaultUserImage";

const Categoryedit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetCategoryDetailsQuery(
    { id },
    { skip: !id }
  );

  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  useEffect(() => {
    if (data) {
      const fieldData = fieldsToUpdate(data);

      let newFieldData = fieldData;

      if (data?.attachments?.length === 0) {
        newFieldData = [
          ...fieldData,
          {
            name: "attachment",
            value: [
              {
                url: defaultUser,
              },
            ],
            erros: "",
          },
        ];
      }

      setFields(newFieldData);
    }
  }, [data, setFields]);

  const handleUpdate = async (values) => {
    const postObj = { ...values, _method: "PUT" };

    if (
      values?.attachment?.length > 0 &&
      values?.attachment?.[0]?.originFileObj
    ) {
      postObj.attachment = values?.attachment?.[0]?.originFileObj;
    }

    const formData = new FormData();

    appendToFormData(postObj, formData);

    const { data, error } = await updateCategory({
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
      title={"Edit Category"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <CategoryForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default Categoryedit;
