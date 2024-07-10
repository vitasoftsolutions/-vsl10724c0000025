import { useGetAllCategoryQuery } from "../../redux/services/category/categoryApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import CustomSelect from "../Shared/Select/CustomSelect";

export const CategoryComponent = ({
  name = "category_id",
  mode = "single",
}) => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isFetching } = useGetAllCategoryQuery({ params });

  const options = data?.results?.category?.map((item) => {
    return {
      value: item?.id?.toString(),
      label: item?.name,
    };
  });

  return (
    <CustomSelect
      label="Category"
      name={name}
      options={options}
      isLoading={isFetching}
      mode={mode}
    />
  );
};
