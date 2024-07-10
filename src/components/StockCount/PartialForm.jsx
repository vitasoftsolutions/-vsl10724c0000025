import { Col, Form } from "antd";
import { mdColLayout } from "../../layout/FormLayout";
import { BrandComponent } from "../ReusableComponent/BrandComponent";
import { CategoryComponent } from "../ReusableComponent/CategoryComponent";

const PartialForm = () => {
  const form = Form.useFormInstance();
  const typeData = Form.useWatch("type", form);

  if (typeData === "Partial") {
    return (
      <>
        <Col {...mdColLayout}>
          <CategoryComponent mode="multiple" name={"category_ids"} />
        </Col>
        <Col {...mdColLayout}>
          <BrandComponent name="brand_ids" mode="multiple" />
        </Col>
      </>
    );
  }
};

export default PartialForm;
