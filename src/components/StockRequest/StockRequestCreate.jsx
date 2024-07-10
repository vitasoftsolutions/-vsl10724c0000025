import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateStockCountMutation } from "../../redux/services/stockCount/stockCountApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { StockRequestForm } from "./StockRequestForm";

const StockRequestCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);

  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createStockCount, { isLoading }] = useCreateStockCountMutation();

  const [formValues, setFormValues] = useState({
    product_list: { qty: {} },
  });

  const [products, setProducts] = useState([]);

  const handleSubmit = async (values) => {
    const { warehouse_id, note } = values;

    const { product_list } = formValues;

    const formData = new FormData();

    const productListArray = product_list?.qty
      ? Object.keys(product_list.qty)
          .filter((product_id) => product_list.qty[product_id] !== undefined)
          .map((product_id) => ({
            product_id: parseInt(product_id),
            qty: product_list.qty[product_id],
          }))
      : [];

    const postObj = {
      warehouse_id: parseInt(warehouse_id),
      product_list: JSON.stringify(productListArray),
      note,
    };
    appendToFormData(postObj, formData);

    console.log(values);

    // const { data, error } = await createStockCount({
    //   data: formData,
    // });

    // if (data?.success) {
    //   dispatch(closeCreateDrawer());
    //   form.resetFields();
    // }
    // if (error) {
    //   const errorFields = Object.keys(error?.data?.errors).map((fieldName) => ({
    //     name: fieldName,

    //     errors: error?.data?.errors[fieldName],
    //   }));
    //   setErrorFields(errorFields);
    // }
  };

  return (
    <CustomDrawer
      title={"Create Stock Request"}
      open={isCreateDrawerOpen}
      width={1400}
    >
      <StockRequestForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
        formValues={formValues}
        setFormValues={setFormValues}
        products={products}
        setProducts={setProducts}
      />
    </CustomDrawer>
  );
};

export default StockRequestCreate;
