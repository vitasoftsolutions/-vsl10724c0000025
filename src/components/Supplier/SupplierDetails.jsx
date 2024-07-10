import { Spin } from "antd";
import { useGetSupplierDetailsQuery } from "../../redux/services/supplier/supplierApi";
import createDetailsLayout from "../../utilities/lib/createDetailsLayout";
import { CustomDescription } from "../Shared/Description/CustomDescription";
import CustomModal from "../Shared/Modal/CustomModal";

export const SupplierDetails = ({ id, ...props }) => {
  const { data, isFetching } = useGetSupplierDetailsQuery(
    {
      id,
    },
    { skip: !id }
  );

  const details = createDetailsLayout(data);

  return (
    <CustomModal {...props}>
      {isFetching ? (
        <Spin className="w-full flex justify-center items-center mt-10" />
      ) : (
        <div className="space-y-5 max-h-[75vh] overflow-y-auto pt-3 pb-5">
          <CustomDescription title="Supplier " items={details} />
        </div>
      )}
    </CustomModal>
  );
};
