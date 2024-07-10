import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateBrandMutation } from "../../redux/services/brand/brandApi";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import BrandForm from "./BrandForm";

const BrandCreate = ({ subDrawer, isSubDrawerOpen, handleCloseSubDrawer }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [subForm] = Form.useForm();

  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createBrand, { isLoading }] = useCreateBrandMutation();

  const handleSubmit = async (values) => {
    const formData = new FormData();

    const postData = {
      ...values,
      logo: values?.logo?.[0].originFileObj,
    };

    appendToFormData(postData, formData);

    const { data, error } = await createBrand({
      formData,
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
      title={"Create Brand"}
      open={subDrawer ? isSubDrawerOpen : isCreateDrawerOpen}
      onClose={subDrawer && handleCloseSubDrawer}
    >
      <BrandForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={subDrawer ? subForm : form}
        onClose={subDrawer && handleCloseSubDrawer}
      />
    </CustomDrawer>
  );
};

export default BrandCreate;
