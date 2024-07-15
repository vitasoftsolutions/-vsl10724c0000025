import { Button, Form, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { useCurrency } from "../../redux/services/pos/posSlice";
import { showCurrency } from "../../utilities/lib/currency";
import {
  decrementCounter,
  incrementCounter,
  onDelete,
  onQuantityChange,
} from "../../utilities/lib/productTable/counters";
import { CustomQuantityInput } from "../Shared/Input/CustomQuantityInput";
import { ProductController } from "../Shared/ProductControllerComponent/ProductController";
import { getWarehouseQuantity } from "../../utilities/lib/getWarehouseQty";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    // width: 400,
    render: (name) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {name}
      </span>
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
    title: "Minimum Qunatity",
    dataIndex: "minQty",
    key: "minQty",
    align: "center",
    width: 100,
    render: (minQty) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {minQty}
      </span>
    ),
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
    align: "center",
    width: 100,
    render: (stock, record) =>
      stock > record.minQty ? (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {stock}
        </span>
      ) : (
        <span className="text-xs font-medium md:text-sm text-red-600  dark:text-white87">
          {stock}
        </span>
      ),
  },
  {
    title: "Unit Cost",
    dataIndex: "unitCost",
    key: "unitCost",
    align: "center",
    width: 100,
    render: (unitCost) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {unitCost}
      </span>
    ),
  },

  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    align: "center",
    width: 200,
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
            value={record?.formValues.product_list.qty?.[record?.id] ?? 0}
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
              onClick={() =>
                record.onDelete(
                  record.id,
                  record.setProducts,
                  record.setFormValues
                )
              }
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

export const RequestProductTable = ({
  formValues,
  setFormValues,
  products,
  setProducts,
}) => {
  const form = Form.useFormInstance();
  const warehouseId = Form.useWatch("from_warehouse_id", form);

  const currency = useSelector(useCurrency);

  const dataSource =
    products?.map((product) => {
      const {
        id,
        name,
        sku,
        buying_price: unit_cost,
        product_qties,
        alert_qty,
      } = product ?? {};

      formValues.product_list.qty[id] = formValues.product_list.qty[id] ?? 1;
      formValues.product_list.min_qty[id] =
        formValues.product_list.min_qty[id] ?? alert_qty;
      console.log(product);

      const stock = getWarehouseQuantity(product_qties, warehouseId);

      return {
        id,
        name,
        sku,
        unitCost: showCurrency(unit_cost, currency),
        action: true,
        delete: true,
        minQty: alert_qty,
        stock,
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
    const total = Object.values(formValues.product_list.qty).reduce(
      (acc, cur) => acc + cur,
      0
    );
    setTotalQuantity(total);
  }, [formValues, products]);

  // products.length > 0 &&
  //   dataSource.push({
  //     id: "",
  //     name: "Total",
  //     unitCost: "",
  //     quantity: totalQuantity,
  //     action: false,
  //   });

  form.setFieldsValue(formValues);

  const tableStyle = {
    summary: () => {
      return (
        <Table.Summary fixed="bottom">
          <Table.Summary.Row>
            <Table.Summary.Cell index={1} colSpan={5}>
              <Typography.Text className="font-bold" type="">
                Total
              </Typography.Text>
            </Table.Summary.Cell>

            <Table.Summary.Cell index={2} align="center">
              <Typography.Text type="" className="font-bold">
                {totalQuantity}
              </Typography.Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      );
    },
  };

  return (
    <ProductController
      products={products}
      setProducts={setProducts}
      columns={columns}
      dataSource={dataSource}
      tableStyle={tableStyle}
    />
  );
};
