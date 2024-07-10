import { useState } from "react";
import { useDispatch } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import { useGetAllProductsQuery } from "../../../redux/services/product/productApi";
import { setProduct } from "../../../redux/services/product/productSlice";
import { PRODUCT } from "../../../utilities/apiEndpoints/inventory.api";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../../utilities/hooks/useParams";
import { usePermission } from "../../../utilities/lib/getPermission";
import DebounceSelect from "../../Shared/Select/DebounceSelect";

export const SearchProductComponent = () => {
  const [keyword, setKeyword] = useState(null);

  const debounce = useDebouncedCallback(async (value) => {
    if (value.trim() !== "") {
      setKeyword(value);
    }
  }, 1000);

  const params = useGlobalParams({
    selectValue: [...DEFAULT_SELECT_VALUES, "sku", "buying_price"],
    params: keyword,
  });

  console.log(params);

  const isPermitted = usePermission(PRODUCT, "index");

  const { data, isFetching } = useGetAllProductsQuery(
    {
      params,
      // : {
      //   selectValue: ["id", "name", "sku", "buying_price"],
      //   keyword,
      // },
    },
    {
      skip: !keyword && !isPermitted,
    }
  );

  const options = [
    // ...editOptions,
    ...(data?.results?.product?.map((product) => ({
      value: product.id.toString(),
      label: product.name,
      sku: product.sku,
      unitCost: product.buying_price,
    })) ?? []),
  ];

  const dispatch = useDispatch();

  const onSelect = (value, option) => {
    dispatch(
      setProduct({
        value: option.value,
        label: option.label,
        sku: option.sku,
        unitCost: option.unitCost,
      })
    );
  };

  return (
    <DebounceSelect
      label="Product"
      onSearch={debounce}
      placeholder={"Product Name"}
      required={true}
      options={options}
      name={"product_name"}
      mode={"multiple"}
      isLoading={isFetching}
      onSelect={onSelect}
    />
  );
};
