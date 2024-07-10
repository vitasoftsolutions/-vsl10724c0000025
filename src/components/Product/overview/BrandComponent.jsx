import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useGetBrandsQuery } from "../../../redux/services/brand/brandApi";
import BrandCreate from "../../Brand/BrandCreate";
import { CustomSelectButton } from "../../Shared/Select/CustomSelectButton";

export const BrandComponent = () => {
  const [isSubDrawerOpen, setIsSubDrawerOpen] = useState(false);

  const { data, isLoading } = useGetBrandsQuery({
    params: {
      selectValue: ["id", "name"],
    },
  });
  const options = data?.results?.brand?.map((item) => {
    return {
      value: item.id?.toString(),
      label: item.name,
    };
  });

  const handleOpenSubDrawer = () => {
    setIsSubDrawerOpen(true);
  };

  const handleCloseSubDrawer = () => {
    setIsSubDrawerOpen(false);
  };

  return (
    <>
      <CustomSelectButton
        label="Brand"
        showSearch={true}
        options={options}
        icon={<FaPlus className="text-xl" />}
        onClick={handleOpenSubDrawer}
        name={"brand_id"}
        isLoading={isLoading}
        required={"true"}
      />

      <BrandCreate
        subDrawer={true}
        isSubDrawerOpen={isSubDrawerOpen}
        handleCloseSubDrawer={handleCloseSubDrawer}
      />
    </>
  );
};
