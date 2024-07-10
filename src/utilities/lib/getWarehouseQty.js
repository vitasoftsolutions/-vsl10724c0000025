export function getWarehouseQuantity(data, warehouseId) {
  // console.log(data, warehouseId);
  const item = data.find(
    (item) => item.warehouse_id?.toString() === warehouseId?.toString()
  );
  // console.log(item);
  return item ? parseInt(item.qty) : 0;
}
