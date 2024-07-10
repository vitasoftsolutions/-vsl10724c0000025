import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateStockCountMutation } from "../../redux/services/stockCount/stockCountApi";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import StockCountForm from "./StockCountForm";

const StockCountCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);

  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createStockCount, { isLoading }] = useCreateStockCountMutation();

  const handleSubmit = async (values) => {
    //console.log(values);
    const { data, error } = await createStockCount({
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
    <CustomDrawer title={"Create Stock Count"} open={isCreateDrawerOpen}>
      <StockCountForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default StockCountCreate;
