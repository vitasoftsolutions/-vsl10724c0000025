export const desLayout = ({ isMobile }) => {
  return {
    bordered: true,
    labelStyle: {
      width: isMobile ? "40%" : "25%",
    },
    contentStyle: {
      width: isMobile ? "60%" : "25%",
    },
    size: "middle",
    // column: { sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 },
  };
};

export const singleDesLayout = ({ isMobile }) => {
  return {
    bordered: true,
    labelStyle: {
      width: isMobile ? "40%" : "25%",
    },
    contentStyle: {
      width: isMobile ? "60%" : "75%",
    },
    size: "middle",
    // column: { sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 },
  };
};

export const detailsLayout = {
  bordered: true,
  size: "middle",
  labelStyle: {
    width: "25%",
  },
  contentStyle: {
    width: "75%",
  },
  column: { sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 },
};
