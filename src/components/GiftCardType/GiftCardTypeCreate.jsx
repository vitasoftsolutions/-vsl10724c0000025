import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateGiftCardTypeMutation } from "../../redux/services/giftcard/giftcardtype/giftCardTypeApi";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { GiftCardTypeForm } from "./GiftCardTypeForm";
import { Form } from "antd";

export const GiftCardTypeCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createGiftCardType, { isLoading }] = useCreateGiftCardTypeMutation();

  const handleSubmit = async (values) => {
    //console.log(values);
    const { data, error } = await createGiftCardType({
      data: values,
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
    <CustomDrawer title={"Create Gift Card Type"} open={isCreateDrawerOpen}>
      <GiftCardTypeForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};
