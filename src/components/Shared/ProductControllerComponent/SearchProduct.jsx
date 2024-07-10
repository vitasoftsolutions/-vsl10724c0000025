import { AutoComplete, Col, Form, Spin } from "antd";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { fullColLayout } from "../../../layout/FormLayout";
import { useGetAllProductsQuery } from "../../../redux/services/product/productApi";
import { useGlobalParams } from "../../../utilities/hooks/useParams";
import { getWarehouseQuantity } from "../../../utilities/lib/getWarehouseQty";
import { openNotification } from "../../../utilities/lib/openToaster";

export const SearchProduct = ({ setProducts }) => {
  const [keyword, setKeyword] = useState(null);
  const [value, setValue] = useState(null);

  const form = Form.useFormInstance();

  const warehouseId = Form.useWatch("warehouse_id", form);
  const warehouseIdFrom = Form.useWatch("from_warehouse_id", form);

  const debounce = useDebouncedCallback(async (value) => {
    if (value.trim() !== "") {
      setKeyword(value);
    }
  }, 1000);

  const params = useGlobalParams({
    // selectValue: ["id", "name"],

    params: {
      warehouse_id: warehouseId,
      ...(keyword ? {} : { page: 1, pageSize: 20 }),
    },
    keyword,
    isRelationalParams: true,
  });

  const { data, isFetching } = useGetAllProductsQuery({
    params,
  });

  const loadingContent = (
    <div className="flex items-center justify-center ">
      <div className="text-center text-lg ">
        <Spin />
      </div>
    </div>
  );

  const options = isFetching
    ? [
        {
          value: "loading",
          label: loadingContent,
        },
      ]
    : data?.results?.product?.map((product) => ({
        value: product.id.toString(),
        label: `${product.name} (SKU: ${product.sku})`,
        product: product,
      })) ?? [];

  const { pathname } = useLocation();
  console.log(pathname);
  const ignorePaths = ["stock-request", "print-barcode"];

  const onSelect = (_, option) => {
    if (
      !warehouseId &&
      !warehouseIdFrom &&
      ignorePaths.filter((item) => pathname.includes(item)).length === 0
    ) {
      // message.error("Please select warehouse");
      openNotification("warning", "Please select warehouse");

      return;
    }

    const stock = getWarehouseQuantity(
      option?.product?.product_qties,
      warehouseId ?? warehouseIdFrom
    );

    if (
      !stock &&
      ignorePaths.filter((item) => pathname.includes(item)).length === 0
    ) {
      // message.error("Product is out of stock");
      openNotification("warning", "Product is out of stock");
      setValue(null);
      return;
    }

    setProducts((prevProducts) => {
      const productExists = prevProducts.some((product) => {
        return product?.id === option?.product?.id;
      });

      if (!productExists) {
        return [...prevProducts, option.product];
      }

      // message.warning("Product already exists in the list");
      openNotification("warning", "Product already exists in the list");
      return prevProducts;
    });
    setValue(null);
  };

  const onChange = (value) => {
    setValue(value);
  };

  return (
    <Col {...fullColLayout}>
      <AutoComplete
        options={options}
        className="mt-1 w-full"
        size="large"
        onSelect={!isFetching && onSelect}
        onSearch={debounce}
        value={value}
        onChange={onChange}
        placeholder="Search Product"
        suffixIcon={<FaSearch />}
        allowClear={true}
      />
    </Col>
  );
};
