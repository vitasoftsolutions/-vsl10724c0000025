import { useGetWarehousesQuery } from "../../../redux/services/warehouse/warehouseApi";
import CustomSelect from "../../Shared/Select/CustomSelect";

export const WarehouseComponent = () => {
  const { data, isLoading } = useGetWarehousesQuery({
    params: {
      selectValue: ["id", "name"],
    },
  });

  const options = data?.results?.warehouse?.map((warehouse) => ({
    value: warehouse?.id?.toString(),
    label: warehouse?.name,
  }));

  return (
    <CustomSelect
      label="Warehouse"
      showSearch={true}
      isLoading={isLoading}
      options={options}
      name="warehouse_id"
      required={true}
    />
  );
};
