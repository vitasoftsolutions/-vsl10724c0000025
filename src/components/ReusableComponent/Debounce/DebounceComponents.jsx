import { useGetWarehousesQuery } from "../../../redux/services/warehouse/warehouseApi";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../../utilities/hooks/useParams";
import DebounceSelect from "../../Shared/Select/DebounceSelect";

export const WarehouseComponent = ({ mode = "single" }) => {
  const { keyword, debounce } = useCustomDebounce();

  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
    keyword,
  });

  const { data, isFetching } = useGetWarehousesQuery(
    { params },
    {
      skip: !keyword,
    }
  );

  const options = data?.results?.category?.map((category) => ({
    key: category.id,
    value: category.id?.toString(),
    label: category.name,
  }));

  console.log(isFetching);

  return (
    <DebounceSelect
      label="Warehouse"
      name={"warehouse_id"}
      placeholder={"Warehouse"}
      onSearch={debounce}
      required={true}
      options={options}
      mode={mode}
      isLoading={isFetching}
      // onSelect={onSelect}
    />
  );
};
