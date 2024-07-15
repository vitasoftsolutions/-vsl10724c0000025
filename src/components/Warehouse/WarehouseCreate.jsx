import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateWarehouseMutation } from "../../redux/services/warehouse/warehouseApi";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import WarehouseForm from "./WarehouseForm";

const WarehouseCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);

  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createWarehouse, { isLoading }] = useCreateWarehouseMutation();

  const handleSubmit = async (values) => {
    //console.log(values);
    const { data, error } = await createWarehouse({
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
    <CustomDrawer title={"Create Warehouse"} open={isCreateDrawerOpen}>
      <WarehouseForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default WarehouseCreate;
