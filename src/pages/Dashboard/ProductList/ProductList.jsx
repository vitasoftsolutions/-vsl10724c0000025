import { Row } from "antd";
import { useState } from "react";
import defaultUser from "../../../assets/data/defaultUserImage";
import ProductCreate from "../../../components/Product/ProductCreate";
import ProductTable from "../../../components/Product/ProductTable";
import {
  BarcodeFilter,
  BrandFilter,
  CategoryFilter,
  ProductTypeFilter,
  ProductUnitFilter,
  PurchaseUnitFilter,
  SaleUnitFilter,
  TaxFilter,
  WarehouseFilter,
} from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { rowLayout } from "../../../layout/FormLayout";
import { PRODUCT } from "../../../utilities/apiEndpoints/inventory.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
    title: "Img",
    dataIndex: "image",
    key: "image",
    fixed: "left",
    align: "center",
    width: 70,
    render: (img) => (
      <div className="w-8 h-8 rounded-md overflow-hidden mx-auto">
        <img
          src={img ?? defaultUser}
          alt="defaultUser"
          className="w-full h-full object-cover"
        />
      </div>
    ),
  },
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
    render: (sku) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {sku}
      </span>
    ),
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    align: "center",
    render: (type) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {type}
      </span>
    ),
  },
  {
    title: "Brand",
    dataIndex: "brand",
    key: "brand",
    render: (brand) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {brand ?? "N/A"}
      </span>
    ),
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    render: (category) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {category ?? "N/A"}
      </span>
    ),
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    align: "center",
    render: (quantity) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {quantity}
      </span>
    ),
  },

  {
    title: "Buying Cost",
    dataIndex: "cost",
    key: "cost",
    render: (cost) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {cost}
      </span>
    ),
  },
  {
    title: "Selling Price",
    dataIndex: "price",
    key: "price",
    render: (price) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {price}
      </span>
    ),
  },
];

const SearchComponent = () => {
  return (
    <Row {...rowLayout}>
      <ProductTypeFilter />
      <WarehouseFilter name="product_warehouse_ids" />
      <BarcodeFilter />
      <BrandFilter />
      <CategoryFilter />
      <ProductUnitFilter />
      <PurchaseUnitFilter />
      <SaleUnitFilter />
      <TaxFilter />
    </Row>
  );
};

const ProductList = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Product"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      searchFilterContent={<SearchComponent />}
      api={PRODUCT}
    >
      <ProductCreate />

      <ProductTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};

export default ProductList;
