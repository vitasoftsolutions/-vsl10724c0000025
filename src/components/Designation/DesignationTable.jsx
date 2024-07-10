import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { GlobalUtilityStyle } from "../../container/Styled";
import { openEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useDeleteDesignationMutation,
  useGetAllDesignationQuery,
  useUpdateDesignationStatusMutation,
} from "../../redux/services/hrm/designation/designationApi";
import { usePagination } from "../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../utilities/lib/getPermission";
import { removeDeleteId } from "../../utilities/lib/signleDeleteRow";
import DeleteModal from "../Shared/Modal/DeleteModal";
import StatusModal from "../Shared/Modal/StatusModal";
import CustomTable from "../Shared/Table/CustomTable";
import { DesignationEdit } from "./DesignationEdit";

export const DesignationTable = ({
  newColumns,
  setSelectedRows,
  keyword,
  searchParams,
}) => {
  const dispatch = useDispatch();

  const [editId, setEditId] = useState(undefined);

  const [statusId, setStatusId] = useState(undefined);
  const [statusModal, setStatusModal] = useState(false);

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

  const { data, isLoading } = useGetAllDesignationQuery(
    { params },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const total = data?.meta?.total;

  const [updateStatus, { isLoading: isStatusUpdating }] =
    useUpdateDesignationStatusMutation();

  const [deleteDesignation, { isLoading: isDeleting }] =
    useDeleteDesignationMutation();

  const handleEdit = (id) => {
    setEditId(id);
    dispatch(openEditDrawer());
  };

  const handleStatusModal = (id) => {
    setStatusId(id);
    setStatusModal(true);
  };

  const handleStatus = async () => {
    const { data } = await updateStatus(statusId);

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
    const { data } = await deleteDesignation(deleteId);
    if (data?.success) {
      setDeleteModal(false);
      removeDeleteId(setSelectedRows, deleteId);
    }
  };

  const dataSource =
    data?.results?.designation?.map((item) => {
      const { id, name, departments, created_at, is_active } = item ?? {};
      const date = dayjs(created_at).format("DD-MM-YYYY");

      return {
        id,
        name: name,
        department: departments?.name,
        created_at: date,

        status: is_active,
        handleStatusModal,
        handleEdit,
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

      <DesignationEdit id={editId} setId={setEditId} />

      <StatusModal
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
        item={"brand"}
      />
    </GlobalUtilityStyle>
  );
};
