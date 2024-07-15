import dayjs from "dayjs";
import { useState } from "react";
import { GlobalUtilityStyle } from "../../container/Styled";
import { useGetAllStockRequestQuery } from "../../redux/services/stockRequest/stockRequestApi";
import { usePagination } from "../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import CustomTable from "../Shared/Table/CustomTable";
import { StockRequestDetails } from "./StockRequestDetails";

const StockRequestTable = ({
  newColumns,
  setSelectedRows,
  keyword,
  searchParams,
}) => {
  const [detailsId, setDetailsId] = useState(undefined);
  const [detailsModal, setDetailsModal] = useState(false);

  const { pagination, updatePage, updatePageSize } = usePagination();

  const params = useGlobalParams({
    isDefaultParams: false,
    isRelationalParams: true,
    params: { ...pagination, ...searchParams },
    keyword,
  });

  const { data, isLoading } = useGetAllStockRequestQuery(
    { params },
    {
      // skip: !useUrlIndexPermission(),
    }
  );
  const total = data?.meta?.total;

  const handleDetailsModal = (id) => {
    setDetailsId(id);
    setDetailsModal(true);
  };

  const dataSource =
    data?.results?.stockrequest?.map((item) => {
      const {
        id,
        reference_id,
        created_at,
        from_warehouses,
        to_warehouses,
        stock_request_products,
      } = item ?? {};

      const date = dayjs(created_at).format("DD-MM-YYYY");

      const sumNeedQty = (arr) => {
        return arr.reduce((sum, item) => sum + parseFloat(item.need_qty), 0);
      };

      return {
        id,
        reference: reference_id,
        fromWarehouse: from_warehouses?.name,
        toWarehouse: to_warehouses?.name,
        created_at: date,
        reqQty: sumNeedQty(stock_request_products),

        handleDetailsModal,
      };
    }) ?? [];

  const hideModal = () => {
    setDetailsModal(false);
    // setDeleteModal(false);
  };

  return (
    <GlobalUtilityStyle>
      <CustomTable
        columns={newColumns}
        dataSource={dataSource}
        total={total}
        pagination={pagination}
        updatePage={updatePage}
        updatePageSize={updatePageSize}
        setSelectedRows={setSelectedRows}
        // isLoading={isLoading || loading}
        isLoading={isLoading}
        isRowSelection={true}
        status={false}
      />

      {detailsId && (
        <StockRequestDetails
          id={detailsId}
          openModal={detailsModal}
          hideModal={hideModal}
        />
      )}
    </GlobalUtilityStyle>
  );
};

export default StockRequestTable;
