export const updateProductList = (values, product_list) => {
  const idsToKeep =
    values.delete &&
    Object.keys(values.delete).filter((key) => values.delete[key]);

  const updatedProductList = {};

  values.delete &&
    Object.keys(product_list).forEach((key) => {
      updatedProductList[key] = {};
      idsToKeep.forEach((id) => {
        if (product_list[key][id] !== undefined) {
          updatedProductList[key][id] = product_list[key][id];
        }
      });
    });

  return updatedProductList;
};
