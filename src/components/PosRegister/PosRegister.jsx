import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Table, Tooltip, Typography } from "antd";
import { currencies } from "currencies.json";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { GlobalUtilityStyle } from "../../container/Styled";
import { fullColLayout } from "../../layout/FormLayout";
import { useGetAllCouponQuery } from "../../redux/services/coupon/couponApi";
import { useGetAllCustomerQuery } from "../../redux/services/customer/customerApi";
import { useCurrency } from "../../redux/services/pos/posSlice";
import { useGetAllTaxQuery } from "../../redux/services/tax/taxApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import { openNotification } from "../../utilities/lib/openToaster";
import CustomerCreate from "../Customer/CustomerCreate";
import { CashierComponent } from "../ReusableComponent/CashierComponent";
import { WarehouseComponent } from "../ReusableComponent/WarehouseComponent";
import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";
import CustomInput from "../Shared/Input/CustomInput";
import CustomModal from "../Shared/Modal/CustomModal";
import { SearchProduct } from "../Shared/ProductControllerComponent/SearchProduct";
import CustomSelect from "../Shared/Select/CustomSelect";
import { CustomSelectButton } from "../Shared/Select/CustomSelectButton";
import ProductTableComponent from "./PosProductTableComponent";
const { Text } = Typography;

const CustomerComponent = ({ size }) => {
  const form = Form.useFormInstance();
  const [isSubDrawerOpen, setIsSubDrawerOpen] = useState(false);

  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllCustomerQuery({
    params,
  });

  const options = data?.results?.customer?.map((customer) => ({
    value: customer.id?.toString(),
    label: customer.name,
  }));

  useEffect(() => {
    if (options?.length && !form.getFieldValue("customer_id")) {
      form.setFieldValue("customer_id", options[0].value);
    }
  }, [form, options]);

  const handleOpenSubDrawer = () => {
    setIsSubDrawerOpen(true);
  };

  const handleCloseSubDrawer = () => {
    setIsSubDrawerOpen(false);
  };

  return (
    <>
      <CustomSelectButton
        placeholder={"customer"}
        showSearch={true}
        isLoading={isLoading}
        options={options}
        icon={<FaPlus className="text-xl" />}
        onClick={handleOpenSubDrawer}
        required={true}
        name="customer_id"
        customStyle={true}
        size={size}
      />

      <CustomerCreate
        subDrawer={true}
        isSubDrawerOpen={isSubDrawerOpen}
        handleCloseSubDrawer={handleCloseSubDrawer}
      />
    </>
  );
};

const CurrencyComponent = ({ size }) => {
  const form = Form.useFormInstance();
  const currency = useSelector(useCurrency);

  const options = currencies.map(({ name, symbol, code }) => {
    return { label: `${name} (${symbol})`, value: code };
  });

  useEffect(() => {
    if (options?.length) {
      form.setFieldValue("currency", currency?.name);
    }
  }, [currency?.name, form, options]);

  return (
    <CustomSelect
      placeholder={"currency"}
      showSearch={true}
      options={options}
      required={true}
      name="currency"
      customStyle={true}
      size={size}
    />
  );
};

const CurrencyExchangeComponent = (size) => {
  const form = Form.useFormInstance();

  useEffect(() => {
    form.setFieldValue("exchange_rate", 1);
  }, [form]);

  const content = (
    <Tooltip title="Cuurency Exchange Rate">
      <InfoCircleOutlined
        style={{
          color: "rgba(0,0,0,.45)",
        }}
      />
    </Tooltip>
  );

  return (
    <CustomInput
      type={"number"}
      name={"exchange_rate"}
      placeholder={"Exchange Rate"}
      suffix={content}
      customStyle={true}
      size={size}
    />
  );
};

const TaxComponent = () => {
  const params = useGlobalParams({
    selectValue: [...DEFAULT_SELECT_VALUES, "rate"],
  });

  const { data, isFetching } = useGetAllTaxQuery({
    params,
  });

  const options = data?.results?.tax?.map((item) => {
    return {
      value: item.rate,
      label: item.name,
    };
  });
  return (
    <CustomSelect
      options={options}
      name={"tax_rate"}
      isLoading={isFetching}
      placeholder={"Tax"}
    />
  );
};

const CouponComponent = ({ setType, setProductUnits }) => {
  const params = useGlobalParams({});

  const { data, isFetching } = useGetAllCouponQuery({ params });

  const options = data?.results?.coupon?.map((item) => {
    return {
      value: item.id?.toString(),
      label: item.code,
      type: item.type,
      rate: item.amount,
      minimum_amount: item.minimum_amount,
    };
  });

  const onSelect = (value, option) => {
    setType(option.type);
    setProductUnits((prevValues) => {
      return {
        ...prevValues,
        coupon_rate: option.rate,
        minimum_amount: option.minimum_amount,
      };
    });
  };

  return (
    <CustomSelect
      options={options}
      name={"coupon_id"}
      isLoading={isFetching}
      placeholder={"Coupon"}
      onSelect={onSelect}
      showSearch={true}
    />
  );
};

// const colLayout = {
//   xs: 24,
//   lg: 12,
//   xxl: 8,
// };

const RegisterForm = ({ products, setProducts }) => {
  const form = Form.useFormInstance();

  useEffect(() => {
    const currentDate = dayjs(new Date());
    form.setFieldValue("sale_at", currentDate);
  }, [form]);

  return (
    <GlobalUtilityStyle className="pb-5 ">
      <div className="flex flex-col">
        <Row gutter={5}>
          <Col span={4}>
            <CustomDatepicker
              name={"sale_at"}
              required={true}
              placeholder={"Date"}
              customStyle={true}
              size="default"
            />
          </Col>

          <Col span={6}>
            <WarehouseComponent label={false} size="default" />
          </Col>
          <Col span={6}>
            <CashierComponent label={false} required={true} size="default" />
          </Col>

          <Col span={8}>
            <CustomerComponent size="default" />
          </Col>

          <Col span={12}>
            <CustomInput
              type={"text"}
              // required={true}
              placeholder={"Reference Number"}
              name={"reference_number"}
              size="default"
              customStyle={true}
            />
          </Col>
          <Col span={12}>
            <Row gutter={5}>
              <Col span={14}>
                <CurrencyComponent size="default" />
              </Col>
              <Col span={10}>
                <CurrencyExchangeComponent size="default" />
              </Col>
            </Row>
          </Col>
          <SearchProduct products={products} setProducts={setProducts} />
        </Row>
      </div>
    </GlobalUtilityStyle>
  );
};

export const PosRegister = ({
  formValues,
  setFormValues,
  products,
  setProducts,
  productUnits,
  setProductUnits,
  form,
  fields,

  setGrandTotal,
  type,
  setType,
}) => {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = Object.values(formValues.product_list.qty).reduce(
      (acc, cur) => acc + parseInt(cur),
      0
    );
    setTotalQuantity(total);

    const totalPrice = Object.values(formValues.product_list.total).reduce(
      (acc, cur) => acc + parseFloat(cur),
      0
    );
    setTotalPrice(totalPrice?.toFixed(2));

    // const totalTax = Object.values(formValues.product_list.tax).reduce(
    //   (acc, cur) => acc + parseFloat(cur),
    //   0
    // );
    // setTotalTax(totalTax.toFixed(2));

    // const totalDiscount = Object.values(
    //   formValues.product_list.discount
    // ).reduce((acc, cur) => acc + parseFloat(cur), 0);

    // setTotalDiscount(totalDiscount.toFixed(2));
  }, [formValues, products]);

  // const discount = Form.useWatch("Discount", form);
  // const tax = Form.useWatch("Tax", form);
  // const shipping = Form.useWatch("Shipping", form);

  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [coupon, setCoupon] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const showModal = (value) => {
    setIsModalOpen(true);
    setModalType(value);
  };
  const hideModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const taxRate = Form.useWatch("tax_rate", form);

  const handleSubmit = async () => {
    if (modalType === "Discount") {
      setDiscount(form.getFieldValue(modalType));
    }

    if (modalType === "Shipping Cost") {
      setShipping(form.getFieldValue(modalType));
    }

    if (modalType === "Coupon") {
      if (totalPrice < productUnits.minimum_amount) {
        // message.error(
        //   "Coupon can be applied only if total price is greater than " +
        //     productUnits.minimum_amount
        // );

        openNotification(
          "info",
          "Coupon can be applied only if total price is greater than " +
            productUnits.minimum_amount
        );

        // hideModal();
        return;
      }

      if (type?.toLowerCase() === "fixed") {
        setCoupon(productUnits.coupon_rate);
      }
    }

    hideModal();
  };

  const tax = (totalPrice * (taxRate ?? 0)) / 100;

  const grand_total =
    parseFloat(totalPrice) +
    parseFloat(tax ?? 0) +
    parseFloat(shipping) -
    parseFloat(discount) -
    parseFloat(coupon);

  useEffect(() => {
    setGrandTotal(grand_total);

    // if (type.toLowerCase() === "percentage") {
    //   setCoupon((totalPrice * productUnits.coupon_rate) / 100);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grand_total, setGrandTotal, totalPrice]);

  const tableStyleProps = {
    summary: () => {
      return (
        <Table.Summary fixed="bottom">
          <Table.Summary.Row>
            <Table.Summary.Cell index={1} colSpan={4}>
              <Text className="font-bold" type="">
                Total
              </Text>
            </Table.Summary.Cell>

            <Table.Summary.Cell index={2} align="center">
              <Text type="" className="font-bold">
                {totalQuantity}
              </Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="center">
              <Text type="" className="font-bold">
                {totalPrice}
              </Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      );
    },
    sticky: {
      // offsetHeader: 440,
      offsetScroll: 400,
    },
    scroll: {
      x: "min-content",
    },
  };

  const item = Object.values(formValues.product_list.qty).length;

  const currency = useSelector(useCurrency);

  // console.log(type);

  // console.log(totalPrice);

  // console.log(productUnits.minimum_amount);

  useEffect(() => {
    if (type?.toLowerCase() === "fixed") {
      setCoupon(productUnits.coupon_rate);
    }
  }, [type, productUnits.coupon_rate, totalPrice, productUnits.minimum_amount]);

  return (
    <>
      <Form
        form={form}
        fields={fields}
        layout="vertical"
        autoComplete="on"
        scrollToFirstError
        className="h-[90vh]"
        noStyle
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex-none">
            <RegisterForm products={products} setProducts={setProducts} />
          </div>

          <div className="flex-grow overflow-y-auto bg-white">
            <ProductTableComponent
              products={products}
              setProducts={setProducts}
              formValues={formValues}
              setFormValues={setFormValues}
              productUnits={productUnits}
              setProductUnits={setProductUnits}
              tableStyleProps={item && tableStyleProps}
            />
          </div>

          <div className="flex-none bg-white pb-3 px-2 flex flex-col gap-2 rounded-md shadow-md">
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-1 xl:gap-2 px-2">
              <div className="grid grid-cols-2">
                <span>Items</span>
                <span className="font-semibold">
                  {Object.keys(formValues.product_list.qty).length}
                </span>
              </div>
              <div className="grid grid-cols-2">
                <span>Total</span>
                <span className="font-semibold">{totalPrice}</span>
              </div>
              <div className="grid grid-cols-2">
                <span
                  className="flex justify-start items-center gap-2 hover:cursor-pointer hover:underline"
                  onClick={() => showModal("Discount")}
                >
                  Discount
                  <FaRegEdit className="primary-text" />
                </span>
                <Form.Item name="Discount" noStyle></Form.Item>
                <span className="font-semibold">{discount ?? 0}</span>
              </div>
              <div className="grid grid-cols-2">
                <span
                  className="flex justify-start items-center gap-2 hover:cursor-pointer hover:underline"
                  onClick={() => showModal("Coupon")}
                >
                  Coupon
                  <FaRegEdit className="primary-text" />
                </span>
                <Form.Item name="Coupon" noStyle></Form.Item>
                <span className="font-semibold">{coupon ?? 0}</span>
              </div>
              <div className="grid grid-cols-2">
                <span
                  className="flex justify-start items-center gap-2 hover:cursor-pointer hover:underline "
                  onClick={() => showModal("Tax")}
                >
                  Tax
                  <FaRegEdit className="primary-text" />
                </span>
                <Form.Item name="Tax" noStyle></Form.Item>
                <span className="font-semibold">{tax ?? 0}</span>
              </div>
              <div className="grid grid-cols-2">
                <span
                  className="flex justify-start items-center gap-2 hover:cursor-pointer hover:underline"
                  onClick={() => showModal("Shipping Cost")}
                >
                  Shipping
                  <FaRegEdit className="primary-text" />
                </span>
                <Form.Item name="Shipping" noStyle></Form.Item>
                <span className="font-semibold">{shipping ?? 0}</span>
              </div>
            </div>

            <div className="text-center secondary-bg primary-text text-lg py-1 font-semibold rounded-sm">
              Grand Total {grand_total.toFixed(2) ?? 0}
            </div>

            <Button
              type="primary"
              onClick={() => {
                form.resetFields();
                setFormValues({
                  product_list: {
                    product_id: {},
                    qty: {},
                    sale_unit_id: {},
                    net_unit_price: {},
                    discount: {},
                    tax_rate: {},
                    tax: {},
                    total: {},

                    tax_id: {},
                  },
                });

                setProducts([]);

                setProductUnits({
                  sale_units: {},
                  tax_rate: {},
                });
              }}
              className=" flex justify-center items-center gap-2"
            >
              Reset
            </Button>
          </div>
        </div>
      </Form>

      <CustomModal
        openModal={isModalOpen}
        hideModal={hideModal}
        title={modalType}
        width={600}
        showCloseButton={false}
        footer={true}
        onOk={handleSubmit}
      >
        <Form
          form={form}
          fields={fields}
          layout="vertical"
          autoComplete="on"
          scrollToFirstError
        >
          <Row>
            <Col {...fullColLayout}>
              {modalType === "Tax" ? (
                <TaxComponent />
              ) : modalType === "Coupon" ? (
                <CouponComponent
                  setType={setType}
                  setProductUnits={setProductUnits}
                />
              ) : (
                <CustomInput
                  type="number_with_money"
                  name={modalType}
                  placeholder={modalType}
                  suffix={currency?.name}
                />
              )}
            </Col>
          </Row>
        </Form>
      </CustomModal>
    </>
  );
};
