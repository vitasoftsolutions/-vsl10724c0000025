import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetCouponDetailsQuery,
  useUpdateCouponMutation,
} from "../../redux/services/coupon/couponApi";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import { fieldsToUpdate } from "../../utilities/lib/fieldsToUpdate";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import CouponsForm from "./CouponsForm";

const CouponsEdit = ({ id, setId }) => {
  const dispatch = useDispatch();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetCouponDetailsQuery({ id }, { skip: !id });
  const [updateCoupon, { isLoading }] = useUpdateCouponMutation();

  useEffect(() => {
    if (data) {
      const fieldData = fieldsToUpdate(data);

      setFields(fieldData);
    }
  }, [data, setFields]);

  const handleUpdate = async (values) => {
    const { data, error } = await updateCoupon({
      id,
      data: {
        ...values,
        expired_date: values?.expired_date,
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
      title={"Edit Coupons"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <CouponsForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
      />
    </CustomDrawer>
  );
};

export default CouponsEdit;
