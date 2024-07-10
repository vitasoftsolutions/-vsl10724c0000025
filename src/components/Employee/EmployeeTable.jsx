import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { GlobalUtilityStyle } from "../../container/Styled";
import { openEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useDeleteEmployeeMutation,
  useGetAllEmployeeQuery,
  useUpdateEmployeeStatusMutation,
} from "../../redux/services/hrm/employee/employeeApi";
import { usePagination } from "../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../utilities/lib/getPermission";
import { removeDeleteId } from "../../utilities/lib/signleDeleteRow";
import DeleteModal from "../Shared/Modal/DeleteModal";
import StatusModal from "../Shared/Modal/StatusModal";
import CustomTable from "../Shared/Table/CustomTable";
import EmployeeEdit from "./EmployeeEdit";

const EmployeeTable = ({
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
    params: { ...pagination, ...searchParams },
    keyword,
  });

  const { data, isLoading } = useGetAllEmployeeQuery(
    { params },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const total = data?.meta?.total;

  const [updateStatus, { isLoading: isStatusUpdating }] =
    useUpdateEmployeeStatusMutation();

  const [deleteEmployee, { isLoading: isDeleting }] =
    useDeleteEmployeeMutation();

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
    const { data } = await deleteEmployee(deleteId);
    if (data?.success) {
      setDeleteModal(false);
      removeDeleteId(setSelectedRows, deleteId);
    }
  };

  const dataSource =
    data?.results?.employee?.map((item) => {
      const { id, name, email, join_date, address, phone_number } = item;
      const date = dayjs(join_date).format("DD-MM-YYYY");

      return {
        id,
        name,
        email,
        address,
        phone: phone_number,
        handleStatusModal,
        join_date: date,
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
        status={false}
        created_at={false}
      />

      <EmployeeEdit id={editId} setId={setEditId} />

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
        item={"employee"}
      />
    </GlobalUtilityStyle>
  );
};

export default EmployeeTable;
