import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { GlobalUtilityStyle } from "../../container/Styled";
import { openEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useDeleteAnnouncementMutation,
  useGetAllAnnouncementQuery,
} from "../../redux/services/hrm/announcement/announcementApi";
import { usePagination } from "../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../utilities/lib/getPermission";
import { removeDeleteId } from "../../utilities/lib/signleDeleteRow";
import DeleteModal from "../Shared/Modal/DeleteModal";
import CustomTable from "../Shared/Table/CustomTable";
import { AnnouncementDetails } from "./AnnouncementDetails";
import { AnnouncementEdit } from "./AnnouncementEdit";

export const AnnouncementTable = ({
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
    isRelationalParams: true,
    params: { ...pagination, ...searchParams },
    keyword,
  });

  const { data, isLoading } = useGetAllAnnouncementQuery(
    { params },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const total = data?.meta?.total;

  const [deleteAnnouncement, { isLoading: isDeleting }] =
    useDeleteAnnouncementMutation();

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
    const { data } = await deleteAnnouncement(deleteId);
    if (data?.success) {
      setDeleteModal(false);
      removeDeleteId(setSelectedRows, deleteId);
    }
  };

  const dataSource =
    data?.results?.announcement?.map((item) => {
      //console.log(item);
      const { id, start_date, end_date, description, title, departments } =
        item ?? {};
      const startDate = dayjs(start_date).format("DD-MM-YYYY");
      const endDate = dayjs(end_date).format("DD-MM-YYYY");

      console.log(departments);

      return {
        id,
        name: title,
        startDate,
        endDate,
        description,
        handleEdit,
        handleDetailsModal,
        handleDeleteModal,
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

      <AnnouncementEdit id={editId} setId={setEditId} />

      {detailsId && (
        <AnnouncementDetails
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
        item={"announcement"}
      />
    </GlobalUtilityStyle>
  );
};
