import { useRef, useState } from "react";
import CustomForm from "../../../components/Shared/Form/CustomForm";
import { Button, Checkbox, Form, Select } from "antd";
import ProductSelect from "./ProductSelect";
import Barcode from "react-barcode";
import CustomModal from "../../../components/Shared/Modal/CustomModal";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import { PageContainer } from "@ant-design/pro-layout";

const PrintBarcode = () => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({
    product_list: {
      qty: {},
    },
  });
  const [products, setProducts] = useState([]);
  const [barcodes, setBarcodes] = useState([]);
  const [codeModal, setCodeModal] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [labelSize, setLabelSize] = useState({ width: 2, height: 70 });

  const data = Form.useWatch("product_list", form);

  const generateBarcode = () => {
    if (products?.length <= 0) {
      toast?.info("Please Select a Product!");
      return;
    }

    const generatedBarcodes = products?.map((product) => {
      const quantity = data?.qty[product.id] || 0;
      return {
        name: product.name,
        sku: product.sku,
        selling_price: product?.selling_price,
        symbology: product?.symbology,
        promotion_price: product?.promotion_price,
        quantity,
      };
    });

    setBarcodes(generatedBarcodes);
    setCodeModal(true);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const sizes = [
    { label: "(3 x 1 inches)", value: "2.625x1" },
    { label: "(2 x 1 inches)", value: "4x6" },
    { label: "(1 x 1 inches)", value: "1x1" },
  ];

  const handleLabelSizeChange = (value) => {
    switch (value) {
      case "2.625x1":
        setLabelSize({ width: 2.625, height: 40 });
        break;
      case "4x6":
        setLabelSize({ width: 1.5, height: 50 });
        break;
      case "1x1":
        setLabelSize({ width: 1, height: 20 });
        break;
      default:
        setLabelSize({ width: 2, height: 70 });
    }
  };

  return (
    <PageContainer
      header={{
        title: (
          <div className="text-2xl lg:text-3xl border-r-2 pr-2 border-black py-1">
            Product
          </div>
        ),
        subTitle: (
          <div className="text-2xl lg:text-3xl py-1">Print Barcode</div>
        ),
      }}
    >
      <div className="max-w-7xl mx-auto mt-10">
        <CustomForm form={form} submitBtn={false}>
          <ProductSelect
            formValues={formValues}
            setFormValues={setFormValues}
            products={products}
            setProducts={setProducts}
          />
          <div className="mt-32 flex flex-col justify-center items-center">
            <div>
              <Checkbox onChange={(e) => setShowName(e.target.checked)}>
                Product Name
              </Checkbox>
              <Checkbox onChange={(e) => setShowPrice(e.target.checked)}>
                Price
              </Checkbox>
              <Checkbox onChange={(e) => setShowDiscount(e.target.checked)}>
                Promotional Price
              </Checkbox>
              <Select
                placeholder={"Select a label size"}
                options={sizes}
                className="block mt-6"
                onChange={handleLabelSizeChange}
              />
            </div>
            <Button className="mt-6 px-20 pt-2 pb-8" onClick={generateBarcode}>
              Generate Barcode
            </Button>
            <CustomModal
              openModal={codeModal}
              hideModal={() => setCodeModal(!codeModal)}
            >
              <div className="flex flex-col justify-center items-center pt-10">
                <div className="flex items-center gap-4 py-10">
                  <Button className="px-20 pt-2 pb-8" onClick={handlePrint}>
                    Print
                  </Button>
                </div>
                <div ref={componentRef}>
                  {barcodes?.map((barcode, index) => (
                    <div key={index}>
                      <div className="grid grid-cols-3 gap-x-10">
                        {[...Array(barcode.quantity)]?.map((_, i) => (
                          <div
                            key={i}
                            className="mt-10 border border-gray-300 mx-auto rounded-lg p-3"
                          >
                            <div className="flex items-center justify-center font-bold gap-4 text-base mx-auto">
                              {showName && <div>{barcode?.name}</div>}
                              {showPrice && (
                                <div
                                  className={`${
                                    barcode?.promotion_price &&
                                    showDiscount &&
                                    "line-through text-sm"
                                  }`}
                                >
                                  ${barcode?.selling_price}
                                </div>
                              )}
                              {showDiscount && barcode?.promotion_price && (
                                <div>${barcode?.promotion_price}</div>
                              )}
                            </div>
                            <Barcode
                              value={barcode?.sku}
                              width={labelSize.width}
                              height={labelSize.height}
                              format={barcode?.symbology}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CustomModal>
          </div>
        </CustomForm>
      </div>
    </PageContainer>
  );
};

export default PrintBarcode;
