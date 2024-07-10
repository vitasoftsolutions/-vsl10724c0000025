import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useGetAllCategoryQuery } from "../../../redux/services/category/categoryApi";
import CategoryCreate from "../../Category/CategoryCreate";
import { CustomSelectButton } from "../../Shared/Select/CustomSelectButton";

export const CategoryComponent = () => {
  const [isSubDrawerOpen, setIsSubDrawerOpen] = useState(false);

  const { data, isLoading } = useGetAllCategoryQuery({
    params: {
      selectValue: ["id", "name"],
    },
  });
  const options = data?.results?.category?.map((item) => {
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
        label="Category"
        showSearch={true}
        required={true}
        options={options}
        icon={<FaPlus className="text-xl" />}
        onClick={handleOpenSubDrawer}
        name={"category_id"}
        isLoading={isLoading}
      />

      <CategoryCreate
        subDrawer={true}
        isSubDrawerOpen={isSubDrawerOpen}
        handleCloseSubDrawer={handleCloseSubDrawer}
      />
    </>
  );
};
