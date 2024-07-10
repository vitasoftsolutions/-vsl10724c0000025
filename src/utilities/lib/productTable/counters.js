import { openNotification } from "../openToaster";

export const incrementCounter = (id, setFormValues, stock, alertQty) => {
  setFormValues((prevFormValues) => {
    const currentQty = prevFormValues.product_list.qty[id] ?? 0;

    if (Number(currentQty) + 1 > stock) {
      openNotification("info", `Cannot add more than stock quantity`);
      return prevFormValues;
    }

    const newQty = stock
      ? Math.min(Number(currentQty) + 1, stock)
      : Number(currentQty) + 1;

    return {
      ...prevFormValues,
      product_list: {
        ...prevFormValues.product_list,
        qty: {
          ...prevFormValues.product_list.qty,
          [id]: newQty,
        },
      },
    };
  });
};

export const decrementCounter = (id, setFormValues) => {
  setFormValues((prevFormValues) => {
    const currentQty = prevFormValues.product_list.qty[id] || 1;
    const newQty = Math.max(Number(currentQty) - 1, 0);

    return {
      ...prevFormValues,
      product_list: {
        ...prevFormValues.product_list,
        qty: {
          ...prevFormValues.product_list.qty,
          [id]: newQty,
        },
      },
    };
  });
};

export const onQuantityChange = (id, value, setFormValues, stock) => {
  const numericValue = Number(value);

  console.log(stock);

  if (numericValue > stock && stock) {
    // message.error(
    //   "Cannot add more than stock quantity. Maximum stock is selected"
    // );

    openNotification(
      "info",
      `Cannot add more than stock quantity. Maximum stock is selected`
    );

    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      product_list: {
        ...prevFormValues.product_list,
        qty: {
          ...prevFormValues.product_list.qty,
          [id]: stock,
        },
      },
    }));

    return;
  }

  const newQty = stock
    ? Math.min(Math.max(parseInt(value, 10) || 0, 0), stock)
    : Math.max(parseInt(value, 10) || 0, 0);

  setFormValues((prevFormValues) => ({
    ...prevFormValues,
    product_list: {
      ...prevFormValues.product_list,
      qty: {
        ...prevFormValues.product_list.qty,
        [id]: newQty,
      },
    },
  }));
};

export const onActionChange = (id, value, setFormValues) => {
  setFormValues((prevFormValues) => ({
    ...prevFormValues,
    product_list: {
      ...prevFormValues.product_list,
      action: {
        ...prevFormValues.product_list.action,
        [id]: value,
      },
    },
  }));
};

export const onDelete = (id, setProducts, setFormValues) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id)
  );

  setFormValues((prevFormValues) => {
    const { product_list } = prevFormValues;

    const updatedProductList = Object.keys(product_list).reduce((acc, key) => {
      // eslint-disable-next-line no-unused-vars
      const { [id]: _, ...rest } = product_list[key];
      acc[key] = rest;
      return acc;
    }, {});

    return {
      ...prevFormValues,
      product_list: updatedProductList,
    };
  });
};
