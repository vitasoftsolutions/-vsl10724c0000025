import { useState } from "react";
import GiftCardDesginTable from "../../../components/GiftCardDesign/GiftCardDesginTable";
import { GiftCardDesignCreate } from "../../../components/GiftCardDesign/GiftCardDesignCreate";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { GIFT_CARD_DESIGN } from "../../../utilities/apiEndpoints/offer.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
    title: "Gift Card Type",
    dataIndex: "type",
    key: "type",
    render: (type) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {type}
      </span>
    ),
  },
];

const GiftCardDesign = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Gift Card Designs"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      api={GIFT_CARD_DESIGN}
    >
      <GiftCardDesignCreate />

      <GiftCardDesginTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};
export default GiftCardDesign;
