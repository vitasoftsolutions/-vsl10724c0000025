import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ExpenseDetails } from "../../../../components/Expense/ExpenseDetails";
import CustomTable from "../../../../components/Shared/Table/CustomTable";
import { GlobalUtilityStyle } from "../../../../container/Styled";
import { useGetAllExpenseQuery } from "../../../../redux/services/expense/expenseApi";
import { useCurrency } from "../../../../redux/services/pos/posSlice";
import { usePagination } from "../../../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../../../utilities/hooks/useParams";
import { showCurrency } from "../../../../utilities/lib/currency";
import { useUrlIndexPermission } from "../../../../utilities/lib/getPermission";
import { columns } from "../data/Expense";

export const ExpenseTable = ({ keyword, summaryType, summary }) => {
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

  const { data, isLoading } = useGetAllExpenseQuery(
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
    data?.results?.expense?.map((item) => {
      const {
        id,
        name,
        created_at,
        reference_id,
        warehouses,
        expense_categories,
        amount,
        reason,
      } = item ?? {};
      const date = dayjs(created_at).format("DD-MM-YYYY");

      return {
        id,
        reference: reference_id,
        warehouse: warehouses?.name,
        category: expense_categories?.name,
        amount: showCurrency(amount, currency),
        note: reason,
        name: name,
        created_at: date,
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
      />

      {detailsId && (
        <ExpenseDetails
          id={detailsId}
          openModal={detailsModal}
          hideModal={hideModal}
        />
      )}
    </GlobalUtilityStyle>
  );
};
