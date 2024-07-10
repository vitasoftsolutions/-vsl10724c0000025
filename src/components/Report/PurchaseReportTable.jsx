import { useDispatch, useSelector } from "react-redux";
import { selectPagination } from "../../redux/services/pagination/paginationSlice";
import { GlobalUtilityStyle } from "../../container/Styled";
import CustomTable from "../Shared/Table/CustomTable";

import { usePagination } from "../../utilities/hooks/usePagination";

export const PurchaseReportTable = ({
  newColumns,
  setSelectedRows,
  keyword,
  searchParams,
}) => {
  const dispatch = useDispatch();

  //   const [editId, setEditId] = useState(undefined);

  //   const [statusId, setStatusId] = useState(undefined);
  //   const [statusModal, setStatusModal] = useState(false);

  //   const [deleteId, setDeleteId] = useState(undefined);
  //   const [deleteModal, setDeleteModal] = useState(false);

  const { pagination, updatePage, updatePageSize } = usePagination();

  //   const { data, isLoading } = useGetBrandsQuery({
  //     params: pagination,
  //   });

  //   const total = data?.meta?.total;

  //   const [updateStatus, { isLoading: isStatusUpdating }] =
  //     useUpdateBrandStatusMutation();

  //   const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

  //   const handleEdit = (id) => {
  //     setEditId(id);
  //     dispatch(openEditDrawer());
  //   };

  //   const handleStatusModal = (id) => {
  //     setStatusId(id);
  //     setStatusModal(true);
  //   };

  //   const handleStatus = async () => {
  //     const { data } = await updateStatus(statusId);

  //     if (data?.success) {
  //       setStatusId(undefined);
  //       setStatusModal(false);
  //     }
  //   };

  //   const handleDeleteModal = (id) => {
  //     setDeleteId(id);
  //     setDeleteModal(true);
  //   };

  //   const handleDelete = async () => {
  //     const { data } = await deleteBrand(deleteId);
  //     if (data?.success) {
  //       setDeleteModal(false);
  //     }
  //   };

  //   const dataSource =
  //     data?.results?.brand?.map((item) => {
  //       const { id, name, created_at, attachments, is_active } = item ?? {};
  //       const date = dayjs(created_at).format("DD-MM-YYYY");

  //       return {
  //         id,
  //         brand: name,
  //         image: attachments?.[0]?.url,
  //         created_at: date,

  //         status: is_active,
  //         handleStatusModal,
  //         handleEdit,
  //         handleDeleteModal,
  //       };
  //     }) ?? [];

  //   const hideModal = () => {
  //     setStatusModal(false);
  //     setDeleteModal(false);
  //   };

  return (
    <GlobalUtilityStyle>
      <CustomTable
        columns={newColumns}
        // dataSource={dataSource}
        // total={total}

        pagination={pagination}
        updatePage={updatePage}
        updatePageSize={updatePageSize}
        // isLoading={isLoading}
        setSelectedRows={setSelectedRows}
        isRowSelection={true}
        status={false}
        created_at={false}
        action={false}
      />

      {/* <BrandEdit id={editId} setId={setEditId} />

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
      /> */}
    </GlobalUtilityStyle>
  );
};
