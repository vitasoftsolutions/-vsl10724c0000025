import { useState } from "react";
import { useDispatch } from "react-redux";
import { GlobalUtilityStyle } from "../../container/Styled";
import { openEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useDeleteAttendenceMutation,
  useGetAllAttendenceQuery,
} from "../../redux/services/hrm/attendence/attendenceApi";
import { usePagination } from "../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../utilities/lib/getPermission";
import { removeDeleteId } from "../../utilities/lib/signleDeleteRow";
import DeleteModal from "../Shared/Modal/DeleteModal";
import CustomTable from "../Shared/Table/CustomTable";
import { AttendanceEdit } from "./AttendanceEdit";

export const AttendanceTable = ({
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
    isRelationalParams: true,
    params: {
      ...pagination,
      ...searchParams,
      // parent: 1,
    },
    keyword,
  });
  const { data, isLoading } = useGetAllAttendenceQuery(
    { params },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const total = data?.meta?.total;

  const [deleteAttendence, { isLoading: isDeleting }] =
    useDeleteAttendenceMutation();

  const handleEdit = (id) => {
    setEditId(id);
    dispatch(openEditDrawer());
  };

  const handleDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    const { data } = await deleteAttendence(deleteId);
    if (data?.success) {
      setDeleteModal(false);
      removeDeleteId(setSelectedRows, deleteId);
    }
  };

  function convertToAmPm(time) {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    return `${adjustedHours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")} ${period}`;
  }

  const dataSource =
    data?.results?.attendance?.map((item) => {
      console.log(item);
      const { id, name, email, attachments, date, check_in, check_out } =
        item ?? {};
      // const date = dayjs(created_at).format("DD-MM-YYYY");

      return {
        id,
        name,
        email,
        image: attachments?.[0]?.url,
        date: date,
        checkIn: convertToAmPm(check_in),
        checkOut: convertToAmPm(check_out),

        // status: is_active,
        // handleStatusModal,
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
        created_at={false}
      />

      <AttendanceEdit id={editId} setId={setEditId} />

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
