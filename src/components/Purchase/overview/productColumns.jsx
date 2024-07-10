import { Button } from "antd";
import { FaEdit, FaMinus, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CustomQuantityInput } from "../../Shared/Input/CustomQuantityInput";

const baseColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (name, record) => (
      <div
        className={`flex items-center gap-2 ${
          name !== "Total" && "hover:underline hover:cursor-pointer"
        }`}
        onClick={() => {
          record?.handleProductEdit(record?.id, record?.name);
        }}
      >
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {name}
        </span>
        {name !== "Total" && <FaEdit className="primary-text" />}
      </div>
    ),
  },
  {
    title: "SKU",
    dataIndex: "sku",
    key: "sku",
    align: "center",
    width: 80,
    render: (sku) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {sku}
      </span>
    ),
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
    align: "center",
    width: 60,
    render: (stock) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {stock}
      </span>
    ),
  },
  {
    title: "Unit Cost",
    dataIndex: "unitCost",
    key: "unitCost",
    align: "center",
    width: 120,
    render: (unitCost) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {unitCost ?? 0}
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
                record.decrementCounter(
                  record?.id,
                  record.setFormValues,
                  record.stock
                )
              }
            />
          </div>
          <CustomQuantityInput
            noStyle={true}
            onChange={(value) =>
              record.onQuantityChange(
                record.id,
                value,
                record.setFormValues,
                record.stock
              )
            }
            value={record?.formValues.product_list.qty?.[record?.id] ?? 0}
          />
          <div>
            <Button
              key={"add"}
              icon={<FaPlus />}
              type="primary"
              onClick={() =>
                record.incrementCounter(
                  record?.id,
                  record.setFormValues,
                  record.stock
                )
              }
              className=""
            />
          </div>
        </div>
      );
    },
  },
];

export const columns = [
  ...baseColumns,
  {
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
    align: "center",
    width: 120,
    render: (discount) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {discount}
      </span>
    ),
  },
  {
    title: "Tax",
    dataIndex: "tax",
    key: "tax",
    align: "center",
    width: 120,
    render: (tax) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {tax}
      </span>
    ),
  },
  {
    title: "SubTotal",
    dataIndex: "subTotal",
    key: "subTotal",
    align: "center",
    width: 120,
    render: (subTotal) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {subTotal}
      </span>
    ),
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

export const partialColumns = [
  ...baseColumns,
  {
    title: "Received",
    dataIndex: "received",
    key: "received",
    align: "center",
    width: 140,
    render: (received, record) => {
      return received > -1 ? (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {received}
        </span>
      ) : (
        <div className="flex gap-1 justify-center items-center">
          <div>
            <Button
              key={"sub"}
              icon={<FaMinus />}
              type="primary"
              onClick={() => record.decrementReceivedCounter(record?.id)}
            />
          </div>
          <CustomQuantityInput
            name={["product_list", "recieved", record?.id]}
            noStyle={true}
            onChange={(value) => record.onReceivedChange(record.id, value)}
          />
          <div>
            <Button
              key={"add"}
              icon={<FaPlus />}
              type="primary"
              onClick={() => record.incrementReceivedCounter(record?.id)}
              className=""
            />
          </div>
        </div>
      );
    },
  },
  {
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
    align: "center",
    width: 100,
    render: (discount) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        ${discount}
      </span>
    ),
  },
  {
    title: "Tax",
    dataIndex: "tax",
    key: "tax",
    align: "center",
    width: 100,
    render: (tax) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        ${tax}
      </span>
    ),
  },
  {
    title: "SubTotal",
    dataIndex: "subTotal",
    key: "subTotal",
    align: "center",
    width: 100,
    render: (subTotal) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        ${subTotal}
      </span>
    ),
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
