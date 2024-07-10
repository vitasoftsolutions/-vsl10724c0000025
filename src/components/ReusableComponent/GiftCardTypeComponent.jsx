import { useGetAllGiftCardTypeQuery } from "../../redux/services/giftcard/giftcardtype/giftCardTypeApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import { useInitialFormField } from "../../utilities/lib/updateFormValues/useInitialFormField";
import CustomSelect from "../Shared/Select/CustomSelect";

export const GiftCardTypeComponent = ({ name = "gift_card_type_id" }) => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isFetching } = useGetAllGiftCardTypeQuery({ params });

  const options = data?.results?.giftcardtype?.map((giftCardType) => ({
    value: giftCardType.id?.toString(),
    label: giftCardType.name,
  }));

  useInitialFormField(name, options);

  return (
    <CustomSelect
      label="Gift Card Type"
      name={name}
      options={options}
      isLoading={isFetching}
      required={true}
    />
  );
};
