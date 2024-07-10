import { useGetDepartmentsQuery } from "../../redux/services/hrm/department/departmentApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import CustomSelect from "../Shared/Select/CustomSelect";

export const DepartmentComponent = ({ name = "department_id" }) => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isFetching } = useGetDepartmentsQuery({ params });

  const options = data?.results?.department?.map((item) => ({
    value: item?.id?.toString(),
    label: item?.name,
  }));

  return (
    <CustomSelect
      label={"Department"}
      name={name}
      options={options}
      isLoading={isFetching}
      required={true}
    />
  );
};
