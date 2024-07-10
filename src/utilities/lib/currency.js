export const showCurrency = (value, currency) => {
  if (!value || value === "null") return "N/A";

  if (currency.position.toString() === "0")
    return currency.name + " " + parseFloat(value).toFixed(2) ?? "N/A";
  else return parseFloat(value).toFixed(2) ?? "N/A" + " " + currency.name;
};
