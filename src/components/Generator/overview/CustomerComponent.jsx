import { useGetAllCustomerQuery } from "../../../redux/services/customer/customerApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../../utilities/lib/getPermission";
import CustomSelect from "../../Shared/Select/CustomSelect";

export const CustomerComponent = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllCustomerQuery(
    {
      params,
    },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const options = data?.results?.customer?.map((customer) => ({
    value: customer?.id?.toString(),
    label: customer?.name,
  }));
  return (
    <CustomSelect
      label="Customer"
      options={options}
      isLoading={isLoading}
      name="customer_id"
    />
  );
};
