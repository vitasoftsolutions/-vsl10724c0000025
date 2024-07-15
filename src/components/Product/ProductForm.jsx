import { Col, Form, Row } from "antd";
import { useEffect } from "react";
import { RiRefreshLine } from "react-icons/ri";
import { barcodeOptions } from "../../assets/data/barcode";
import { taxTypeOptions } from "../../assets/data/taxType";
import {
  colLayout,
  fullColLayout,
  mdColLayout,
  rowLayout,
} from "../../layout/FormLayout";
import { disabledDate } from "../../utilities/lib/currentDate";
import { generateRandomCode } from "../../utilities/lib/generateCode";
import CustomCheckbox from "../Shared/Checkbox/CustomCheckbox";
import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomInputButton from "../Shared/Input/CustomInputButton";
import CustomSelect from "../Shared/Select/CustomSelect";
import RichTextEditor from "../Shared/TextEditor/RichTextEditor";
import CustomUploader from "../Shared/Upload/CustomUploader";
import { BrandComponent } from "./overview/BrandComponent";
import { CategoryComponent } from "./overview/CategoryComponent";
import ComboProductsComponent from "./overview/ComboProductsComponent";
import { DifferentPriceComponent } from "./overview/DifferentPriceComponent";
import { InitialStockComponent } from "./overview/InitialStockComponent";
import { TaxComponent } from "./overview/TaxComponent";
import UnitComponent from "./overview/UnitComponent";

const ProductTypeComponent = () => {
  const form = Form.useFormInstance();
  const productType = Form.useWatch("type", form);

  const options = [
    { value: "Standard", label: "Standard" },
    { value: "Combo", label: "Combo" },
    { value: "Digital", label: "Digital" },
    { value: "Service", label: "Service" },
  ];

  useEffect(() => {
    if (!productType) {
      form.setFieldValue("type", "Standard");
    }
  }, [form, productType]);

  return (
    <CustomSelect
      label="Product Type"
      required={true}
      options={options}
      name={"type"}
    />
  );
};

const ProductCodeComponent = () => {
  const form = Form.useFormInstance();

  const generate = () => {
    const randomCode = generateRandomCode(6);

    form?.setFieldValue("sku", randomCode);
  };

  return (
    <CustomInputButton
      label="Sku"
      type={"text"}
      required={true}
      name={"sku"}
      placeholder={"Generate Sku"}
      onClick={generate}
      icon={<RiRefreshLine className="text-xl" />}
    />
  );
};

const BarCodeComponent = () => {
  const form = Form.useFormInstance();
  const productType = Form.useWatch("type", form);

  useEffect(() => {
    if (!productType) {
      form.setFieldValue("symbology", barcodeOptions[0].value);
    }
  }, [form, productType]);

  return (
    <CustomSelect
      label="Barcode Symbology"
      options={barcodeOptions}
      required={true}
      name={"symbology"}
    />
  );
};

const AttachmentComponent = () => {
  const form = Form.useFormInstance();
  const productType = Form.useWatch("type", form);

  if (productType === "Digital")
    return (
      <Col {...fullColLayout}>
        <CustomUploader
          label={"Attachment"}
          name={"attach_file"}
          required={true}
        />
      </Col>
    );
};

const ProductCostComponent = () => {
  const form = Form.useFormInstance();
  const productType = Form.useWatch("type", form);

  if (productType === "Standard")
    return (
      <Col {...colLayout}>
        <CustomInput
          label="Product Buying Cost"
          type={"number"}
          required={true}
          name={"buying_price"}
        />
      </Col>
    );
};

const AlertComponent = () => {
  const form = Form.useFormInstance();
  const productType = Form.useWatch("type", form);

  if (productType === "Standard") {
    return (
      <Col {...colLayout}>
        <CustomInput
          label="Alert Quantity"
          type={"number"}
          // required={true}
          name={"alert_qty"}
        />
      </Col>
    );
  }
};

const TaxTypeComponent = () => {
  return (
    <CustomSelect
      label="Tax Method"
      options={taxTypeOptions}
      required={true}
      name={"tax_method"}
      showSearch={true}
    />
  );
};

const ExpireComponent = () => {
  const form = Form.useFormInstance();
  const productType = Form.useWatch("type", form);
  const hasExpiredDate = Form.useWatch("has_expired_date", form);

  console.log(hasExpiredDate);

  if (productType === "Standard" && hasExpiredDate) {
    return (
      <Col {...mdColLayout}>
        <CustomDatepicker
          label={"Expired Date"}
          name={["product_expire", "expired_date"]}
          required={true}
        />
      </Col>
    );
  } else return null;
};

const PromotionalPriceComponent = () => {
  const form = Form.useFormInstance();
  const hasPromotionalPrice = Form.useWatch("has_promotion", form);

  // const disabledDate = (current) => {
  //   return current < dayjs().startOf("day");
  // };

  const start_date = Form.useWatch(["promotion", "starting_date"], form);

  const disabledDateStart = (current) => {
    // if (start_date) {
    //   return (
    //     current && start_date && current < dayjs(start_date).startOf("day")
    //   );
    // } else {
    //   return current < dayjs().startOf("day");
    // }

    return disabledDate(current, start_date);
  };

  return (
    <Row {...rowLayout}>
      <Col {...fullColLayout}>
        <CustomCheckbox label="Add Promotional Price" name="has_promotion" />
      </Col>

      {hasPromotionalPrice && (
        <>
          <Col {...mdColLayout}>
            <CustomInput
              label="Promotional Price"
              name={["promotion", "promotion_price"]}
              type={"number"}
              required={true}
            />
          </Col>
          <Col {...mdColLayout}>
            <Row {...rowLayout}>
              <Col {...mdColLayout}>
                <CustomDatepicker
                  type={"date"}
                  label={"Start Date"}
                  name={["promotion", "starting_date"]}
                  required={true}
                  disabledDate={disabledDate}
                />
              </Col>
              <Col {...mdColLayout}>
                <CustomDatepicker
                  type={"date"}
                  label={"End Date"}
                  name={["promotion", "last_date"]}
                  required={true}
                  disabledDate={disabledDateStart}
                />
              </Col>
            </Row>
          </Col>
        </>
      )}
    </Row>
  );
};

const ProductForm = ({
  formValues,
  setFormValues,
  products,
  setProducts,
  initialWarehouses,
  setInitialWarehouses,
  priceWarehouses,
  setPriceWarehouses,
  ...props
}) => {
  const productType = Form.useWatch("type", props.form);

  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...colLayout}>
          <ProductTypeComponent />
        </Col>

        <Col {...colLayout}>
          <CustomInput
            label="Product Name"
            type={"text"}
            required={true}
            name={"name"}
          />
        </Col>

        <Col {...colLayout}>
          <ProductCodeComponent />
        </Col>

        <Col {...colLayout}>
          <BarCodeComponent />
        </Col>

        {productType === "Combo" && (
          <ComboProductsComponent
            formValues={formValues}
            setFormValues={setFormValues}
            products={products}
            setProducts={setProducts}
          />
        )}

        <AttachmentComponent />

        <Col {...colLayout}>
          <BrandComponent />
        </Col>
        <Col {...colLayout}>
          <CategoryComponent />
        </Col>

        <UnitComponent />

        <ProductCostComponent />

        <Col {...colLayout}>
          <CustomInput
            label="Product Selling Price"
            type={"number"}
            required={true}
            name={"selling_price"}
          />
        </Col>
        <Col {...colLayout}>
          <CustomInput
            label="Daily Sale Objectives"
            type={"number"}
            tooltip="Minimum qty which must be sold in a day. If not you will not be notified on dashboard. But you have to set up cron job property for that. Follow the documentation in this regard."
            name={"daily_sale_qty"}
          />
        </Col>

        <AlertComponent />

        <Col {...colLayout}>
          <TaxComponent />
        </Col>
        <Col {...colLayout}>
          <TaxTypeComponent />
        </Col>
      </Row>

      <Row {...rowLayout}>
        <Col {...fullColLayout}>
          <CustomCheckbox
            label="Initial Stock"
            name="has_stock"
            // required={true}
          />
        </Col>

        <InitialStockComponent
          initialWarehouses={initialWarehouses}
          setInitialWarehouses={setInitialWarehouses}
          formValues={formValues}
          setFormValues={setFormValues}
        />

        {/* <Col {...fullColLayout}>
          <CustomCheckbox
            label="Featured Product"
            name="has_featured"
            subLabel="(It will be displayed on POS)"
          />
        </Col>
        <Col {...fullColLayout}>
          <CustomCheckbox label="Embeded Barcode" name="embedded_barcode" />
        </Col> */}
      </Row>

      <Row {...rowLayout} justify={"center"} align={"middle"}>
        <Col xs={24}>
          <CustomUploader
            label={"Attachment"}
            name={"attachments"}
            multiple={true}
            required={true}
            type="img"
          />
        </Col>
      </Row>
      <Row {...rowLayout}>
        <Col {...fullColLayout}>
          <RichTextEditor label="Product" name="details" required={true} />
        </Col>
      </Row>

      {/* <VarientComponent /> */}

      <Row {...rowLayout}>
        <Col {...fullColLayout}>
          <CustomCheckbox
            label="This product has different price for different warehouse"
            name="has_different_price"
          />
        </Col>

        <DifferentPriceComponent
          formValues={formValues}
          setFormValues={setFormValues}
          priceWarehouses={priceWarehouses}
          setPriceWarehouses={setPriceWarehouses}
        />
      </Row>

      <Row {...rowLayout}>
        <Col {...fullColLayout}>
          <CustomCheckbox
            label="This product has batch and expired date"
            name="has_expired_date"
          />
        </Col>

        <ExpireComponent />
      </Row>

      <PromotionalPriceComponent />
    </CustomForm>
  );
};

export default ProductForm;
