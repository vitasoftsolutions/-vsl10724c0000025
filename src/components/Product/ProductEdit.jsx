import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../redux/services/product/productApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import { fieldsToUpdate } from "../../utilities/lib/fieldsToUpdate";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import ProductForm from "./ProductForm";

const ProductListEdit = ({ id }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);
  const { data, isFetching } = useGetProductDetailsQuery(
    {
      id,
      params: {
        parent: 1,
        child: 1,
      },
    },
    { skip: !id || !isEditDrawerOpen }
  );
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const [formValues, setFormValues] = useState({
    product_list: {
      qty: {},
      amount: {},
    },
    qty_list: {
      qty: {},
    },
    price_list: {
      price: {},
    },
  });

  const [products, setProducts] = useState([]);
  const [initialWarehouses, setInitialWarehouses] = useState([]);
  const [priceWarehouses, setPriceWarehouses] = useState([]);

  useEffect(() => {
    if (!isEditDrawerOpen) {
      setFormValues({
        product_list: {
          qty: {},
          amount: {},
        },
        qty_list: {
          qty: {},
        },
        price_list: {
          price: {},
        },
      });

      setProducts([]);

      setInitialWarehouses([]);

      setPriceWarehouses([]);
    }
  }, [isEditDrawerOpen]);

  const updateStateWithProductData = ({
    product_prices,
    product_qties,
    product_combos,
  }) => {
    // Update state with product prices
    product_prices.forEach((item) => {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        price_list: {
          ...prevFormValues.price_list,
          price: {
            ...prevFormValues.price_list.price,
            [item.warehouse_id.toString()]: item.price,
          },
        },
      }));
    });

    // Update state with product quantities
    product_qties.forEach((item) => {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        qty_list: {
          ...prevFormValues.qty_list,
          qty: {
            ...prevFormValues.qty_list.qty,
            [item.warehouse_id.toString()]: item.qty,
          },
        },
      }));
    });

    product_combos.forEach((item) => {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        product_list: {
          ...prevFormValues.product_list,
          qty: {
            ...prevFormValues.product_list.qty,
            [item.combo_product_id.toString()]: item.qty,
          },
          amount: {
            ...prevFormValues.product_list.amount,
            [item.combo_product_id.toString()]: item.price,
          },
        },
      }));
    });
  };

  useEffect(() => {
    if (data && isEditDrawerOpen) {
      const {
        name,
        sku,
        type,
        symbology,
        brand_id,
        category_id,
        unit_id,
        purchase_unit_id,
        sale_unit_id,
        buying_price,
        selling_price,
        alert_qty,
        daily_sale_qty,
        tax_method,
        tax_id,
        has_promotion,
        promotion_price,
        starting_date,
        last_date,
        has_different_price,
        has_expired_date,
        expired_date,
        // has_featured,
        // embedded_barcode,
        // ecommerce_sync,
        details,
        has_stock,
        attachments,
      } = data;

      //console.log(data);

      const fieldData = fieldsToUpdate({
        name,
        sku,
        type,
        symbology,
        brand_id: brand_id?.toString(),
        category_id: category_id?.toString(),
        unit_id: unit_id?.toString(),
        purchase_unit_id: purchase_unit_id?.toString(),
        sale_unit_id: sale_unit_id?.toString(),
        buying_price,
        selling_price,
        alert_qty,
        daily_sale_qty,
        tax_method,
        tax_id,
        attachments,
        details,
      });

      updateStateWithProductData({
        product_prices: data?.product_prices,
        product_qties: data?.product_qties,
        product_combos: data?.product_combos,
      });

      data?.product_prices?.forEach((item) => {
        setPriceWarehouses((prevWarehouses) => [
          ...prevWarehouses,
          {
            id: item.warehouse_id,
            name: item?.warehouses?.name ?? "need backend relation",
          },
        ]);
      });

      data?.product_qties?.forEach((item) => {
        setInitialWarehouses((prevWarehouses) => [
          ...prevWarehouses,
          {
            id: item.warehouse_id,
            name: item?.warehouses?.name ?? "need backend relation",
          },
        ]);
      });

      data?.product_combos?.forEach((item) => {
        setProducts((prevProducts) => [
          ...prevProducts,
          {
            id: item?.combo_product_id,
            name: item?.products?.name ?? "need backend relation",
            sku: item?.products?.sku ?? "need backend relation",
          },
        ]);
      });

      const newFieldData = [
        ...fieldData,
        {
          name: "has_stock",
          value: has_stock.toString() === "1" ? true : false,
          errors: "",
        },
        {
          name: "has_different_price",
          value: has_different_price.toString() === "1" ? true : false,
          errors: "",
        },
        {
          name: "has_promotion",
          value: has_promotion.toString() === "1" ? true : false,
          errors: "",
        },
        {
          name: ["promotion", "promotion_price"],
          value: promotion_price,
          errors: "",
        },
        {
          name: ["promotion", "starting_date"],
          value:
            has_promotion.toString() === "1"
              ? dayjs(starting_date, "YYYY-MM-DD")
              : "",
          errors: "",
        },
        {
          name: ["promotion", "last_date"],
          value:
            has_promotion.toString() === "1"
              ? dayjs(last_date, "YYYY-MM-DD")
              : "",
          errors: "",
        },
        {
          name: "has_expired_date",
          value: has_expired_date.toString() === "1" ? true : false,
          errors: "",
        },
        {
          name: ["product_expire", "expired_date"],
          value:
            has_expired_date.toString() === "1"
              ? dayjs(expired_date, "YYYY-MM-DD")
              : "",
          errors: "",
        },
        // {
        //   name: "ecommerce_sync",
        //   value: ecommerce_sync === "1" ? true : false,
        //   errors: "",
        // },
        // {
        //   name: "has_featured",
        //   value: has_featured === "1" ? true : false,
        //   errors: "",
        // },
        // {
        //   name: "embedded_barcode",
        //   value: embedded_barcode === "1" ? true : false,
        //   errors: "",
        // },
      ];

      setFields(newFieldData);
    }
  }, [data, isEditDrawerOpen, setFields]);

  //console.log(formValues);

  const handleUpdate = async (values) => {
    const {
      name,
      type,
      sku,
      // qty_list,
      // price_list,
      // product_list,
      symbology,
      brand_id,
      category_id,
      unit_id,
      purchase_unit_id,
      sale_unit_id,
      buying_price,
      selling_price,
      alert_qty,
      daily_sale_qty,
      tax_method,
      tax_id,
      // has_featured,
      has_stock,
      has_variant,
      // embedded_barcode,
      has_promotion,
      promotion,
      has_different_price,
      has_expired_date,
      product_expire,
      // ecommerce_sync,
      details,
    } = values ?? {};

    const { qty_list, price_list, product_list } = formValues;

    //console.log(qty_list, price_list);

    const qtyListArray = has_stock
      ? Object.keys(qty_list?.qty || {}).map((warehouseId) => {
          return {
            warehouse_id: warehouseId,
            qty: qty_list?.qty?.[warehouseId],
          };
        })
      : [];

    const qty = qtyListArray.reduce(
      (sum, item) => parseInt(sum) + parseInt(item.qty),
      0
    );

    //console.log(has_different_price);

    const priceListArray = has_different_price
      ? Object.keys(price_list?.price || {}).map((warehouseId) => {
          return {
            warehouse_id: warehouseId,
            price: price_list?.price?.[warehouseId],
          };
        })
      : [];

    const productListArray = Object.keys(product_list?.qty || {})?.map(
      (product_id) => {
        return {
          combo_product_id: parseInt(product_id),
          qty: product_list?.qty?.[product_id],
          price: product_list?.amount?.[product_id],
        };
      }
    );

    const formData = new FormData();

    const postObj = {
      name,
      sku,
      type,
      symbology,
      brand_id: parseInt(brand_id),
      category_id: parseInt(category_id),
      unit_id: parseInt(unit_id),
      purchase_unit_id: parseInt(purchase_unit_id),
      sale_unit_id: parseInt(sale_unit_id),
      buying_price: parseInt(buying_price),
      selling_price: parseInt(selling_price),
      profit: parseInt(Number(selling_price) - Number(buying_price)),
      qty: qty,
      alert_qty,
      daily_sale_qty,
      tax_method,
      tax_id,
      has_stock: has_stock ? 1 : 0,
      qty_list: has_stock && JSON.stringify(qtyListArray),
      has_variant: has_variant ? 1 : 0,
      has_promotion: has_promotion ? 1 : 0,

      has_different_price: has_different_price ? 1 : 0,
      price_list: has_different_price && JSON.stringify(priceListArray),
      product_list: JSON.stringify(productListArray),
      has_expired_date: has_expired_date ? 1 : 0,
      details,

      _method: "PUT",
    };

    if (
      values.attachments?.[0]?.originFileObj &&
      values?.attachments.length > 0
    ) {
      postObj.attachments = values.attachments?.map(
        (file) => file?.originFileObj
      );
    }

    if (values?.attach_file?.[0].url) {
      postObj.attach_file = values.attach_file?.[0].originFileObj;
    }

    if (values?.has_expired_date) {
      postObj.expired_date = product_expire?.expired_date;
    }

    if (has_promotion) {
      postObj.promotion_price = promotion?.promotion_price;
      postObj.starting_date = promotion && promotion?.starting_date;
      postObj.last_date = promotion && promotion?.last_date;
    }

    appendToFormData(postObj, formData);

    const { data, error } = await updateProduct({ id, formData });

    if (data?.success) {
      dispatch(closeEditDrawer());
    }

    if (error) {
      const errorFields = errorFieldsUpdate(fields, error);

      setFields(errorFields);
    }
  };

  //console.log(products);

  return (
    <CustomDrawer
      title={"Edit Product"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
      width={1400}
    >
      <ProductForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
        formValues={formValues}
        setFormValues={setFormValues}
        products={products}
        setProducts={setProducts}
        initialWarehouses={initialWarehouses}
        setInitialWarehouses={setInitialWarehouses}
        priceWarehouses={priceWarehouses}
        setPriceWarehouses={setPriceWarehouses}
      />
    </CustomDrawer>
  );
};

export default ProductListEdit;
