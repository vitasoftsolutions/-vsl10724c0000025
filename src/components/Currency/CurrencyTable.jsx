import dayjs from "dayjs";
import { useState } from "react";
import { GlobalUtilityStyle } from "../../container/Styled";
import {
  useDeleteCurrencyMutation,
  useGetAllCurrencyQuery,
  useUpdateCurrencyDefaultMutation,
} from "../../redux/services/currency/currencyApi";
import { usePagination } from "../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../utilities/lib/getPermission";
import { removeDeleteId } from "../../utilities/lib/signleDeleteRow";
import DeleteModal from "../Shared/Modal/DeleteModal";
import StatusModal from "../Shared/Modal/StatusModal";
import CustomTable from "../Shared/Table/CustomTable";

const CurrencyTable = ({
  newColumns,
  setSelectedRows,
  keyword,
  searchParams,
}) => {
  const [statusId, setStatusId] = useState(undefined);
  const [statusModal, setStatusModal] = useState(false);

  const [deleteId, setDeleteId] = useState(undefined);
  const [deleteModal, setDeleteModal] = useState(false);

  const { pagination, updatePage, updatePageSize } = usePagination();

  const params = useGlobalParams({
    isDefaultParams: false,
    params: { ...pagination, ...searchParams },
    keyword,
  });

  const { data, isLoading } = useGetAllCurrencyQuery(
    { params },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const total = data?.meta?.total;

  const [updateCurrencyDefault, { isLoading: isStatusUpdating }] =
    useUpdateCurrencyDefaultMutation();

  const [deleteCurrency, { isLoading: isDeleting }] =
    useDeleteCurrencyMutation();

  const handleStatusModal = (id) => {
    setStatusId(id);
    setStatusModal(true);
  };

  const handleStatus = async () => {
    const { data } = await updateCurrencyDefault(statusId);
    if (data?.success) {
      setStatusId(undefined);
      setStatusModal(false);
    }
  };

  const handleDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    const { data } = await deleteCurrency(deleteId);
    if (data?.success) {
      setDeleteModal(false);
      removeDeleteId(setSelectedRows, deleteId);
    }
  };

  const dataSource =
    data?.results?.currency?.map((item) => {
      const { id, name, created_at, is_default, code, exchange_rate } = item;
      const date = dayjs(created_at).format("DD-MM-YYYY");

      return {
        id,
        name: name,
        code: code,
        exchangeRate: exchange_rate,
        status: is_default,
        handleStatusModal,
        created_at: date,
        handleDeleteModal,
      };
    }) ?? [];

  const hideModal = () => {
    setStatusModal(false);
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
      />

      <StatusModal
        text="Do you want to change this currency default?"
        statusModal={statusModal}
        hideModal={hideModal}
        handleStatus={handleStatus}
        isLoading={isStatusUpdating}
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

export default CurrencyTable;
