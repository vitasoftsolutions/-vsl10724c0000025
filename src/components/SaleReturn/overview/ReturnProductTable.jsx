import { Button } from "antd";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useCurrency } from "../../../redux/services/pos/posSlice";
import { calculateOriginalPrice } from "../../../utilities/lib/calculatePrice";
import { showCurrency } from "../../../utilities/lib/currency";
import { openNotification } from "../../../utilities/lib/openToaster";
import { onDelete } from "../../../utilities/lib/productTable/counters";
import { setFormValuesId } from "../../../utilities/lib/updateFormValues/updateFormValues";
import CustomCheckbox from "../../Shared/Checkbox/CustomCheckbox";
import { CustomQuantityInput } from "../../Shared/Input/CustomQuantityInput";
import { ProductTable } from "../../Shared/ProductControllerComponent/ProductTable";

const columns = [
  {
    title: "Choose",
    dataIndex: "delete",
    key: "delete",
    align: "center",
    width: 80,
    fixed: "left",
    render: (props, record) => {
      return (
        props && (
          <div className="flex justify-center items-center gap-3 pl-9">
            <CustomCheckbox value={record?.id} name={["delete", record?.id]} />
          </div>
        )
      );
    },
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    align: "center",
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
    title: "Unit Cost",
    dataIndex: "unitCost",
    key: "unitCost",
    align: "center",
    width: 100,
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
              onClick={() => record.decrementCounter(record?.id)}
            />
          </div>
          <CustomQuantityInput
            name={["product_list", "qty", record?.id]}
            // value={record?.qty}
            noStyle={true}
            onChange={(value) => record.onQuantityChange(record.id, value)}
          />
          <div>
            <Button
              key={"add"}
              icon={<FaPlus />}
              type="primary"
              onClick={() => record.incrementCounter(record?.id)}
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
];

export const ReturnProductTable = ({
  formValues,
  setFormValues,
  products,
  setProducts,
  productUnits,
  form,
}) => {
  const incrementCounter = (id) => {
    setFormValues((prevFormValues) => {
      const currentQty = prevFormValues.product_list.qty[id] || 1;

      if (currentQty === parseInt(formValues?.product_list?.max_return?.[id])) {
        // message.error("Maximum quantity reached");

        return openNotification("info", "Maximum quantity reached");
      }
      const newQty = Math.min(
        Number(currentQty) + 1,
        parseInt(formValues?.product_list?.max_return?.[id])
      );

      return {
        ...prevFormValues,
        product_list: {
          ...prevFormValues.product_list,
          qty: {
            ...prevFormValues.product_list.qty,
            [id]: newQty,
          },
        },
      };
    });
  };

  const decrementCounter = (id) => {
    setFormValues((prevFormValues) => {
      const currentQty = prevFormValues.product_list.qty[id] || 1;
      const newQty = Math.min(
        Number(currentQty) - 1,
        parseInt(formValues?.product_list?.max_return?.[id])
      );

      return {
        ...prevFormValues,
        product_list: {
          ...prevFormValues.product_list,
          qty: {
            ...prevFormValues.product_list.qty,
            [id]: newQty,
          },
        },
      };
    });
  };

  const onQuantityChange = (id, value) => {
    const qty = Math.min(
      parseInt(value),
      parseInt(formValues?.product_list?.max_return?.[id])
    );

    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      product_list: {
        ...prevFormValues.product_list,
        qty: {
          ...prevFormValues.product_list.qty,
          [id]: qty || 0,
        },
      },
    }));
  };

  const currency = useSelector(useCurrency);

  const dataSource = products?.map((product) => {
    const {
      id,
      name,
      sku,
      buying_price: unit_cost,
      sale_unit_id,
      sale_units,
      taxes,
      tax_method,
    } = product ?? {};

    setFormValuesId(
      id,
      sale_unit_id,
      calculateOriginalPrice(unit_cost, taxes?.rate, tax_method),
      sale_units,
      formValues,
      productUnits,
      taxes,
      tax_method
    );

    return {
      id,
      name,
      sku,
      unitCost: showCurrency(
        formValues.product_list.net_unit_price[id],
        currency
      ),
      delete: true,
      discount: showCurrency(formValues.product_list.discount[id], currency),
      tax: showCurrency(formValues.product_list.tax[id], currency),
      subTotal: showCurrency(formValues.product_list.total[id], currency),
      qty: formValues.product_list.qty[id],
      incrementCounter,
      decrementCounter,
      onQuantityChange,
      onDelete,
      products,
      setProducts,
      formValues,
      setFormValues,
    };
  });

  form.setFieldsValue(formValues);

  return <ProductTable columns={columns} dataSource={dataSource} />;
};
