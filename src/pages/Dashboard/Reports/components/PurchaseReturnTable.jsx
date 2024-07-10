import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { PurchaseReturnDetails } from "../../../../components/PurchaseReturn/PurchaseReturnDetails";
import CustomTable from "../../../../components/Shared/Table/CustomTable";
import { GlobalUtilityStyle } from "../../../../container/Styled";
import { useCurrency } from "../../../../redux/services/pos/posSlice";
import { useGetAllPurchaseReturnQuery } from "../../../../redux/services/return/purchaseReturnApi";
import { usePagination } from "../../../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../../../utilities/hooks/useParams";
import { showCurrency } from "../../../../utilities/lib/currency";
import { useUrlIndexPermission } from "../../../../utilities/lib/getPermission";
import { columns } from "../data/PurchaseReturn";

export const PurchaseReturnTable = ({ keyword, summaryType, summary }) => {
  const currency = useSelector(useCurrency);
  const [detailsId, setDetailsId] = useState(undefined);
  const [detailsModal, setDetailsModal] = useState(false);

  const { pagination, updatePage, updatePageSize } = usePagination();

  const params = useGlobalParams({
    isDefaultParams: false,
    isRelationalParams: true,
    params: {
      ...pagination,
      ...summaryType,
      summary,
    },
    keyword,
  });

  const { data, isLoading } = useGetAllPurchaseReturnQuery(
    { params },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const total = data?.meta?.total;

  const handleDetailsModal = (id) => {
    setDetailsId(id);
    setDetailsModal(true);
  };

  const dataSource =
    data?.results?.purchasereturn?.map((item) => {
      const {
        id,
        reference_id,
        warehouses,
        suppliers,
        purchase_return_at,
        grand_total,
      } = item ?? {};

      const date = dayjs(purchase_return_at).format("DD-MM-YYYY");

      return {
        id,
        referenceNo: reference_id,
        warehouse: warehouses?.name,
        supplier: suppliers?.name,
        date: date,
        grandTotal: showCurrency(grand_total ?? 0, currency),
        handleDetailsModal,
      };
    }) ?? [];

  const hideModal = () => {
    setDetailsModal(false);
  };

  return (
    <GlobalUtilityStyle>
      <CustomTable
        columns={columns}
        dataSource={dataSource}
        total={total}
        pagination={pagination}
        updatePage={updatePage}
        updatePageSize={updatePageSize}
        //   setSelectedRows={setSelectedRows}
        isLoading={isLoading}
        //   isRowSelection={true}
        status={false}
        created_at={false}
      />

      {detailsId && (
        <PurchaseReturnDetails
          id={detailsId}
          openModal={detailsModal}
          hideModal={hideModal}
        />
      )}
    </GlobalUtilityStyle>
  );
};
