export function theme({ primaryColor, secondaryColor }) {
  return {
    token: {
      secondaryColor: secondaryColor,
      colorPrimary: primaryColor,
      colorBorder: secondaryColor,
      colorPrimaryBorder: secondaryColor,
      // colorTextDisabled: "#fff",
    },
    components: {
      Input: {
        activeBorderColor: primaryColor,
        hoverBorderColor: primaryColor,
      },

      Button: {
        fontWeight: 700,
        defaultColor: primaryColor,
        defaultHoverBg: secondaryColor,
        defaultHoverBorderColor: secondaryColor,
      },
      Table: {
        headerSplitColor: primaryColor,
        stickyScrollBarBg: secondaryColor,
        stickyScrollBarBorderRadius: "0 0 10px 10px",
        // borderColor: secondaryColor,
      },
      Menu: {
        itemHoverBg: secondaryColor,
        itemHoverColor: primaryColor,
      },

      Segmented: {
        trackBg: "white",
        itemSelectedBg: secondaryColor,
        // itemHoverBg: primaryColor,
        // itemSelectedColor: "white",
        // itemHoverColor: "white",
        // itemActiveBg: primaryColor,
      },
    },
  };
}
