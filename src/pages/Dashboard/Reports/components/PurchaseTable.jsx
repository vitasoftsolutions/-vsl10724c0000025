import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { PurchaseDetails } from "../../../../components/Purchase/PurchaseDetails";
import CustomTable from "../../../../components/Shared/Table/CustomTable";
import { GlobalUtilityStyle } from "../../../../container/Styled";
import { useCurrency } from "../../../../redux/services/pos/posSlice";
import { useGetAllPurchaseQuery } from "../../../../redux/services/purchase/purchaseApi";
import { usePagination } from "../../../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../../../utilities/hooks/useParams";
import { showCurrency } from "../../../../utilities/lib/currency";
import { useUrlIndexPermission } from "../../../../utilities/lib/getPermission";
import { columns } from "../data/purchaseColumns";

export const PurchaseTable = ({ keyword, summaryType, summary }) => {
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

  const { data, isLoading } = useGetAllPurchaseQuery(
    { params },
    {
      skip: !useUrlIndexPermission("purchase"),
    }
  );

  const total = data?.meta?.total;

  const handleDetailsModal = (id) => {
    setDetailsId(id);
    setDetailsModal(true);
  };

  const dataSource =
    data?.results?.purchase?.map((item) => {
      const {
        id,
        created_at,
        reference_id,
        suppliers,
        warehouses,
        purchase_status,
        payment_status,
        grand_total,
        paid_amount,
        due_amount,
        is_active,
      } = item ?? {};
      const date = dayjs(created_at).format("DD-MM-YYYY");

      return {
        id,
        date,
        reference: reference_id,
        warehouse: warehouses?.name,
        supplier: suppliers?.name,
        purchaseStatus: purchase_status,
        paymentStatus: payment_status,
        grandTotal: showCurrency(grand_total, currency),
        paid: showCurrency(paid_amount, currency),
        due: showCurrency(due_amount, currency),
        status: is_active,
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
        // setSelectedRows={setSelectedRows}
        isLoading={isLoading}
        // isRowSelection={true}
        status={false}
        created_at={false}
        // action={false}
      />

      {detailsId && (
        <PurchaseDetails
          id={detailsId}
          openModal={detailsModal}
          hideModal={hideModal}
        />
      )}
    </GlobalUtilityStyle>
  );
};
