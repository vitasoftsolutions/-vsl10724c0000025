import { Col, Row } from "antd";
import { fullColLayout, mdColLayout, rowLayout } from "../../layout/FormLayout";
import { useGetAllCategoryQuery } from "../../redux/services/category/categoryApi";
import { useCustomDebounce } from "../../utilities/hooks/useDebounce";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import DebounceSelect from "../Shared/Select/DebounceSelect";
import CustomUploader from "../Shared/Upload/CustomUploader";

const ParentCategoryComponent = () => {
  const { keyword, debounce } = useCustomDebounce();

  const params = useGlobalParams({
    params: {
      parent: 1,
    },
    keyword,
  });

  const { data, isFetching } = useGetAllCategoryQuery({ params });

  const options = data?.results?.category?.map((category) => ({
    key: category.id,
    value: category.id?.toString(),
    label: category.name,
  }));

  return (
    <DebounceSelect
      label="Parent Category"
      name={"parent_id"}
      placeholder={"Parent Category"}
      onSearch={debounce}
      options={options}
      isLoading={isFetching}
    />
  );
};

const CategoryForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...mdColLayout}>
          <CustomInput
            label="Category Name"
            type={"text"}
            required={true}
            name={"name"}
            placeholder={"Category Name"}
          />
        </Col>
        <Col {...mdColLayout}>
          <ParentCategoryComponent />
        </Col>
        <Col {...fullColLayout}>
          <CustomUploader label={"Category Image"} name={"attachment"} />
        </Col>
      </Row>
    </CustomForm>
  );
};

export default CategoryForm;
