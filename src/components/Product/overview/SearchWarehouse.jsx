import { useGetWarehousesQuery } from "../../../redux/services/warehouse/warehouseApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../../utilities/hooks/useParams";
import CustomSelect from "../../Shared/Select/CustomSelect";

export const SearchWarehouse = ({ name }) => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isFetching } = useGetWarehousesQuery({
    params,
  });

  const options = data?.results?.warehouse?.map((warehouse) => ({
    value: warehouse.id?.toString(),
    label: warehouse.name,
  }));

  return (
    <CustomSelect
      label="Warehouse"
      required={true}
      options={options}
      isLoading={isFetching}
      showSearch={true}
      mode="multiple"
      name={name}
    />
  );
};
