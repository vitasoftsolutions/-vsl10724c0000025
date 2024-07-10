import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectParams } from "../../redux/services/paramSlice/paramSlice";

const RELATIONAL_PARAMS = {
  parent: 1,
  child: 1,
};

const DEFAULT_PARAMS = {
  is_active: 1,
};

export const DEFAULT_SELECT_VALUES = ["id", "name"];

export const useGlobalParams = ({
  isDefaultParams = true,
  isRelationalParams = false,
  params = {},
  selectValue = [],
  keyword,
}) => {
  const searchParams = useSelector(selectParams);

  const globalParams = useMemo(() => {
    let updatedParams = { ...params };

    if (isDefaultParams) {
      updatedParams = { ...updatedParams, ...DEFAULT_PARAMS };
    }

    if (isRelationalParams) {
      updatedParams = { ...updatedParams, ...RELATIONAL_PARAMS };
    }

    if (selectValue?.length > 0) {
      updatedParams.selectValue = selectValue;
    }

    if (keyword) {
      updatedParams.keyword = keyword;
    }

    if (searchParams) {
      updatedParams = { ...updatedParams, ...searchParams };
    }

    return updatedParams;
  }, [
    params,
    isDefaultParams,
    isRelationalParams,
    selectValue,
    keyword,
    searchParams,
  ]);

  return globalParams;
};

export const useFilterParams = () => {
  // return useSelector(selectParams);
  const [searchParams, setSearchParams] = useState({});

  const setParams = (params) => {
    setSearchParams(params);
  };

  const clearParams = () => {
    setSearchParams({});
  };

  return {
    searchParams,
    setParams,
    clearParams,
  };
};
