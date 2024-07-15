import { useSelector } from "react-redux";
import { GlobalUtilityStyle } from "../../container/Styled";
import { useGetAlertReportQuery } from "../../redux/services/reports/summaryApi";
import { usePagination } from "../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../utilities/hooks/useParams";
import CustomTable from "../Shared/Table/CustomTable";
import { useCurrentUser } from "../../redux/services/auth/authSlice";
import { useCurrency } from "../../redux/services/pos/posSlice";
import { showCurrency } from "../../utilities/lib/currency";

export const AlertProductTable = ({
  newColumns,
  setSelectedRows,
  keyword,
  searchParams,
}) => {
  const { pagination, updatePage, updatePageSize } = usePagination();

  const user = useSelector(useCurrentUser);
  const warehouseId = user?.warehouse_id;

  const params = useGlobalParams({
    isDefaultParams: false,
    params: {
      ...pagination,
      ...(Object.keys(searchParams).length
        ? searchParams
        : { warehouse_id: warehouseId }),
      need_qty: 1,
      need_price: 1,
    },
    keyword,
  });

  const { data, isLoading } = useGetAlertReportQuery(
    { params },
    {
      //   skip: !useUrlIndexPermission(),
    }
  );

  const total = data?.meta?.total;

  const currency = useSelector(useCurrency);

  const dataSource =
    data?.results?.product?.map((item) => {
      const {
        id,
        name,
        alert_qty,
        sku,
        product_qties,
        product_prices,
        selling_price: unit_cost,
      } = item ?? {};
      //   const date = dayjs(created_at).format("DD-MM-YYYY");

      return {
        id,
        name,
        sku,
        minQty: alert_qty,
        stock: product_qties?.[0]?.qty,
        unitCost: product_prices?.length
          ? showCurrency(product_prices?.[0]?.selling_price, currency)
          : showCurrency(unit_cost, currency),
      };
    }) ?? [];

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
        status={false}
        action={false}
        created_at={false}

        // isRowSelection={true}
      />

      {/* <BrandEdit id={editId} setId={setEditId} />

  {detailsId && (
    <BrandDetails
      id={detailsId}
      openModal={detailsModal}
      hideModal={hideModal}
    />
  )}

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
