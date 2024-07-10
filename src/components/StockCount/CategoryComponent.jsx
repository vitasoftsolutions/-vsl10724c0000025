import { Col } from "antd";
import { useGetAllCategoryQuery } from "../../redux/services/category/categoryApi";
import { mdColLayout } from "../../layout/FormLayout";
import CustomSelect from "../Shared/Select/CustomSelect";

export const CategoryComponent = () => {
  const { data, isFetching } = useGetAllCategoryQuery({});

  const options = data?.results?.category?.map((item) => {
    return {
      value: item.id.toString(),
      label: item.name,
    };
  });
  return (
    <Col {...mdColLayout}>
      <CustomSelect
        label="Category"
        name={"category_ids"}
        options={options}
        isLoading={isFetching}
        mode="multiple"
      />
    </Col>
  );
};
