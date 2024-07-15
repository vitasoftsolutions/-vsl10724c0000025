import { Button, theme } from "antd";
import { useState } from "react";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { Brands } from "./Brand/Brands";
import { Categories } from "./Categories/Categories";

const CategoryFilterComponent = ({ setParams, color }) => {
  const [isFilterDraweropen, setIsFilterDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setIsFilterDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsFilterDrawerOpen(false);
  };

  const [isSelected, setIsSelected] = useState([]);

  const handleCardSelect = (id) => {
    if (isSelected.includes(id)) {
      setIsSelected(isSelected.filter((item) => item !== id));
    } else {
      setIsSelected([...isSelected, id]);
    }
  };

  const handleSubmit = async () => {
    // console.log(isSelected);
    setParams({ category_ids: isSelected });
    handleCloseDrawer();
  };

  return (
    <>
      <Button type="primary" className="w-full" onClick={handleOpenDrawer}>
        Category
      </Button>

      <CustomDrawer
        title={"Choose Category"}
        open={isFilterDraweropen}
        onClose={handleCloseDrawer}
        width={1400}
      >
        <Categories
          color={color}
          handleSubmit={handleSubmit}
          isSelected={isSelected}
          handleCardSelect={handleCardSelect}
          onClose={handleCloseDrawer}
        />
      </CustomDrawer>
    </>
  );
};

const BrandFilterComponent = ({ setParams, color }) => {
  const [isFilterDraweropen, setIsFilterDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setIsFilterDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsFilterDrawerOpen(false);
  };

  const [isSelected, setIsSelected] = useState([]);

  const handleCardSelect = (id) => {
    if (isSelected.includes(id)) {
      setIsSelected(isSelected.filter((item) => item !== id));
    } else {
      setIsSelected([...isSelected, id]);
    }
  };

  const handleSubmit = async () => {
    setParams({ brand_ids: isSelected });

    handleCloseDrawer();
  };

  return (
    <>
      <Button type="primary" className="w-full" onClick={handleOpenDrawer}>
        Brand
      </Button>

      <CustomDrawer
        title={"Choose Brand"}
        open={isFilterDraweropen}
        width={1400}
        onClose={handleCloseDrawer}
      >
        <Brands
          color={color}
          handleSubmit={handleSubmit}
          isSelected={isSelected}
          handleCardSelect={handleCardSelect}
          onClose={handleCloseDrawer}
        />
      </CustomDrawer>
    </>
  );
};

const PosFilterComponent = ({ setParams }) => {
  const { token } = theme.useToken();

  const color = token.colorPrimary;

  return (
    <div className="grid grid-cols-2 gap-3 px-4 pt-5">
      <CategoryFilterComponent setParams={setParams} color={color} />
      <BrandFilterComponent setParams={setParams} color={color} />
    </div>
  );
};

export default PosFilterComponent;
