import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateCouponMutation } from "../../redux/services/coupon/couponApi";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import CouponsForm from "./CouponsForm";

const CouponsCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const handleSubmit = async (values) => {
    const { data, error } = await createCoupon({
      data: {
        ...values,
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
    <CustomDrawer title={"Create Coupon"} open={isCreateDrawerOpen}>
      <CouponsForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default CouponsCreate;
