import { useGetAllTaxQuery } from "../../../redux/services/tax/taxApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../../utilities/lib/getPermission";
import CustomSelect from "../../Shared/Select/CustomSelect";

export const TaxComponent = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isFetching } = useGetAllTaxQuery(
    { params },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const options = data?.results?.tax?.map((item) => {
    return {
      value: item.id.toString(),
      label: item.name,
    };
  });

  return (
    <CustomSelect
      label="Order Tax"
      options={options}
      name={"tax_id"}
      isLoading={isFetching}
    />
  );
};
