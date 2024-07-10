import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useGetStockCountDetailsQuery,
  useUpdateStockCountMutation,
} from "../../redux/services/stockCount/stockCountApi";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import { fieldsToUpdate } from "../../utilities/lib/fieldsToUpdate";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import StockCountForm from "./StockCountForm";

const StockCountEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetStockCountDetailsQuery(
    { id },
    { skip: !id }
  );

  const [updateStockCount, { isLoading }] = useUpdateStockCountMutation();

  useEffect(() => {
    if (data) {
      const fieldData = fieldsToUpdate(data);
      // const fieldData = [
      //   {
      //     name: "name",
      //     value: data?.name,
      //     errors: "",
      //   },
      // ];

      setFields(fieldData);
    }
  }, [data, setFields]);

  const handleUpdate = async (values) => {
    const { data, error } = await updateStockCount({
      id,
      data: { ...values, _method: "PUT" },
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
      title={"Edit Stock Count"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <StockCountForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
      />
    </CustomDrawer>
  );
};

export default StockCountEdit;
