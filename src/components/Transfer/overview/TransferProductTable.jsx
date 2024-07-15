import { Button, Col, Form, Modal, Row, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { FaEdit, FaMinus, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { colLayout, rowLayout } from "../../../layout/FormLayout";
import { useGetAllUnitQuery } from "../../../redux/services/unit/unitApi";
import CustomForm from "../../Shared/Form/CustomForm";
import CustomInput from "../../Shared/Input/CustomInput";
import { CustomQuantityInput } from "../../Shared/Input/CustomQuantityInput";
import { ProductController } from "../../Shared/ProductControllerComponent/ProductController";
import CustomSelect from "../../Shared/Select/CustomSelect";
import {
  decrementCounter,
  incrementCounter,
  onDelete,
  onQuantityChange,
} from "../../../utilities/lib/productTable/counters";
import { calculateTotals } from "../../../utilities/lib/calculateTotals";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../../utilities/hooks/useParams";
import { calculateOriginalPrice } from "../../../utilities/lib/calculatePrice";
import { useSelector } from "react-redux";
import { useCurrency } from "../../../redux/services/pos/posSlice";
import { showCurrency } from "../../../utilities/lib/currency";
import { getWarehouseQuantity } from "../../../utilities/lib/getWarehouseQty";

const columns = [
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
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
    align: "center",
    width: 100,
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
              record.onQuantityChange(
                record.id,
                value,
                record.setFormValues,
                record.stock
              )
            }
            value={record.formValues?.product_list?.qty?.[record?.id] || 0}
          />
          <div>
            <Button
              key={"add"}
              icon={<FaPlus />}
              type="primary"
              onClick={() =>
                record.incrementCounter(
                  record?.id,
                  record?.setFormValues,
                  record?.stock
                )
              }
              className=""
            />
          </div>
        </div>
      );
    },
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

const ProductUnitComponent = ({ setProductUnits, productId }) => {
  const params = useGlobalParams({
    selectValue: [...DEFAULT_SELECT_VALUES, "operation_value", "for"],
  });

  const { data, isLoading } = useGetAllUnitQuery({ params });

  const productUnits = data?.results?.unit
    ?.filter((unit) => unit.for === "purchase-unit")
    .map((unit) => ({
      value: unit.id.toString(),
      label: unit.name,
      operationValue: unit.operation_value,
    }));

  const onSelect = (value, option) => {
    setProductUnits((prevValues) => {
      return {
        ...prevValues,
        purchase_units: {
          [productId]: option.operationValue ?? 1,
        },
      };
    });
  };

  return (
    <CustomSelect
      label="Purchase Unit"
      options={productUnits}
      isLoading={isLoading}
      name={["purchase_unit_id", productId]}
      onSelect={onSelect}
    />
  );
};

const ProductFormComponent = ({
  productId,
  productName,
  productEditModal,
  hideModal,
  formValues,
  setFormValues,
  productUnits,
  setProductUnits,
}) => {
  const [productForm] = Form.useForm();

  useEffect(() => {
    if (productId) {
      productForm.setFieldsValue({
        quantity: formValues?.product_list?.qty[productId],
        unit_price: formValues?.product_list?.net_unit_cost[productId],
        purchase_unit_id: {
          [productId]:
            formValues?.product_list?.purchase_unit_id[productId]?.toString() ??
            "",
        },
        tax_id: {
          [productId]:
            formValues?.product_list?.tax_id[productId]?.toString() ?? "",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues, productForm, productId]);

  const handleSubmit = () => {
    setFormValues((prevFormValues) => {
      return {
        ...prevFormValues,
        product_list: {
          ...prevFormValues.product_list,
          qty: {
            ...prevFormValues.product_list.qty,
            [productId]: productForm.getFieldValue("quantity"),
          },
          purchase_unit_id: {
            ...prevFormValues.product_list.purchase_unit_id,
            [productId]: productForm.getFieldValue([
              "purchase_unit_id",
              productId,
            ]),
          },

          net_unit_cost: {
            ...prevFormValues.product_list.net_unit_cost,
            [productId]: productForm.getFieldValue("unit_price"),
          },
          tax_rate: {
            ...prevFormValues.product_list.tax_rate,
            [productId]: productUnits?.tax_rate[productId],
          },
          tax: {
            ...prevFormValues.product_list.tax,
            [productId]: parseFloat(
              (parseInt(productUnits.purchase_units[productId]) *
                parseFloat(productUnits.tax_rate[productId]) *
                parseInt(productForm.getFieldValue("quantity")) *
                parseInt(productForm.getFieldValue("unit_price"))) /
                100
            ).toFixed(2),
          },
          tax_id: {
            ...prevFormValues.product_list.tax_id,
            [productId]: productForm.getFieldValue(["tax_id", productId]),
          },
        },
      };
    });

    hideModal();
  };

  return (
    <Modal
      title={productName}
      open={productEditModal}
      onCancel={hideModal}
      centered
      width={800}
      okText="Update"
      onOk={handleSubmit}
    >
      <CustomForm submitBtn={false} form={productForm}>
        <Row {...rowLayout}>
          <Col {...colLayout}>
            <CustomInput
              label="Quantity"
              type={"number"}
              name={"quantity"}
              placeholder={"Enter product name"}
            />
          </Col>
          <Col {...colLayout}>
            <CustomInput
              label="Unit Price"
              type={"number"}
              name={"unit_price"}
            />
          </Col>
          <Col {...colLayout}>
            <ProductUnitComponent
              setProductUnits={setProductUnits}
              productId={productId}
            />
          </Col>
        </Row>
      </CustomForm>
    </Modal>
  );
};

function setFormValuesId(
  id,
  purchase_unit_id,
  unit_cost,
  purchase_units,
  formValues,
  productUnits,
  tax_id,
  taxes,
  tax_method
) {
  const sanitizeIntValue = (value) => parseInt(value) || 0;
  const sanitizeFloatValue = (value) => parseFloat(value) || 0;

  if (!id) return;

  const formProductList = formValues.product_list;

  // Helper function to get and sanitize form values
  const getSanitizedValue = (field, defaultValue, sanitizer) =>
    sanitizer(formProductList[field]?.[id] ?? defaultValue);

  // Extract and sanitize values
  const qty = getSanitizedValue("qty", 1, sanitizeIntValue);
  const netUnitCost = getSanitizedValue(
    "net_unit_cost",
    unit_cost,
    sanitizeFloatValue
  );
  const taxRate = getSanitizedValue(
    "tax_rate",
    taxes?.rate ?? 0,
    sanitizeIntValue
  );

  // Get or set purchase units value
  const purchaseUnitsOperationValue = purchase_units?.operation_value ?? 1;
  const productPurchaseUnitsValue =
    sanitizeIntValue(productUnits.purchase_units?.[id]) ||
    purchaseUnitsOperationValue;
  productUnits.purchase_units[id] = productPurchaseUnitsValue;

  // Calculating tax
  const tax = sanitizeFloatValue(
    ((productPurchaseUnitsValue * taxRate * netUnitCost * qty) / 100).toFixed(2)
  );

  // Calculating total
  // const total = (productPurchaseUnitsValue * netUnitCost * qty + tax).toFixed(
  //   2
  // );

  const total =
    tax_method === "Inclusive"
      ? Math.round(
          (productPurchaseUnitsValue * netUnitCost * qty + tax).toFixed(2)
        )
      : (productPurchaseUnitsValue * netUnitCost * qty + tax).toFixed(2);

  // Set form values
  const setFormValue = (field, value) => {
    formProductList[field][id] = value;
  };

  setFormValue("qty", qty);
  setFormValue("net_unit_cost", netUnitCost);
  setFormValue("tax_rate", taxRate);
  setFormValue("tax", tax);
  setFormValue("total", total);
  setFormValue(
    "purchase_unit_id",
    formProductList.purchase_unit_id?.[id] ?? purchase_unit_id
  );

  if (formProductList.tax_id) {
    setFormValue("tax_id", formProductList.tax_id?.[id] ?? tax_id);
  }
}

export const TransferProductTable = ({
  formValues,
  setFormValues,
  products,
  setProducts,
  productUnits,
  setProductUnits,
}) => {
  const form = Form.useFormInstance();
  const warehouseId = Form.useWatch("from_warehouse_id", form);

  const [productEditModal, setProductEditModal] = useState(false);
  const [productId, setProductId] = useState(undefined);
  const [productName, setProductName] = useState(null);

  const handleProductEdit = (id, name) => {
    setProductId(id);
    setProductName(name);
    setProductEditModal(true);
  };

  const hideModal = () => {
    setProductEditModal(false);
  };

  const currency = useSelector(useCurrency);

  const dataSource =
    products?.map((product) => {
      const {
        id,
        name,
        sku,
        buying_price: unit_cost,
        purchase_unit_id,
        purchase_units,
        tax_id,
        taxes,
        product_qties,
        tax_method,
      } = product ?? {};

      const stock = getWarehouseQuantity(product_qties, warehouseId);

      setFormValuesId(
        id,
        purchase_unit_id,
        calculateOriginalPrice(unit_cost, taxes?.rate, tax_method),

        purchase_units,
        formValues,
        productUnits,
        tax_id,
        taxes,
        tax_method
      );

      return {
        id,
        name,
        sku,
        unitCost: showCurrency(
          formValues.product_list.net_unit_cost[id],
          currency
        ),
        delete: true,
        stock,
        tax: showCurrency(formValues.product_list.tax[id], currency),
        subTotal: showCurrency(formValues.product_list.total[id], currency),
        onDelete,
        handleProductEdit,
        incrementCounter,
        decrementCounter,
        onQuantityChange,
        products,
        setProducts,
        formValues,
        setFormValues,
      };
    }) ?? [];

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalTax, setTotalTax] = useState(0);

  useEffect(() => {
    const {
      totalQuantity,
      // totalReceived,
      totalPrice,
      totalTax,
      // totalDiscount,
    } = calculateTotals(formValues);

    setTotalQuantity(totalQuantity);
    // setTotalReceived(totalReceived);
    setTotalPrice(totalPrice);
    setTotalTax(totalTax);
    // setTotalDiscount(totalDiscount);
  }, [formValues, products]);

  // products?.length > 0 &&
  //   dataSource.push({
  //     id: "",
  //     name: "Total",
  //     quantity: totalQuantity,
  //     subTotal: totalPrice,
  //     tax: totalTax,
  //   });

  form.setFieldsValue(formValues);

  const tableStyle = {
    summary: () => {
      return (
        <Table.Summary fixed="bottom">
          <Table.Summary.Row>
            <Table.Summary.Cell index={1} colSpan={3}>
              <Typography.Text className="font-bold" type="">
                Total
              </Typography.Text>
            </Table.Summary.Cell>

            <Table.Summary.Cell index={2} align="center">
              <Typography.Text type="" className="font-bold">
                {totalQuantity}
              </Typography.Text>
            </Table.Summary.Cell>

            <Table.Summary.Cell index={5} align="center">
              <Typography.Text type="" className="font-bold">
                {showCurrency(totalTax, currency)}
              </Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={6} align="center">
              <Typography.Text type="" className="font-bold">
                {showCurrency(totalPrice, currency)}
              </Typography.Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      );
    },
  };

  return (
    <>
      <ProductController
        products={products}
        setProducts={setProducts}
        columns={columns}
        dataSource={dataSource}
        tableStyle={tableStyle}
      />
      <ProductFormComponent
        productEditModal={productEditModal}
        productId={productId}
        productName={productName}
        hideModal={hideModal}
        formValues={formValues}
        setFormValues={setFormValues}
        productUnits={productUnits}
        setProductUnits={setProductUnits}
      />
    </>
  );
};
