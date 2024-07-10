export const removeDeleteId = (setSelectedRows, id) => {
  setSelectedRows((prev) => prev.filter((item) => item.id !== id));
};
