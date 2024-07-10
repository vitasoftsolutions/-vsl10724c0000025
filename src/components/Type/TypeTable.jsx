import dayjs from "dayjs";
import { useState } from "react";
import { GlobalUtilityStyle } from "../../container/Styled";
import {
  useDeleteTypeMutation,
  useGetTypesQuery,
} from "../../redux/services/types/typesApi";
import { usePagination } from "../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import { removeDeleteId } from "../../utilities/lib/signleDeleteRow";
import DeleteModal from "../Shared/Modal/DeleteModal";
import CustomTable from "../Shared/Table/CustomTable";

const TypeTable = ({ newColumns, setSelectedRows, keyword, searchParams }) => {
  const [deleteId, setDeleteId] = useState(undefined);
  const [deleteModal, setDeleteModal] = useState(false);

  const { pagination, updatePage, updatePageSize } = usePagination();

  const params = useGlobalParams({
    isDefaultParams: false,
    pparams: { ...pagination, ...searchParams },
    keyword,
  });

  const { data, isLoading } = useGetTypesQuery({ params });

  const total = data?.meta?.total;

  const [deleteType, { isLoading: isDeleting }] = useDeleteTypeMutation();

  const handleDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    const { data } = await deleteType(deleteId);
    if (data?.success) {
      setDeleteModal(false);
      removeDeleteId(setSelectedRows, deleteId);
    }
  };

  const dataSource =
    data?.results?.type?.map((item) => {
      const { id, name, created_at } = item;
      const date = dayjs(created_at).format("DD-MM-YYYY");

      return {
        id,
        name: name,
        created_at: date,
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
        action={false}
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

export default TypeTable;
