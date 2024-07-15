import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { GlobalUtilityStyle } from "../../container/Styled";
import {
  useDeletePettyCashMutation,
  useGetAllPettyCashQuery,
} from "../../redux/services/pettycash/pettyCashApi";
import { useCurrency } from "../../redux/services/pos/posSlice";
import { usePagination } from "../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import { showCurrency } from "../../utilities/lib/currency";
import { removeDeleteId } from "../../utilities/lib/signleDeleteRow";
import DeleteModal from "../Shared/Modal/DeleteModal";
import CustomTable from "../Shared/Table/CustomTable";

export const PettyCashTable = ({
  newColumns,
  setSelectedRows,
  keyword,
  searchParams,
}) => {
  const [deleteId, setDeleteId] = useState(undefined);
  const [deleteModal, setDeleteModal] = useState(false);

  const { pagination, updatePage, updatePageSize } = usePagination();

  const params = useGlobalParams({
    isDefaultParams: false,
    params: { ...pagination, ...searchParams, parent: 1 },
    keyword,
  });

  const { data, isLoading } = useGetAllPettyCashQuery({
    params,
  });

  const total = data?.meta?.total;

  const [deletePettyCash, { isLoading: isDeleting }] =
    useDeletePettyCashMutation();

  const handleDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    const { data } = await deletePettyCash(deleteId);
    if (data?.success) {
      setDeleteModal(false);
      removeDeleteId(setSelectedRows, deleteId);
    }
  };

  const currency = useSelector(useCurrency);

  const dataSource =
    data?.results?.pettycash?.map((item) => {
      const {
        id,
        created_at,
        reference_id,
        warehouses,
        opening_balance,
        status,
      } = item ?? {};
      const date = dayjs(created_at).format("DD-MM-YYYY");

      return {
        id,
        reference_id,
        open_at: date,
        closes_at: status === "Open" ? "N/A" : date,
        warehouse: warehouses?.name,
        cash_in_hand: showCurrency(opening_balance, currency),
        status: status === "Open" ? 1 : 0,
        handleDeleteModal,
      };
    }) ?? [];

  const hideModal = () => {
    // setStatusModal(false);
    setDeleteModal(false);
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
        isLoading={isLoading}
        isRowSelection={true}
        created_at={false}
      />

      <DeleteModal
        deleteModal={deleteModal}
        hideModal={hideModal}
        handleDelete={handleDelete}
        isLoading={isDeleting}
      />
    </GlobalUtilityStyle>
  );
};
