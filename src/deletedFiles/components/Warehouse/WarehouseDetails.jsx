import { Spin } from "antd";
import { useGetWarehouseDetailsQuery } from "../../redux/services/warehouse/warehouseApi";
import createDetailsLayout from "../../utilities/lib/createDetailsLayout";
import { CustomDescription } from "../Shared/Description/CustomDescription";
import CustomModal from "../Shared/Modal/CustomModal";

export const WarehouseDetails = ({ id, ...props }) => {
  const { data, isFetching } = useGetWarehouseDetailsQuery(
    {
      id,
    },
    { skip: !id }
  );

  const details = createDetailsLayout(data, true);

  return (
    <CustomModal {...props}>
      {isFetching ? (
        <Spin className="w-full flex justify-center items-center mt-10" />
      ) : (
        <CustomDescription
          title="Warehouse"
          items={details}
          // nostyle={true}
        />
      )}
    </CustomModal>
  );
};
