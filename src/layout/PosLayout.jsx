import { Button, Form, Layout, Tag } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch } from "react-redux";
import Logo from "../components/AllSection/Header/Logo";
import Profile from "../components/AllSection/Header/Profile";
import Payment from "../components/PosRegister/Payment";
import { PosRegister } from "../components/PosRegister/PosRegister";
import { GlobalUtilityStyle } from "../container/Styled";
import { Filter } from "../pages/Dashboard/PosRegister/Filter";
import { closeCreateDrawer } from "../redux/services/drawer/drawerSlice";
import { useCreateSaleMutation } from "../redux/services/sale/saleApi";
import { mode } from "../utilities/configs/base_url";
import { appendToFormData } from "../utilities/lib/appendFormData";
import {
  calculateGrandTotal,
  calculateTotalPrice,
  calculateTotalTax,
} from "../utilities/lib/generator/generatorUtils";
import { openNotification } from "../utilities/lib/openToaster";
import { decimalConverter } from "../utilities/lib/return/decimalComverter";
import { sanitizeObj } from "../utilities/lib/sanitizeObj";
import SideBar from "./SideBar";

const { Footer } = Layout;

const PosLayout = () => {
  const [posForm] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);

  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(false);

  const [createSale, { isLoading }] = useCreateSaleMutation();

  const [formValues, setFormValues] = useState({
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

  const [products, setProducts] = useState([]);

  const [productUnits, setProductUnits] = useState({
    sale_units: {},
    tax_rate: {},
    coupon_rate: {},
    minimum_amount: {},
  });

  const [type, setType] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [grandTotal, setGrandTotal] = useState(0);

  const handleSubmit = async () => {
    const values = posForm.getFieldsValue();

    const { discount, shipping_cost, tax_rate, sale_at, paid_amount } =
      values ?? {};

    const { product_list } = formValues;

    const productListArray = product_list?.qty
      ? Object.keys(product_list.qty)
          .filter((product_id) => product_list.qty[product_id] !== undefined)
          .map((product_id) => ({
            product_id: parseInt(product_id),
            qty: product_list.qty[product_id],
            sale_unit_id: product_list.sale_unit_id[product_id],
            net_unit_price: decimalConverter(
              product_list.net_unit_price[product_id]
            ),
            discount: decimalConverter(product_list.discount[product_id]),
            tax_rate: decimalConverter(product_list.tax_rate[product_id]),
            tax: decimalConverter(product_list.tax[product_id]),
            total: decimalConverter(product_list.total[product_id]),
          }))
      : [];

    if (productListArray.length === 0) {
      // message.info("Please add at least one product");
      openNotification("info", "Please add at least one product");
      return;
    }

    if (!sale_at) {
      // message.info("Please select date");
      openNotification("info", "Please select date");
      return;
    }

    if (!values?.cashier_id) {
      // message.info("Please Select Cashier");
      openNotification("info", "Please Select Cashier");
      return;
    }

    const totalPrice = calculateTotalPrice(product_list);
    const orderTax = calculateTotalTax(totalPrice, values.tax_rate);

    const totalQty =
      Object.values(formValues.product_list?.qty).reduce(
        (acc, cur) => acc + parseInt(cur),
        0
      ) ?? 0;

    const totalDiscount =
      Object.values(formValues.product_list?.discount).reduce(
        (acc, cur) => acc + parseFloat(cur),
        0
      ) ?? 0;

    const totalTax =
      Object.values(formValues.product_list?.tax).reduce(
        (acc, cur) => acc + parseFloat(cur),
        0
      ) ?? 0;

    console.log(values);

    const postObj = {
      ...sanitizeObj(values),
      sale_status: "Completed",
      sale_at: dayjs(sale_at).format("YYYY-MM-DD"),
      discount: decimalConverter(discount),
      shipping_cost: decimalConverter(shipping_cost),
      tax_rate: decimalConverter(tax_rate),
      item: productListArray.length,
      total_qty: totalQty,
      total_discount: decimalConverter(totalDiscount),
      total_tax: decimalConverter(totalTax),
      total_price: decimalConverter(totalPrice),
      tax: decimalConverter(orderTax),
      change: decimalConverter(
        Number(values?.recieved_amount ?? 0) - Number(values?.paid_amount ?? 0)
      ),
      grand_total: calculateGrandTotal(
        totalPrice,
        values.tax_rate,
        discount,
        shipping_cost
      ),
      product_list: JSON.stringify(productListArray),
      petty_cash_id: 8,
    };

    if (paid_amount) {
      postObj.paid_amount = Number(paid_amount).toFixed(2);
    }

    const formData = new FormData();
    appendToFormData(postObj, formData);

    try {
      const { data, error } = await createSale({ data: formData });
      if (data?.success) {
        dispatch(closeCreateDrawer());

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
      }

      if (error) {
        const errorFields = Object.keys(error?.data?.errors).map(
          (fieldName) => ({
            name: fieldName,
            errors: error?.data?.errors[fieldName],
          })
        );
        setErrorFields(errorFields);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsModalOpen(false);
      posForm.resetFields();
    }
  };

  return (
    <GlobalUtilityStyle>
      <div className="flex flex-col relative h-screen">
        <div className="grow min-h-[60vh]  overflow-auto h-full bg-[#F5F5F5]">
          <div className="grid grid-cols-5 h-[85vh] ">
            <div className="col-span-3">
              <PosRegister
                formValues={formValues}
                setFormValues={setFormValues}
                products={products}
                setProducts={setProducts}
                productUnits={productUnits}
                setProductUnits={setProductUnits}
                form={posForm}
                fields={errorFields}
                setGrandTotal={setGrandTotal}
                type={type}
                setType={setType}
              />
            </div>

            <div className="relative flex flex-col h-[90vh] col-span-2">
              <div className="bg-white flex justify-between items-center px-5 w-full top-0 z-50 shadow-md">
                <div className="flex items-center gap-6 text-2xl">
                  <Button
                    className="p-0 border border-none rounded-full flex items-center justify-center text-[20px]"
                    type="text"
                    icon={<GiHamburgerMenu />}
                    onClick={() => setCollapsed(!collapsed)}
                  ></Button>
                  <Logo />
                </div>
                {mode === "local" && (
                  <Tag color="processing" className="font-semibold">
                    {mode.toUpperCase()} MODE
                  </Tag>
                )}
                <Profile />
              </div>

              {/* <div className="flex grow ">
                <div className="flex flex-col w-full ">
                  <div>
                    <PosFilterComponent />
                  </div>
                  <div
                    style={{
                      borderRadius: "8px",
                    }}
                    className="shadow-md grow m-4 bg-gray-200 "
                  >
                    <PosProducts
                      products={products}
                      setProducts={setProducts}
                      setFormValues={setFormValues}
                      setProductUnits={setProductUnits}
                      form={posForm}
                    />
                  </div>
                </div>
              </div> */}
              <Filter
                products={products}
                setProducts={setProducts}
                setFormValues={setFormValues}
                setProductUnits={setProductUnits}
                posForm={posForm}
              />
            </div>
          </div>
        </div>

        <Footer
          style={{
            textAlign: "center",
          }}
          className="py-4"
        >
          <Payment
            handleSubmit={handleSubmit}
            form={posForm}
            fields={errorFields}
            isLoading={isLoading}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            grandTotal={grandTotal}
          />
        </Footer>

        <div className="absolute h-[100vh] overflow-auto z-40 left-0 ">
          <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
      </div>
    </GlobalUtilityStyle>
  );
  // }
};

export default PosLayout;
