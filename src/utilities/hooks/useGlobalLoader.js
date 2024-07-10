import { useSelector } from "react-redux";

export const useGlobalLoader = () => {
  const globalLoading = useSelector((state) => state.loader.loading);

  return globalLoading;
};
