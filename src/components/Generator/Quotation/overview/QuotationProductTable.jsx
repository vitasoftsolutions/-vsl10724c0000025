import { Col, Form, Modal, Row, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  colLayout,
  mdColLayout,
  rowLayout,
} from "../../../../layout/FormLayout";
import { useGetAllTaxQuery } from "../../../../redux/services/tax/taxApi";
import { useGetAllUnitQuery } from "../../../../redux/services/unit/unitApi";
import CustomForm from "../../../Shared/Form/CustomForm";
import CustomInput from "../../../Shared/Input/CustomInput";
import { ProductController } from "../../../Shared/ProductControllerComponent/ProductController";
import CustomSelect from "../../../Shared/Select/CustomSelect";
import { columns } from "./productColumns";
import { setFormValuesId } from "../../../../utilities/lib/updateFormValues/updateFormValues";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../../../utilities/hooks/useParams";
import {
  decrementCounter,
  incrementCounter,
  onDelete,
  onQuantityChange,
} from "../../../../utilities/lib/productTable/counters";
import { calculateTotals } from "../../../../utilities/lib/calculateTotals";
import { calculateOriginalPrice } from "../../../../utilities/lib/calculatePrice";
import { useSelector } from "react-redux";
import { useCurrency } from "../../../../redux/services/pos/posSlice";
import { showCurrency } from "../../../../utilities/lib/currency";

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
    selectValue: [...DEFAULT_SELECT_VALUES, "operation_value", "for"],
  });

  const { data, isLoading } = useGetAllUnitQuery({ params });

  const productUnits = data?.results?.unit
    ?.filter((unit) => unit.for === "sale-unit")
    .map((unit) => ({
      value: unit.id.toString(),
      label: unit.name,
      operationValue: unit.operation_value,
    }));

  const onSelect = (value, option) => {
    setProductUnits((prevValues) => {
      return {
        ...prevValues,
        sale_units: {
          [productId]: option.operationValue ?? 1,
        },
      };
    });
  };

  return (
    <CustomSelect
      label="Sale Unit"
      options={productUnits}
      isLoading={isLoading}
      name={["sale_unit_id", productId]}
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
        unit_price: formValues?.product_list?.net_unit_price[productId],
        sale_unit_id: {
          [productId]:
            formValues?.product_list?.sale_unit_id[productId]?.toString() ?? "",
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
          sale_unit_id: {
            ...prevFormValues.product_list.sale_unit_id,
            [productId]: productForm.getFieldValue(["sale_unit_id", productId]),
          },
          discount: {
            ...prevFormValues.product_list.discount,
            [productId]: productForm.getFieldValue("unit_discount"),
          },
          net_unit_price: {
            ...prevFormValues.product_list.net_unit_price,
            [productId]: productForm.getFieldValue("unit_price"),
          },
          tax_rate: {
            ...prevFormValues.product_list.tax_rate,
            [productId]: productUnits?.tax_rate[productId],
          },
          tax: {
            ...prevFormValues.product_list.tax,
            [productId]: parseFloat(
              (parseInt(productUnits.sale_units[productId]) *
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

export const QuotationProductTable = ({
  formValues,
  setFormValues,
  products,
  setProducts,
  productUnits,
  setProductUnits,
}) => {
  const form = Form.useFormInstance();
  const currency = useSelector(useCurrency);

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

  const dataSource = products?.map((product) => {
    const {
      id,
      name,
      sku,
      buying_price: unit_cost,
      sale_unit_id,
      tax_id,
      taxes,
      sale_units,
      tax_method,
    } = product ?? {};

    setFormValuesId(
      id,
      sale_unit_id,
      calculateOriginalPrice(unit_cost, taxes?.rate, tax_method),
      sale_units,
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
        formValues.product_list.net_unit_price[id],
        currency
      ),
      delete: true,
      discount: showCurrency(formValues.product_list.discount[id], currency),
      tax: showCurrency(formValues.product_list.tax[id], currency),
      subTotal: showCurrency(formValues.product_list.total[id], currency),
      incrementCounter,
      decrementCounter,
      onQuantityChange,
      onDelete,
      handleProductEdit,
      products,
      setProducts,
      formValues,
      setFormValues,
    };
  });

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  useEffect(() => {
    const { totalQuantity, totalPrice, totalTax, totalDiscount } =
      calculateTotals(formValues);

    setTotalQuantity(totalQuantity);
    setTotalPrice(totalPrice);
    setTotalTax(totalTax);
    setTotalDiscount(totalDiscount);
  }, [formValues, products]);

  // products?.length > 0 &&
  //   dataSource.push({
  //     id: "",
  //     name: "Total",
  //     unitCost: "",
  //     quantity: totalQuantity,
  //     subTotal: totalPrice,
  //     tax: totalTax,
  //     discount: totalDiscount,
  //     action: false,
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
