import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalUtilityStyle } from "../../container/Styled";
import { openEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useDeleteTransferMutation,
  useGetAllTransferQuery,
} from "../../redux/services/transfer/transferApi";
// import { usePagination } from "../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../utilities/lib/getPermission";
import { removeDeleteId } from "../../utilities/lib/signleDeleteRow";
import DeleteModal from "../Shared/Modal/DeleteModal";
import CustomTable from "../Shared/Table/CustomTable";

import { useCurrency } from "../../redux/services/pos/posSlice";
import { usePagination } from "../../utilities/hooks/usePagination";
import { showCurrency } from "../../utilities/lib/currency";
import { TransferDetails } from "./TransferDetails";
import TransferEdit from "./TransferEdit";

const TransferTable = ({
  newColumns,
  setSelectedRows,
  keyword,
  searchParams,
}) => {
  const dispatch = useDispatch();

  const [editId, setEditId] = useState(undefined);
  const currency = useSelector(useCurrency);

  const [detailsId, setDetailsId] = useState(undefined);
  const [detailsModal, setDetailsModal] = useState(false);

  const [deleteId, setDeleteId] = useState(undefined);
  const [deleteModal, setDeleteModal] = useState(false);

  const { pagination, updatePage, updatePageSize } = usePagination();

  const params = useGlobalParams({
    isDefaultParams: false,
    params: {
      ...pagination,
      ...searchParams,
      parent: 1,
    },
    keyword,
  });

  const { data, isLoading } = useGetAllTransferQuery(
    { params },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const total = data?.meta?.total;

  const [deleteTransfer, { isLoading: isDeleting }] =
    useDeleteTransferMutation();

  const handleEdit = (id) => {
    setEditId(id);
    dispatch(openEditDrawer());
  };

  const handleDetailsModal = (id) => {
    setDetailsId(id);
    setDetailsModal(true);
  };

  const handleDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    const { data } = await deleteTransfer(deleteId);
    if (data?.success) {
      setDeleteModal(false);
      removeDeleteId(setSelectedRows, deleteId);
    }
  };

  const dataSource = data?.results?.transfer?.map((transfer) => {
    const {
      id,
      reference_id,
      from_warehouses,
      to_warehouses,
      date,
      total_cost,
      total_tax,
      grand_total,
      status,
    } = transfer ?? {};

    return {
      key: id,
      id,
      reference: reference_id,
      warehouse_from: from_warehouses?.name,
      warehouse_to: to_warehouses?.name,
      date: dayjs(date).format("DD-MM-YYYY"),
      product_cost: showCurrency(total_cost, currency),
      product_tax: showCurrency(total_tax, currency),
      grand_total: showCurrency(grand_total, currency),
      status,
      handleEdit,
      handleDeleteModal,
      handleDetailsModal,
    };
  });

  const hideModal = () => {
    setDetailsModal(false);
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
        status={false}
        created_at={false}
      />

      <TransferEdit id={editId} setId={setEditId} />

      {detailsId && (
        <TransferDetails
          id={detailsId}
          openModal={detailsModal}
          hideModal={hideModal}
        />
      )}

      <DeleteModal
        deleteModal={deleteModal}
        hideModal={hideModal}
        handleDelete={handleDelete}
        isLoading={isDeleting}
      />
    </GlobalUtilityStyle>
  );
};

export default TransferTable;
