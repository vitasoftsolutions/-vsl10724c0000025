import { useGetAllCashierQuery } from "../../../redux/services/cashier/cashierApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../../utilities/lib/getPermission";
import CustomSelect from "../../Shared/Select/CustomSelect";

export const CashierComponent = ({ required = true }) => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });
  const { data, isLoading } = useGetAllCashierQuery(
    {
      params,
    },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const options = data?.results?.cashier?.map((cashier) => ({
    value: cashier?.id?.toString(),
    label: cashier?.name,
  }));
  return (
    <CustomSelect
      label="Cashier"
      options={options}
      isLoading={isLoading}
      name="cashier_id"
      required={required}
    />
  );
};
