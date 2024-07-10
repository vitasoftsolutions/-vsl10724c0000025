import { Button, Form } from "antd";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CustomQuantityInput } from "../../../components/Shared/Input/CustomQuantityInput";
import { ProductController } from "../../../components/Shared/ProductControllerComponent/ProductController";
import {
  decrementCounter,
  incrementCounter,
  onDelete,
  onQuantityChange,
} from "../../../utilities/lib/productTable/counters";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (name) => (
      <div className={`flex items-center gap-2 `}>
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {name}
        </span>
      </div>
    ),
  },
  {
    title: "SKU",
    dataIndex: "sku",
    key: "sku",
    align: "center",
    width: 100,
    render: (sku) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {sku}
      </span>
    ),
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    align: "center",
    width: 140,
    render: (quantity, record) => {
      return quantity > -1 ? (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {quantity}
        </span>
      ) : (
        <div className="flex gap-1 justify-center items-center">
          <div>
            <Button
              key={"sub"}
              icon={<FaMinus />}
              type="primary"
              onClick={() =>
                record.decrementCounter(record?.id, record.setFormValues)
              }
            />
          </div>
          <CustomQuantityInput
            // name={["product_list", "qty", record?.id]}
            noStyle={true}
            onChange={(value) =>
              record.onQuantityChange(record.id, value, record.setFormValues)
            }
            value={record.formValues.product_list.qty[record.id]}
          />
          <div>
            <Button
              key={"add"}
              icon={<FaPlus />}
              type="primary"
              onClick={() =>
                record.incrementCounter(record?.id, record.setFormValues)
              }
              className=""
            />
          </div>
        </div>
      );
    },
  },

  {
    title: <MdDelete className="text-lg md:text-xl text-center w-full" />,
    dataIndex: "delete",
    key: "delete",
    align: "center",
    width: 50,
    fixed: "right",
    render: (props, record) => {
      return (
        props && (
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => record.onDelete(record.id)}
              className="primary-bg p-1 rounded-xl text-white hover:scale-110 duration-300"
              type="button"
            >
              <MdDelete className="text-lg md:text-xl" />
            </button>
          </div>
        )
      );
    },
  },
];

const ProductSelect = ({
  formValues,
  setFormValues,
  products,
  setProducts,
}) => {
  const form = Form.useFormInstance();

  // const incrementCounter = (id) => {
  //   setFormValues((prevFormValues) => {
  //     const currentQty = prevFormValues.product_list.qty[id] || 1;
  //     const newQty = Number(currentQty) + 1;

  //     return {
  //       ...prevFormValues,
  //       product_list: {
  //         ...prevFormValues.product_list,
  //         qty: {
  //           ...prevFormValues.product_list.qty,
  //           [id]: newQty,
  //         },
  //       },
  //     };
  //   });
  // };

  // const decrementCounter = (id) => {
  //   setFormValues((prevFormValues) => {
  //     const currentQty = prevFormValues.product_list.qty[id] || 1;
  //     const newQty = Math.max(Number(currentQty) - 1, 0);

  //     return {
  //       ...prevFormValues,
  //       product_list: {
  //         ...prevFormValues.product_list,
  //         qty: {
  //           ...prevFormValues.product_list.qty,
  //           [id]: newQty,
  //         },
  //       },
  //     };
  //   });
  // };

  // const onQuantityChange = (id, value) => {
  //   setFormValues((prevFormValues) => ({
  //     ...prevFormValues,
  //     product_list: {
  //       ...prevFormValues.product_list,
  //       qty: {
  //         ...prevFormValues.product_list.qty,
  //         [id]: parseInt(value, 10) || 0,
  //       },
  //     },
  //   }));
  // };

  // const onDelete = (id) => {
  //   setProducts((prevProducts) =>
  //     prevProducts.filter((product) => product.id !== id)
  //   );
  // };

  const dataSource =
    products?.map((product) => {
      const { id, name, sku } = product;

      formValues.product_list.qty[id] = formValues.product_list.qty[id] ?? 1;

      return {
        id,
        name,
        sku,
        delete: true,
        incrementCounter,
        decrementCounter,
        onQuantityChange,
        onDelete,
        products,
        setProducts,
        formValues,
        setFormValues,
      };
    }) ?? [];

  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const sanitizeValue = (value) => {
      const number = parseFloat(value);
      return isNaN(number) ? 0 : number;
    };

    if (products?.length > 0) {
      const total = Object.values(formValues.product_list.qty).reduce(
        (acc, cur) => acc + sanitizeValue(cur),
        0
      );
      setTotalQuantity(total);
    }
  }, [formValues, products]);

  products?.length > 0 &&
    dataSource.push({
      id: "",
      name: "Total",
      quantity: totalQuantity,
    });

  form?.setFieldsValue(formValues);

  return (
    <ProductController
      products={products}
      setProducts={setProducts}
      columns={columns}
      dataSource={dataSource}
      styleProps={{
        width: "100%",
        scroll: {
          x: "min-content",
        },
      }}
    />
  );
};

export default ProductSelect;
