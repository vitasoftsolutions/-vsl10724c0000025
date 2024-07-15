import { Col, Form, Modal, Row, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { colLayout, mdColLayout, rowLayout } from "../../../layout/FormLayout";
import { useGetAllTaxQuery } from "../../../redux/services/tax/taxApi";
import { useGetAllUnitQuery } from "../../../redux/services/unit/unitApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../../utilities/hooks/useParams";
import { calculateOriginalPrice } from "../../../utilities/lib/calculatePrice";
import { calculateTotals } from "../../../utilities/lib/calculateTotals";
import {
  decrementCounter,
  incrementCounter,
  onDelete,
  onQuantityChange,
} from "../../../utilities/lib/productTable/counters";
import CustomForm from "../../Shared/Form/CustomForm";
import CustomInput from "../../Shared/Input/CustomInput";
import { ProductController } from "../../Shared/ProductControllerComponent/ProductController";
import CustomSelect from "../../Shared/Select/CustomSelect";
import { columns, partialColumns } from "./productColumns";
import { getWarehouseQuantity } from "../../../utilities/lib/getWarehouseQty";
import { useSelector } from "react-redux";
import { useCurrency } from "../../../redux/services/pos/posSlice";
import { showCurrency } from "../../../utilities/lib/currency";

const TaxComponent = ({ productId, setProductUnits }) => {
  const params = useGlobalParams({
    selectValue: [...DEFAULT_SELECT_VALUES, "rate"],
  });

  const { data, isLoading } = useGetAllTaxQuery({ params });

  const options = data?.results?.tax?.map((tax) => ({
    value: tax.id?.toString(),
    label: tax.name,
    rate: tax.rate,
  }));

  const onSelect = (value, option) => {
    setProductUnits((prevValues) => ({
      ...prevValues,
      tax_rate: {
        ...prevValues.tax_rate,
        [productId]: option.rate ?? 0,
      },
    }));
  };

  return (
    <CustomSelect
      name={["tax_id", productId]}
      options={options}
      label="Product Tax"
      isLoading={isLoading}
      onSelect={onSelect}
    />
  );
};

const ProductUnitComponent = ({ setProductUnits, productId }) => {
  const params = useGlobalParams({
    selectValue: [
      ...DEFAULT_SELECT_VALUES,
      "operation_value",
      "operator",
      "for",
    ],
  });

  const { data, isLoading } = useGetAllUnitQuery({ params });

  const productUnits = data?.results?.unit
    ?.filter((unit) => unit.for === "purchase-unit")
    .map((unit) => ({
      value: unit.id.toString(),
      label: unit.name,
      operationValue: unit?.operation_value,
      operator: unit?.operator,
    }));

  const onSelect = (value, option) => {
    setProductUnits((prevValues) => ({
      ...prevValues,
      purchase_units: {
        ...prevValues.purchase_units,
        [productId]: option.operationValue ?? 1,
      },
    }));
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
        unit_discount: formValues?.product_list?.discount[productId],
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
      console.log(productUnits, productId);
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
          discount: {
            ...prevFormValues.product_list.discount,
            [productId]: productForm.getFieldValue("unit_discount"),
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
          <Col {...mdColLayout}>
            <CustomInput
              label="Unit Discount"
              type={"number"}
              name={"unit_discount"}
            />
          </Col>

          <Col {...mdColLayout}>
            <TaxComponent
              productId={productId}
              setProductUnits={setProductUnits}
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

  // console.log(purchase_units);
  // console.log(productUnits);

  // console.log(taxes);

  // console.log(unit_cost);

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
  const discount = getSanitizedValue("discount", 0, sanitizeFloatValue);
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
  const total =
    tax_method === "Inclusive"
      ? Math.round(
          (
            productPurchaseUnitsValue * netUnitCost * qty -
            discount +
            tax
          ).toFixed(2)
        )
      : (
          productPurchaseUnitsValue * netUnitCost * qty -
          discount +
          tax
        ).toFixed(2);

  // Set form values
  const setFormValue = (field, value) => {
    formProductList[field][id] = value;
  };

  setFormValue("qty", qty);
  setFormValue("net_unit_cost", netUnitCost);
  setFormValue("discount", discount);
  setFormValue("tax_rate", taxRate);
  setFormValue("tax", tax);
  setFormValue("total", total);
  setFormValue(
    "purchase_unit_id",
    formProductList.purchase_unit_id?.[id] ?? purchase_unit_id
  );
  setFormValue(
    "recieved",
    sanitizeIntValue(formProductList.recieved?.[id] ?? 0)
  );

  if (formProductList.tax_id) {
    setFormValue("tax_id", formProductList.tax_id?.[id] ?? tax_id);
  }
}

export const PurchaseProductTable = ({
  formValues,
  setFormValues,
  products,
  setProducts,
  productUnits,
  setProductUnits,
}) => {
  const form = Form.useFormInstance();
  const type = Form.useWatch("purchase_status", form);
  const warehouseId = Form.useWatch("warehouse_id", form);

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

  const incrementReceivedCounter = (id) => {
    setFormValues((prevFormValues) => {
      const currentQty = prevFormValues.product_list.recieved[id] || 0;
      const newQty = parseInt(currentQty) + 1;

      return {
        ...prevFormValues,
        product_list: {
          ...prevFormValues.product_list,
          recieved: {
            ...prevFormValues.product_list.recieved,
            [id]: newQty,
          },
        },
      };
    });
  };

  const decrementReceivedCounter = (id) => {
    setFormValues((prevFormValues) => {
      const currentQty = prevFormValues.product_list.recieved[id] || 0;
      const newQty = Math.min(parseInt(currentQty) - 1, 0);

      return {
        ...prevFormValues,
        product_list: {
          ...prevFormValues.product_list,
          recieved: {
            ...prevFormValues.product_list.recieved,
            [id]: newQty,
          },
        },
      };
    });
  };

  const onReceivedChange = (id, value) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      product_list: {
        ...prevFormValues.product_list,
        recieved: {
          ...prevFormValues.product_list.recieved,
          [id]: parseInt(value, 10) || 0,
        },
      },
    }));
  };

  const currency = useSelector(useCurrency);

  console.log(productUnits);

  const dataSource = products?.map((product) => {
    const {
      id,
      name,
      sku,
      buying_price: unit_cost,
      purchase_unit_id,
      purchase_units,
      tax_id,
      taxes,
      tax_method,
      product_qties,
    } = product ?? {};

    const stock = getWarehouseQuantity(product_qties, warehouseId);

    console.log(tax_method);

    // tax_method === "inclusive" &&
    //   setProductUnits((prevProductUnits) => ({
    //     ...prevProductUnits,
    //     inclusive_tax_rate: {
    //       ...prevProductUnits.inclusive_tax_rate,
    //       [id]: taxes?.rate,
    //     },
    //   }));

    setFormValuesId(
      id,
      purchase_unit_id,
      calculateOriginalPrice(unit_cost, taxes?.rate, tax_method),
      // unit_cost,
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
      discount: showCurrency(formValues.product_list.discount[id], currency),
      tax: showCurrency(formValues.product_list.tax[id], currency),
      subTotal: showCurrency(formValues.product_list.total[id], currency),
      incrementCounter,
      decrementCounter,
      onQuantityChange,
      incrementReceivedCounter,
      decrementReceivedCounter,
      onReceivedChange,
      onDelete,
      handleProductEdit,
      products,
      setProducts,
      formValues,
      setFormValues,
    };
  });

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  useEffect(() => {
    const {
      totalQuantity,
      totalReceived,
      totalPrice,
      totalTax,
      totalDiscount,
    } = calculateTotals(formValues);

    setTotalQuantity(totalQuantity);
    setTotalReceived(totalReceived);
    setTotalPrice(totalPrice);
    setTotalTax(totalTax);
    setTotalDiscount(totalDiscount);
  }, [formValues, products]);

  form.setFieldsValue(formValues);

  const tableStyle = {
    summary: () => {
      return (
        <Table.Summary fixed="bottom">
          <Table.Summary.Row>
            <Table.Summary.Cell index={1} colSpan={4}>
              <Typography.Text className="font-bold" type="">
                Total
              </Typography.Text>
            </Table.Summary.Cell>

            <Table.Summary.Cell index={2} align="center">
              <Typography.Text type="" className="font-bold">
                {totalQuantity}
              </Typography.Text>
            </Table.Summary.Cell>
            {type === "Partial" && (
              <Table.Summary.Cell index={3} align="center">
                <Typography.Text type="" className="font-bold">
                  {totalReceived}
                </Typography.Text>
              </Table.Summary.Cell>
            )}
            <Table.Summary.Cell index={4} align="center">
              <Typography.Text type="" className="font-bold">
                {showCurrency(totalDiscount, currency)}
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
        columns={type === "Partial" ? partialColumns : columns}
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
