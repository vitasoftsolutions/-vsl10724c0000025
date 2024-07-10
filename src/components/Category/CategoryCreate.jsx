import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateCategoryMutation } from "../../redux/services/category/categoryApi";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import CategoryForm from "./CategoryForm";

const CategoryCreate = ({
  subDrawer,
  isSubDrawerOpen,
  handleCloseSubDrawer,
}) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [subForm] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);

  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (values) => {
    const postObj = {
      ...values,
      attachment: values?.attachment?.[0].originFileObj,
    };

    const formData = new FormData();
    appendToFormData(postObj, formData);

    const { data, error } = await createCategory({
      data: formData,
    });

    //console.log(subDrawer);

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
      title={"Create Category"}
      open={subDrawer ? isSubDrawerOpen : isCreateDrawerOpen}
      onClose={subDrawer && handleCloseSubDrawer}
    >
      <CategoryForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={subDrawer ? subForm : form}
        onClose={subDrawer && handleCloseSubDrawer}
      />
    </CustomDrawer>
  );
};

export default CategoryCreate;
