import { Spin } from "antd";
import createDetailsLayout from "../../utilities/lib/createDetailsLayout";
import { CustomDescription } from "../Shared/Description/CustomDescription";
import CustomModal from "../Shared/Modal/CustomModal";
import { useGetStockCountDetailsQuery } from "../../redux/services/stockCount/stockCountApi";

export const StockCountDetails = ({ id, ...props }) => {
  const { data, isFetching } = useGetStockCountDetailsQuery(
    { id, params: { parent: 1, child: 1 } },
    { skip: !id }
  );

  const details = createDetailsLayout(data, true);

  return (
    <CustomModal {...props}>
      {isFetching ? (
        <Spin className="w-full flex justify-center items-center mt-10" />
      ) : (
        <CustomDescription
          title="StockCount"
          items={details}
          // nostyle={true}
        />
      )}
    </CustomModal>
  );
};
