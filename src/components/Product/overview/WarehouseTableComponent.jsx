/* eslint-disable react-hooks/exhaustive-deps */
import { Form } from "antd";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import CustomInput from "../../Shared/Input/CustomInput";
import CustomTable from "../../Shared/Table/CustomTable";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    align: "center",
    width: 150,
    render: (name) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {name}
      </span>
    ),
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    align: "center",
    render: (price, record) => {
      return price >= 0 ? (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {price}
        </span>
      ) : (
        <CustomInput
          type={"number"}
          name={["price_list", "price", record?.id]}
          placeholder="quantity"
          noStyle={true}
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
      const { setRowId } = props ?? {};
      return (
        props && (
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => setRowId(record?.id)}
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

const WarehouseTableComponent = () => {
  const form = Form.useFormInstance();
  const warehouse = Form.useWatch("warehouse_id", form);

  const [rowId, setRowId] = useState(undefined);

  // useEffect(() => {
  //   if (warehouse?.length > 0) {
  //     if (rowId !== undefined) {
  //       const selectedProduct = warehouse[rowId];

  //       form.setFieldValue(["price_list", "price", selectedProduct], 0);

  //       setRowId(undefined);
  //     } else if (warehouse?.length > 0 && warehouse) {
  //       const lastProductIndex = warehouse.length - 1;

  //       if (lastProductIndex >= 0) {
  //         const lastProduct = warehouse[lastProductIndex];

  //         form.setFieldValue(["price_list", "price", lastProduct], 0);
  //       }
  //     }
  //   }
  // }, [warehouse]);
  useEffect(() => {
    if (warehouse?.length > 0) {
      const setFormValuesIfNotExists = (productIndex) => {
        const selectedProduct = warehouse[productIndex];
        const pricePath = ["price_list", "price", selectedProduct];

        // Check if the value already exists
        const existingPrice = form.getFieldValue(pricePath);

        // Only set the values if they do not exist
        if (existingPrice === undefined) {
          form.setFieldValue(pricePath, 0);
        }
      };

      if (rowId !== undefined) {
        setFormValuesIfNotExists(rowId);
        setRowId(undefined);
      } else {
        const lastProductIndex = warehouse.length - 1;
        if (lastProductIndex >= 0) {
          setFormValuesIfNotExists(lastProductIndex);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warehouse]);

  useEffect(() => {
    if (rowId !== undefined) {
      const updatedProductData = warehouse?.filter((item) => item !== rowId);

      form.setFieldValue("warehouse_id", updatedProductData);
    }
  }, [rowId]);

  const dataSource = warehouse?.map((item) => {
    return {
      id: item,
      name: item,
      delete: {
        setRowId,
      },
    };
  });

  return (
    <CustomTable columns={columns} dataSource={dataSource} showPaging={false} />
  );
};

export default WarehouseTableComponent;
