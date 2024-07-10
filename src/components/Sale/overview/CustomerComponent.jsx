import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useGetAllCustomerQuery } from "../../../redux/services/customer/customerApi";
import CustomerCreate from "../../Customer/CustomerCreate";
import { CustomSelectButton } from "../../Shared/Select/CustomSelectButton";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../../utilities/hooks/useParams";
import { Form } from "antd";

//CustomerButtonComponent
export const CustomerComponent = () => {
  const form = Form.useFormInstance();
  const [isSubDrawerOpen, setIsSubDrawerOpen] = useState(false);
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllCustomerQuery({ params });

  const options = data?.results?.customer?.map((item) => {
    return {
      value: item.id?.toString(),
      label: item.name,
    };
  });

  const handleOpenSubDrawer = () => {
    setIsSubDrawerOpen(true);
  };

  const handleCloseSubDrawer = () => {
    setIsSubDrawerOpen(false);
  };

  useEffect(() => {
    if (options?.length && !form?.getFieldValue("customer_id")) {
      form.setFieldValue("customer_id", options[0].value);
    }
  }, [form, options]);

  return (
    <>
      <CustomSelectButton
        label="Customer"
        showSearch={true}
        options={options}
        icon={<FaPlus className="text-xl" />}
        onClick={handleOpenSubDrawer}
        name={"customer_id"}
        isLoading={isLoading}
        required={"true"}
      />

      <CustomerCreate
        subDrawer={true}
        isSubDrawerOpen={isSubDrawerOpen}
        handleCloseSubDrawer={handleCloseSubDrawer}
      />
    </>
  );
};
