import PosFilterComponent from "../../../components/PosRegister/PosFilterComponent";
import { useFilterParams } from "../../../utilities/hooks/useParams";
import PosProducts from "./PosProducts";

export const Filter = ({
  products,
  setProducts,
  setFormValues,
  setProductUnits,
  posForm,
}) => {
  const { searchParams, setParams } = useFilterParams();

  return (
    <div className="flex grow ">
      <div className="flex flex-col w-full ">
        <div>
          <PosFilterComponent setParams={setParams} />
        </div>
        <div
          style={{
            borderRadius: "8px",
          }}
          className="shadow-md grow m-4 bg-gray-200 "
        >
          <PosProducts
            products={products}
            setProducts={setProducts}
            setFormValues={setFormValues}
            setProductUnits={setProductUnits}
            form={posForm}
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
};
