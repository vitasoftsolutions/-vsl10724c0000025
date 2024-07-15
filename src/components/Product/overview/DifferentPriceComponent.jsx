import { Form } from "antd";
import { MdDelete } from "react-icons/md";
import CustomInput from "../../Shared/Input/CustomInput";
import { WarehouseController } from "../../WarehouseController/WarehouseController";

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
    title: "Price",
    dataIndex: "unitPrice",
    key: "unitPrice",
    align: "center",
    width: 140,
    render: (unitPrice, record) => {
      return unitPrice > -1 ? (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {unitPrice}
        </span>
      ) : (
        <CustomInput
          type={"number"}
          name={["price_list", "price", record?.id]}
          placeholder="quantity"
          noStyle={true}
          onChange={(value) => record.onUnitPriceChange(record.id, value)}
        />
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

export const DifferentPriceComponent = ({
  formValues,
  setFormValues,
  priceWarehouses,
  setPriceWarehouses,
}) => {
  const form = Form.useFormInstance();
  const hasDifferentPrice = Form.useWatch("has_different_price", form);

  const incrementCounter = (id, stock = 5) => {
    setFormValues((prevFormValues) => {
      const currentQty = prevFormValues.price_list.price[id] || 1;
      const newQty = Math.min(currentQty + 1, stock);

      return {
        ...prevFormValues,
        price_list: {
          ...prevFormValues.price_list,
          price: {
            ...prevFormValues.price_list.price,
            [id]: newQty,
          },
        },
      };
    });
  };

  const decrementCounter = (id) => {
    setFormValues((prevFormValues) => {
      const currentQty = prevFormValues.price_list.price[id] || 1;
      const newQty = Math.max(currentQty - 1, 0);

      return {
        ...prevFormValues,
        price_list: {
          ...prevFormValues.price_list,
          price: {
            ...prevFormValues.price_list.price,
            [id]: newQty,
          },
        },
      };
    });
  };

  const onUnitPriceChange = (id, value) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      price_list: {
        ...prevFormValues.price_list,
        price: {
          ...prevFormValues.price_list.price,
          [id]: parseInt(value, 10) || 0,
        },
      },
    }));
  };

  const onDelete = (id) => {
    setPriceWarehouses((prevWarehouse) =>
      prevWarehouse.filter((warehouse) => warehouse.id !== id)
    );
  };

  //console.log(priceWarehouses);

  const dataSource =
    priceWarehouses?.map((warehouse) => {
      //console.log(warehouse);

      const { id, name } = warehouse;

      formValues.price_list.price[id] = formValues.price_list.price[id] ?? 0;

      return {
        id,
        name,
        delete: true,
        incrementCounter,
        decrementCounter,
        onUnitPriceChange,
        onDelete,
      };
    }) ?? [];

  form.setFieldsValue(formValues);

  return (
    hasDifferentPrice && (
      <WarehouseController
        warehouses={priceWarehouses}
        setWarehouses={setPriceWarehouses}
        columns={columns}
        dataSource={dataSource}
      />
    )
  );
};
