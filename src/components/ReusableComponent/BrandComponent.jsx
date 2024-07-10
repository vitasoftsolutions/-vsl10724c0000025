import { useGetBrandsQuery } from "../../redux/services/brand/brandApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import CustomSelect from "../Shared/Select/CustomSelect";

export const BrandComponent = ({ name = "brand_id", mode = "single" }) => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isFetching } = useGetBrandsQuery({ params });

  const options = data?.results?.brand?.map((item) => {
    return {
      value: item?.id.toString(),
      label: item?.name,
    };
  });

  return (
    <CustomSelect
      name={name}
      label="Brand"
      options={options}
      isLoading={isFetching}
      mode={mode}
    />
  );
};
