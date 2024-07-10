import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalUtilityStyle } from "../../container/Styled";
import { openEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useDeletePurchaseReturnMutation,
  useGetAllPurchaseReturnQuery,
} from "../../redux/services/return/purchaseReturnApi";
import { usePagination } from "../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../utilities/lib/getPermission";
import { removeDeleteId } from "../../utilities/lib/signleDeleteRow";
import DeleteModal from "../Shared/Modal/DeleteModal";
import CustomTable from "../Shared/Table/CustomTable";

import { useCurrency } from "../../redux/services/pos/posSlice";
import { showCurrency } from "../../utilities/lib/currency";
import { PurchaseReturnDetails } from "./PurchaseReturnDetails";
import PurchaseReturnEdit from "./PurchaseReturnEdit";

const PurchaseReturnTable = ({
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
    isRelationalParams: true,
    params: { ...pagination, ...searchParams },
    keyword,
  });

  const { data, isLoading } = useGetAllPurchaseReturnQuery(
    { params },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const total = data?.meta?.total;

  const [deletePurchaseReturn, { isLoading: isDeleting }] =
    useDeletePurchaseReturnMutation();

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
    const { data } = await deletePurchaseReturn(deleteId);
    if (data?.success) {
      setDeleteModal(false);
      removeDeleteId(setSelectedRows, deleteId);
    }
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

      console.log(item);
      const date = dayjs(purchase_return_at).format("DD-MM-YYYY");

      return {
        id,
        referenceNo: reference_id,
        warehouse: warehouses?.name,
        supplier: suppliers?.name,
        Date: date,
        grandTotal: showCurrency(grand_total ?? 0, currency),
        handleEdit,
        handleDeleteModal,
        handleDetailsModal,
      };
    }) ?? [];

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

      <PurchaseReturnEdit id={editId} setId={setEditId} />

      {detailsId && (
        <PurchaseReturnDetails
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

export default PurchaseReturnTable;
