import { PageContainer } from "@ant-design/pro-layout";
import { Col, Form, Row, Space } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FilterDateRange } from "../../components/ReusableComponent/FilterDateRange";
import CustomForm from "../../components/Shared/Form/CustomForm";
import CustomSelect from "../../components/Shared/Select/CustomSelect";
import { rowLayout } from "../../layout/FormLayout";
import { useCurrentUser } from "../../redux/services/auth/authSlice";
import { useGetWarehousesQuery } from "../../redux/services/warehouse/warehouseApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import { GlobalUtilityStyle } from "../Styled";

const WarehouseComponent = ({ onChange }) => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const user = useSelector(useCurrentUser);
  const form = Form.useFormInstance();

  const { data, isLoading } = useGetWarehousesQuery({ params });

  const options = data?.results?.warehouse?.map((warehouse) => ({
    value: warehouse?.id?.toString(),
    label: warehouse?.name,
  }));

  useEffect(() => {
    if (options?.length && !form?.getFieldValue("warehouse_id")) {
      form.setFieldValue("warehouse_id", user?.warehouse_id?.toString());
    }
  }, [form, options, user?.warehouse_id]);

  return (
    <CustomSelect
      isLoading={isLoading}
      placeholder={"Warehouse"}
      options={options}
      name={"warehouse_id"}
      customStyle={true}
      onChange={onChange}
    />
  );
};
export const ReportContainer = ({
  pageTitle,
  form,
  searchFilterContent,
  onDateChange,
  onWarehouseChange,
  children,
}) => {
  const { pathname } = useLocation();

  return (
    <GlobalUtilityStyle>
      <div className="h-full">
        <PageContainer
          header={{
            title: <div className="text-2xl lg:text-3xl py-3">{pageTitle}</div>,
          }}
          extra={[
            <Space key="search" className="flex items-center">
              <CustomForm layout="horizontal" submitBtn={false} form={form}>
                <Row {...rowLayout} gutter={2}>
                  {!pathname.includes("calender") && (
                    <Col span={14}>
                      <FilterDateRange
                        customStyle={true}
                        name="daterange"
                        onChange={onDateChange}
                      />
                    </Col>
                  )}

                  <Col span={pathname.includes("calender") ? 24 : 10}>
                    <WarehouseComponent onChange={onWarehouseChange} />
                  </Col>
                </Row>
              </CustomForm>

              {/* <Space.Compact> */}
              {/* <Input
                  type="text"
                  key="search"
                  size="large"
                  className="w-full border rounded-md border-gray-300 focus:outline-none focus:border-primary"
                  placeholder="Search"
                  // value={searchUser}
                  // onChange={handleSearchUser}
                  prefix={
                    <IoSearch
                      style={{
                        fontSize: "16px",
                      }}
                      className="primary-text hover:cursor-pointer hover:scale-110 duration-300 text-xs lg:text-[16px]"
                    />
                  }
                  allowClear={true}
                /> */}
              {/* <WarehouseFilter /> */}

              {/* <Popover
                  content={searchFilterContent}
                  title="Advance Search"
                  trigger="click"
                  placement="bottomRight"
                  arrow={false}
                >
                  <Button
                    key="filter"
                    size="large"
                    className="border border-gray-300 "
                    type="text"
                  >
                    <TbFilterSearch
                      style={{
                        fontSize: "16px",
                        // color: "#000",
                      }}
                      className="text-xs primary-text lg:text-[16px]"
                    />
                  </Button>
                </Popover> */}
              {/* </Space.Compact> */}
            </Space>,
          ]}
          content={children}
        />
      </div>
    </GlobalUtilityStyle>
  );
};
