import { useState } from "react";
import { useDispatch } from "react-redux";
import { GlobalUtilityStyle } from "../../container/Styled";
import { openEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useDeleteLeaveMutation,
  useGetAllLeaveQuery,
} from "../../redux/services/hrm/leave/leaveApi";
import { usePagination } from "../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../utilities/lib/getPermission";
import { removeDeleteId } from "../../utilities/lib/signleDeleteRow";
import DeleteModal from "../Shared/Modal/DeleteModal";
import CustomTable from "../Shared/Table/CustomTable";

import { LeaveDetails } from "./LeaveDetails";
import { LeaveEdit } from "./LeaveEdit";

function calculateLeaveDays(leaveStartDate, leaveEndDate) {
  const startDate = new Date(leaveStartDate);
  const endDate = new Date(leaveEndDate);

  const timeDifference = endDate.getTime() - startDate.getTime();

  const dayDifference = timeDifference / (1000 * 3600 * 24);

  if (dayDifference === 0) {
    return "half day";
  }

  return dayDifference + " Days";
}

export const LeaveTable = ({
  newColumns,
  setSelectedRows,
  keyword,
  searchParams,
}) => {
  const dispatch = useDispatch();

  const [editId, setEditId] = useState(undefined);

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
      child: 1,
    },
    keyword,
  });

  const { data, isLoading } = useGetAllLeaveQuery(
    { params },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  console.log(data);
  const total = data?.meta?.total;

  const [deleteLeave, { isLoading: isDeleting }] = useDeleteLeaveMutation();

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
    const { data } = await deleteLeave(deleteId);
    if (data?.success) {
      setDeleteModal(false);
      removeDeleteId(setSelectedRows, deleteId);
    }
  };

  const dataSource =
    data?.results?.leave?.map((item) => {
      //console.log(item);
      const {
        id,

        // created_at,

        leave_start_date,
        leave_end_date,
        leave_duration,
        users,
      } = item ?? {};

      // const date = dayjs(created_at).format("DD-MM-YYYY");

      return {
        id,
        // name: users?.employees?.name,
        leaveDuration: leave_duration,
        days: calculateLeaveDays(leave_start_date, leave_end_date),
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

      <LeaveEdit id={editId} setId={setEditId} />

      {detailsId && (
        <LeaveDetails
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
        item={"brand"}
      />
    </GlobalUtilityStyle>
  );
};
