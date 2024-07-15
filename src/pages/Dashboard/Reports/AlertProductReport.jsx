import { Row } from "antd";
import { useState } from "react";
import { AlertProductTable } from "../../../components/Report/AlertProductTable";
import { WarehouseFilter } from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { rowLayout } from "../../../layout/FormLayout";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (name) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {name}
      </span>
    ),
  },
  {
    title: "SKU",
    dataIndex: "sku",
    key: "sku",
    align: "center",
    width: 100,
    render: (sku) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {sku}
      </span>
    ),
  },
  {
    title: "Minimum Qunatity",
    dataIndex: "minQty",
    key: "minQty",
    align: "center",
    width: 150,
    render: (minQty) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {minQty}
      </span>
    ),
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
    align: "center",
    width: 100,
    render: (stock, record) =>
      stock > record ? (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {stock}
        </span>
      ) : (
        <span className="text-xs font-medium md:text-sm text-red-600  dark:text-white87">
          {stock}
        </span>
      ),
  },
  {
    title: "Selling Price",
    dataIndex: "unitCost",
    key: "unitCost",
    align: "center",
    width: 100,
    render: (unitCost) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {unitCost}
      </span>
    ),
  },

  // {
  //   title: "Quantity",
  //   dataIndex: "quantity",
  //   key: "quantity",
  //   align: "center",
  //   width: 200,
  //   render: (quantity, record) => {
  //     return quantity > -1 ? (
  //       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
  //         {quantity}
  //       </span>
  //     ) : (
  //       <div className="flex gap-1 justify-center items-center">
  //         <div>
  //           <Button
  //             key={"sub"}
  //             icon={<FaMinus />}
  //             type="primary"
  //             onClick={() =>
  //               record.decrementCounter(record?.id, record.setFormValues)
  //             }
  //           />
  //         </div>
  //         <CustomQuantityInput
  //           // name={["product_list", "qty", record?.id]}
  //           noStyle={true}
  //           onChange={(value) =>
  //             record.onQuantityChange(record.id, value, record.setFormValues)
  //           }
  //           value={record?.formValues.product_list.qty?.[record?.id] ?? 0}
  //         />
  //         <div>
  //           <Button
  //             key={"add"}
  //             icon={<FaPlus />}
  //             type="primary"
  //             onClick={() =>
  //               record.incrementCounter(record?.id, record.setFormValues)
  //             }
  //             className=""
  //           />
  //         </div>
  //       </div>
  //     );
  //   },
  // },

  // {
  //   title: <MdDelete className="text-lg md:text-xl text-center w-full" />,
  //   dataIndex: "delete",
  //   key: "delete",
  //   align: "center",
  //   width: 50,
  //   fixed: "right",
  //   render: (props, record) => {
  //     return (
  //       props && (
  //         <div className="flex justify-center items-center gap-3">
  //           <button
  //             onClick={() =>
  //               record.onDelete(
  //                 record.id,
  //                 record.setProducts,
  //                 record.setFormValues
  //               )
  //             }
  //             className="primary-bg p-1 rounded-xl text-white hover:scale-110 duration-300"
  //             type="button"
  //           >
  //             <MdDelete className="text-lg md:text-xl" />
  //           </button>
  //         </div>
  //       )
  //     );
  //   },
  // },
];

const SearchComponent = () => {
  return (
    <Row {...rowLayout}>
      <WarehouseFilter name="warehouse_id" multiple={false} fullLayout={true} />
    </Row>
  );
};

export const AlertProductReport = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Alert Product Report"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      popoverWidth={400}
      searchFilterContent={<SearchComponent />}
    >
      {/* <Calendar cellRender={cellRender} /> */}
      <AlertProductTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};
