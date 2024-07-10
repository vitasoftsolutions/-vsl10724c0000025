import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultUser from "../../assets/data/defaultUserImage";
import {
  useGetAdjustmentDetailsQuery,
  useUpdateAdjustmentMutation,
} from "../../redux/services/adjustment/adjustmentApi";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import AdjustmentForm from "./AdjustmentForm";

const AdjustmentEdit = ({ id }) => {
  const dispatch = useDispatch();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetAdjustmentDetailsQuery(
    { id, params: { child: 1 } },
    { skip: !id }
  );

  const [udpateAdjustment, { isLoading }] = useUpdateAdjustmentMutation();

  const [formValues, setFormValues] = useState({
    product_list: {
      qty: {},
      action: {},
    },
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!isEditDrawerOpen) {
      setFormValues({
        product_list: {
          qty: {},
          action: {},
        },
      });
      setProducts([]);
    }
  }, [isEditDrawerOpen]);

  useEffect(() => {
    if (data && isEditDrawerOpen) {
      data?.adjustment_products?.forEach((item) => {
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          product_list: {
            ...prevFormValues.product_list,
            qty: {
              ...prevFormValues.product_list.qty,
              [item?.product_id.toString()]: item?.qty,
            },
            action: {
              ...prevFormValues.product_list.action,
              [item?.product_id.toString()]: item?.action,
            },
          },
        }));

        setProducts((prevProducts) => [
          ...prevProducts,
          {
            id: item?.product_id,
            sku: item?.products?.sku,
            name: item?.products?.name,
            qty: item?.qty,
            action: item?.action,

            buying_price: item?.products?.buying_price,
          },
        ]);
      });

      const fieldData = [
        {
          name: "warehouse_id",
          value: data?.warehouse_id,
          errors: "",
        },
        data?.attachments?.length > 0
          ? {
              name: "attachment",
              value: [
                {
                  url: data?.attachments?.[0]?.url,
                },
              ],
              errors: "",
            }
          : {
              name: "attachment",
              value: [
                {
                  url: defaultUser,
                },
              ],
              errors: "",
            },
        {
          name: "note",
          value: data?.note,
          errors: "",
        },
      ];

      setFields(fieldData);
    }
  }, [data, isEditDrawerOpen, setFields]);

  const handleUpdate = async (values) => {
    const { attachment, note, warehouse_id } = values;
    const { product_list } = formValues;

    const formData = new FormData();

    const productListArray = product_list?.qty
      ? Object.keys(product_list.qty)
          .filter((product_id) => product_list.qty[product_id] !== undefined)
          .map((product_id) => {
            return {
              product_id: parseInt(product_id),
              qty: product_list.qty[product_id],
              action: product_list.action[product_id],
            };
          })
      : [];

    const postObj = {
      warehouse_id: parseInt(warehouse_id),
      product_list: JSON.stringify(productListArray),
      note,
      _method: "PUT",
    };

    if (attachment?.length > 0) {
      postObj.attachment = attachment?.[0]?.originFileObj;
    }

    appendToFormData(postObj, formData);

    const { data, error } = await udpateAdjustment({ id, formData });

    if (data?.success) {
      dispatch(closeEditDrawer());
      setFormValues({ product_list: { qty: {}, action: {} } });
      setProducts([]);
    }

    if (error) {
      const errorFields = errorFieldsUpdate(fields, error);
      setFields(errorFields);
    }
  };

  return (
    <CustomDrawer
      title={"Edit Adjustment"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
      width={1400}
    >
      <AdjustmentForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        formValues={formValues}
        setFormValues={setFormValues}
        products={products}
        setProducts={setProducts}
      />
    </CustomDrawer>
  );
};

export default AdjustmentEdit;
