import { Button } from "antd";
import { FaEdit, FaMinus, FaPlus } from "react-icons/fa";
import { CustomQuantityInput } from "../../../Shared/Input/CustomQuantityInput";
import { MdDelete } from "react-icons/md";

export const columns = [
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
    width: 100,
    render: (sku) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {sku}
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
            value={record?.formValues?.product_list?.qty[record?.id] ?? 0}
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
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
    align: "center",
    width: 100,
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
    width: 100,
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
    width: 100,
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
