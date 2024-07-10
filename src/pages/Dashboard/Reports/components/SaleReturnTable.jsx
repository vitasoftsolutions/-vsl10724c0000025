import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { SaleReturnDetails } from "../../../../components/SaleReturn/SaleReturnDetails";
import CustomTable from "../../../../components/Shared/Table/CustomTable";
import { GlobalUtilityStyle } from "../../../../container/Styled";
import { useCurrency } from "../../../../redux/services/pos/posSlice";
import { useGetAllSaleReturnQuery } from "../../../../redux/services/return/saleReturnApi";
import { usePagination } from "../../../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../../../utilities/hooks/useParams";
import { showCurrency } from "../../../../utilities/lib/currency";
import { useUrlIndexPermission } from "../../../../utilities/lib/getPermission";
import { columns } from "../data/SaleReturn";

export const SaleReturnTable = ({ keyword, summaryType, summary }) => {
  const currency = useSelector(useCurrency);

  const [detailsId, setDetailsId] = useState(undefined);
  const [detailsModal, setDetailsModal] = useState(false);

  const { pagination, updatePage, updatePageSize } = usePagination();

  const params = useGlobalParams({
    isDefaultParams: false,
    isRelationalParams: true,
    params: { ...pagination, ...summaryType, summary },
    keyword,
  });

  const { data, isLoading } = useGetAllSaleReturnQuery(
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
    data?.results?.salereturn?.map((item) => {
      const {
        id,
        reference_id,
        warehouses,
        cashiers,
        sale_return_at,
        grand_total,
      } = item ?? {};

      const date = dayjs(sale_return_at).format("DD-MM-YYYY");

      return {
        id,
        referenceNo: reference_id,
        warehouse: warehouses?.name,
        cashier: cashiers?.name,
        date,
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
        // setSelectedRows={setSelectedRows}
        isLoading={isLoading}
        // isRowSelection={true}
        status={false}
        created_at={false}
      />

      {detailsId && (
        <SaleReturnDetails
          id={detailsId}
          openModal={detailsModal}
          hideModal={hideModal}
        />
      )}
    </GlobalUtilityStyle>
  );
};
