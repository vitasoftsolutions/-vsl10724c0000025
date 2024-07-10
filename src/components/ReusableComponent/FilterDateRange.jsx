import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";

export const FilterDateRange = ({
  customStyle = false,
  onChange,
  value,
  name = "searchDate",
}) => {
  return (
    <div className="px-2">
      <CustomDatepicker
        name={name}
        type={"range"}
        // placeholder="Choose Date"
        presets={true}
        customStyle={customStyle}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};
