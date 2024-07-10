export const calculateTotals = (formValues) => {
  const sanitizeIntValue = (value) => parseInt(value) || 0;
  const sanitizeParseValue = (value) => parseFloat(value) || 0;

  const totalQuantity = Object.values(formValues.product_list?.qty).reduce(
    (acc, cur) => acc + sanitizeIntValue(cur),
    0
  );

  const totalReceived =
    formValues.product_list?.recieved &&
    Object.values(formValues.product_list?.recieved).reduce(
      (acc, cur) => acc + sanitizeIntValue(cur),
      0
    );

  const totalPrice =
    formValues.product_list?.total &&
    Object.values(formValues.product_list?.total)
      .reduce((acc, cur) => acc + sanitizeParseValue(cur), 0)
      .toFixed(2);

  const totalTax =
    formValues.product_list?.tax &&
    Object.values(formValues.product_list?.tax)
      .reduce((acc, cur) => acc + sanitizeParseValue(cur), 0)
      .toFixed(2);

  const totalDiscount =
    formValues.product_list?.discount &&
    Object.values(formValues.product_list?.discount)
      .reduce((acc, cur) => acc + sanitizeParseValue(cur), 0)
      .toFixed(2);

  console.log(
    totalQuantity,
    formValues.product_list,
    totalPrice,
    totalTax,
    totalDiscount
  );

  return {
    totalQuantity,
    totalReceived,
    totalPrice,
    totalTax,
    totalDiscount,
  };
};
