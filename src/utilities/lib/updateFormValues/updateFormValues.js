export function setFormValuesId(
  id,
  sale_unit_id,
  unit_cost,
  sale_units,
  formValues,
  productUnits,
  tax_id,
  taxes,
  tax_method
) {
  const sanitizeIntValue = (value) => parseInt(value) || 0;
  const sanitizeFloatValue = (value) => parseFloat(value) || 0;

  if (!id) return;

  const formProductList = formValues.product_list;

  // Helper function to get and sanitize form values
  const getSanitizedValue = (field, defaultValue, sanitizer) =>
    sanitizer(formProductList[field]?.[id] ?? defaultValue);

  // Extract and sanitize values
  const qty = getSanitizedValue("qty", 1, sanitizeIntValue);
  const netUnitPrice = getSanitizedValue(
    "net_unit_price",
    unit_cost,
    sanitizeFloatValue
  );
  const discount = getSanitizedValue("discount", 0, sanitizeFloatValue);
  const taxRate = getSanitizedValue(
    "tax_rate",
    taxes?.rate ?? 0,
    sanitizeIntValue
  );

  // Calculating tax
  const tax = sanitizeFloatValue(
    ((qty * taxRate * netUnitPrice) / 100).toFixed(2)
  );

  // Get or set sale units value
  const saleUnitsOperationValue = sale_units?.operation_value ?? 1;
  const productSaleUnitsValue =
    sanitizeIntValue(productUnits.sale_units?.[id]) || saleUnitsOperationValue;
  productUnits.sale_units[id] = productSaleUnitsValue;

  // Calculating total
  // const total = (
  //   productSaleUnitsValue * netUnitPrice * qty -
  //   discount +
  //   tax
  // ).toFixed(2);

  const total =
    tax_method === "Inclusive"
      ? Math.round(
          (productSaleUnitsValue * netUnitPrice * qty - discount + tax).toFixed(
            2
          )
        )
      : (productSaleUnitsValue * netUnitPrice * qty - discount + tax).toFixed(
          2
        );

  // Set form values
  const setFormValue = (field, value) => {
    formProductList[field][id] = value;
  };

  setFormValue("qty", qty);
  setFormValue("net_unit_price", netUnitPrice);
  setFormValue("discount", discount);
  setFormValue("tax_rate", taxRate);
  setFormValue("tax", tax);
  setFormValue("total", total);
  setFormValue(
    "sale_unit_id",
    formProductList.sale_unit_id?.[id] ?? sale_unit_id
  );

  if (formProductList.tax_id) {
    setFormValue("tax_id", formProductList.tax_id?.[id] ?? tax_id);
  }
}
