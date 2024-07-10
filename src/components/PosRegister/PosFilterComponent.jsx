import { Button } from "antd";
import { useState } from "react";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { Brands } from "./Brand/Brands";
import { Categories } from "./Categories/Categories";
// import CustomDrawer from "../Shared/Drawer/CustomDrawer";
// import { Categories } from "./Categories/Categories";
// import { Brands } from "./Brand/Brands";

const CategoryFilterComponent = ({ setParams }) => {
  const [isFilterDraweropen, setIsFilterDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setIsFilterDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsFilterDrawerOpen(false);
  };

  const handleSubmit = async (values) => {
    // const params = {
    //   ...pagination,
    //   ...values,
    // };
    // setPagination(params);

    const category_ids = Object.keys(values).map((key) => {
      if (values[key]) {
        return key;
      }
    });

    setParams({ category_ids });

    handleCloseDrawer();
  };

  return (
    <>
      <Button
        type="primary"
        // size="large"
        className="w-full"
        onClick={handleOpenDrawer}
      >
        Category
      </Button>

      <CustomDrawer
        title={"Choose Category"}
        open={isFilterDraweropen}
        onClose={handleCloseDrawer}
      >
        <Categories handleSubmit={handleSubmit} onClose={handleCloseDrawer} />
      </CustomDrawer>
    </>
  );
};

const BrandFilterComponent = ({ setParams }) => {
  const [isFilterDraweropen, setIsFilterDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setIsFilterDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsFilterDrawerOpen(false);
  };

  const handleSubmit = async (values) => {
    const brand_ids = Object.keys(values).map((key) => {
      if (values[key]) {
        return key;
      }
    });

    setParams({ brand_ids });

    handleCloseDrawer();
  };

  return (
    <>
      <Button
        type="primary"
        // size="large"
        className="w-full"
        onClick={handleOpenDrawer}
      >
        Brand
      </Button>

      <CustomDrawer
        title={"Choose Brand"}
        open={isFilterDraweropen}
        onClose={handleCloseDrawer}
      >
        <Brands handleSubmit={handleSubmit} onClose={handleCloseDrawer} />
      </CustomDrawer>
    </>
  );
};

const PosFilterComponent = ({ setParams }) => {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 pt-5">
      <CategoryFilterComponent setParams={setParams} />

      <BrandFilterComponent setParams={setParams} />
    </div>
  );
};

export default PosFilterComponent;
