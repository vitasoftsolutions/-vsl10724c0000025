import { useGetAllTaxQuery } from "../../redux/services/tax/taxApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import CustomSelect from "../Shared/Select/CustomSelect";

export const OrderTaxComponent = () => {
  const params = useGlobalParams({
    selectValue: [...DEFAULT_SELECT_VALUES, "rate"],
  });

  const { data, isFetching } = useGetAllTaxQuery({ params });

  const options = data?.results?.tax?.map((item) => {
    return {
      value: item.rate,
      label: item.name,
      tax_rate: item?.rate,
    };
  });

  return (
    <CustomSelect
      label="Order Tax"
      options={options}
      name={"tax_rate"}
      isLoading={isFetching}
    />
  );
};
