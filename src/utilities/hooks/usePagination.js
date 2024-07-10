import { useState } from "react";

export const usePagination = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    allData: 1, // Assuming this is a placeholder value
  });

  const updatePage = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const updatePageSize = (newPageSize) => {
    setPagination((prev) => ({ ...prev, perPage: newPageSize }));
  };

  return {
    pagination,
    updatePage,
    updatePageSize,
  };

  // return useSelector(selectPagination);
};
