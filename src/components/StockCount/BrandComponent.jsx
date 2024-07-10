import { Col } from "antd";
import { useGetBrandsQuery } from "../../redux/services/brand/brandApi";
import { mdColLayout } from "../../layout/FormLayout";
import CustomSelect from "../Shared/Select/CustomSelect";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";

export const BrandComponent = () => {
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
    <Col {...mdColLayout}>
      <CustomSelect
        name={"brand_ids"}
        label="Brand"
        options={options}
        isLoading={isFetching}
        mode="multiple"
      />
    </Col>
  );
};
