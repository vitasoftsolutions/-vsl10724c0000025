import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateCurrencyMutation } from "../../redux/services/currency/currencyApi";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import CurrencyForm from "./CurrencyForm";

const CurrencyCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);

  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createCurrency, { isLoading }] = useCreateCurrencyMutation();

  const handleSubmit = async (values) => {
    const { data, error } = await createCurrency({
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
    <CustomDrawer title={"Add Currency"} open={isCreateDrawerOpen}>
      <CurrencyForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default CurrencyCreate;
