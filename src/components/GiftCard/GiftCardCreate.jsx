import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateGiftCardMutation } from "../../redux/services/giftcard/giftcard/giftCardApi";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import GiftCardForm from "./GiftCardForm";

const GiftCardCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createGiftCard, { isLoading }] = useCreateGiftCardMutation();

  const handleSubmit = async (values) => {
    //console.log(values);
    const { data, error } = await createGiftCard({
      data: {
        ...values,
        for_user: values?.for_user ? 1 : 0,
        expired_date: values?.expired_date,
      },
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
    <CustomDrawer title={"Create Gift Card"} open={isCreateDrawerOpen}>
      <GiftCardForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default GiftCardCreate;
