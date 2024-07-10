import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { GlobalUtilityStyle } from "../../container/Styled";
import { openEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useDeleteLeaveTypeMutation,
  useGetAllLeaveTypeQuery,
} from "../../redux/services/settings/leaveType/leaveTypeApi";
import { usePagination } from "../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../utilities/lib/getPermission";
import { removeDeleteId } from "../../utilities/lib/signleDeleteRow";
import DeleteModal from "../Shared/Modal/DeleteModal";
import CustomTable from "../Shared/Table/CustomTable";

import { LeaveTypeEdit } from "./LeaveTypeEdit";

export const LeaveTypeTable = ({
  newColumns,
  setSelectedRows,
  keyword,
  searchParams,
}) => {
  const dispatch = useDispatch();

  const [editId, setEditId] = useState(undefined);

  const [deleteId, setDeleteId] = useState(undefined);
  const [deleteModal, setDeleteModal] = useState(false);

  const { pagination, updatePage, updatePageSize } = usePagination();

  const params = useGlobalParams({
    isDefaultParams: false,
    params: { ...pagination, ...searchParams },
    keyword,
  });

  const { data, isLoading } = useGetAllLeaveTypeQuery(
    {
      params,
    },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const total = data?.meta?.total;

  const [deleteBrand, { isLoading: isDeleting }] = useDeleteLeaveTypeMutation();

  const handleEdit = (id) => {
    setEditId(id);
    dispatch(openEditDrawer());
  };

  const handleDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    const { data } = await deleteBrand(deleteId);
    if (data?.success) {
      setDeleteModal(false);
      removeDeleteId(setSelectedRows, deleteId);
    }
  };

  const dataSource =
    data?.results?.leavetype?.map((item) => {
      const { id, name, created_at, need_attachment } = item ?? {};
      const date = dayjs(created_at).format("DD-MM-YYYY");

      return {
        id,
        name,
        attachmentable: need_attachment,
        created_at: date,
        handleEdit,
        handleDeleteModal,
      };
    }) ?? [];

  const hideModal = () => {
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
      />

      <LeaveTypeEdit id={editId} setId={setEditId} />

      <DeleteModal
        deleteModal={deleteModal}
        hideModal={hideModal}
        handleDelete={handleDelete}
        isLoading={isDeleting}
        item={"leave-type"}
      />
    </GlobalUtilityStyle>
  );
};
