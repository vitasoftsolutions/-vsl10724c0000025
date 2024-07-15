import { AutoComplete, Col, Spin } from "antd";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDebouncedCallback } from "use-debounce";
import { fullColLayout } from "../../layout/FormLayout";
import { useGetWarehousesQuery } from "../../redux/services/warehouse/warehouseApi";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import { openNotification } from "../../utilities/lib/openToaster";
import { ProductTable } from "../Shared/ProductControllerComponent/ProductTable";

const SearchWarehouse = ({ setWarehouses }) => {
  const [keyword, setKeyword] = useState(null);
  const [value, setValue] = useState(null);

  const debounce = useDebouncedCallback(async (value) => {
    if (value.trim() !== "") {
      setKeyword(value);
    }
  }, 1000);

  const params = useGlobalParams({
    keyword,
    isRelationalParams: true,
  });

  const { data, isFetching } = useGetWarehousesQuery({
    params,
  });

  //console.log(data);

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
    : data?.results?.warehouse?.map((warehouse) => ({
        value: warehouse.id.toString(),
        label: `${warehouse.name}`,
        warehouse: warehouse,
      })) ?? [];

  const onSelect = (_, option) => {
    setWarehouses((prevWarehouse) => {
      const warehouseExists = prevWarehouse.some((warehouse) => {
        return warehouse?.id === option?.warehouse?.id;
      });

      if (!warehouseExists) {
        return [...prevWarehouse, option.warehouse];
      }

      // message.warning("Warehouse already exists in the list");

      openNotification("info", "Warehouse already exists in the list");
      return prevWarehouse;
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
        placeholder="Search Warehouse"
        suffixIcon={<FaSearch />}
        allowClear={true}
      />
    </Col>
  );
};
export const WarehouseController = ({
  warehouses,
  setWarehouses,
  columns,
  dataSource,
}) => {
  return (
    <>
      <SearchWarehouse warehouses={warehouses} setWarehouses={setWarehouses} />
      <ProductTable
        columns={columns}
        dataSource={dataSource}
        styleProps={{
          width: "100%",
          scroll: {
            y: 400,
            x: "min-content",
          },
        }}
      />
    </>
  );
};
