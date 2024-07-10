import styled from "styled-components";

const primaryColor = ({ theme }) => {
  return theme?.token?.colorPrimary;
};

const secondaryColor = ({ theme }) => {
  return theme?.token?.secondaryColor;
};

const GlobalUtilityStyle = styled.div`
  ::-webkit-scrollbar-track {
    background: ${primaryColor};
  }

  ::-webkit-scrollbar-thumb {
    background: ${secondaryColor};
  }

  .avatar-bg {
    background: ${primaryColor};
  }

  .primary-text {
    color: ${primaryColor} !important;
  }

  .primary-bg {
    background: ${primaryColor} !important;
  }

  .secondary-text {
    color: ${secondaryColor} !important;
  }

  .secondary-bg {
    background: ${secondaryColor} !important;
  }

  .image-border {
    border: 1px dashed ${secondaryColor};
    border-radius: 8px;

    &:hover {
      border-color: ${primaryColor};
    }
  }

  .border-secondary-hover {
    &:hover {
      border: 1px solid ${primaryColor} !important;
    }
  }

  .custom-primary-btn {
    background: ${primaryColor} !important;
    border: 1px solid ${primaryColor} !important;
    color: white !important;

    &:hover {
      background: ${secondaryColor} !important;
      border: 1px solid ${secondaryColor} !important;
      color: ${primaryColor} !important;
    }
  }

  .ant-page-header-heading {
    display: flex;
    align-items: center;
    gap: 10px 0;
  }

  .ant-page-header-heading-extra {
    display: flex;
    justify-content: flex-end;
  }

  .ant-page-header-heading-title {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ant-select {
    border: 2px solid ${secondaryColor} !important;
    border-radius: 8px !important;

    &:hover {
      border: 2px solid ${primaryColor} !important;
      border-radius: 8px !important;
    }
  }

  .ant-group-number {
    border: 2px solid ${secondaryColor} !important;
    border-radius: 8px !important;

    .ant-input-number-group-addon {
      font-size: 14px !important;
      border: none !important;
      border-right: 2px solid ${secondaryColor} !important;
    }

    .ant-input-number {
      border: none !important;
    }

    &:hover {
      border: 2px solid ${primaryColor} !important;
      border-radius: 8px !important;
    }
  }

  .ant-group-addOn {
    border: 2px solid ${secondaryColor} !important;
    border-radius: 8px !important;

    .ant-input-number-group-addon {
      font-size: 14px !important;
      border: none !important;
      border-left: 2px solid ${secondaryColor} !important;
    }

    .ant-input-number {
      border: none !important;
    }

    &:hover {
      border: 2px solid ${primaryColor} !important;
      border-radius: 8px !important;
    }
  }

  .ant-select-focused {
    border: 2px solid ${primaryColor} !important;
    border-radius: 8px !important;
  }

  .ant-select-selector {
    font-size: 14px !important;
    border: none !important;
  }

  .ant-menu-submenu-active > .ant-menu-submenu-title {
    color: ${primaryColor} !important;
    background-color: ${secondaryColor} !important;
  }

  .ant-menu-item-selected {
    color: ${primaryColor} !important;
    background-color: ${secondaryColor} !important;
  }

  .ant-menu-item-active {
    color: ${primaryColor} !important;
    background-color: ${secondaryColor} !important;
  }

  .ant-btn-primary {
    background-color: ${primaryColor} !important;
    // color: ${secondaryColor} !important;
    border: 1px solid ${primaryColor} !important;

    &:hover {
      background-color: ${secondaryColor} !important;
      color: ${primaryColor} !important;
      border: 1px solid ${secondaryColor} !important;
    }
  }

  .custom-logo-upload {
    .ant-upload {
      margin-inline: 0 !important;
      width: 150px !important;
      height: 150px !important;
    }

    .ant-upload-list-item-container {
      margin-inline: 0 !important;
      width: 150px !important;
      height: 150px !important;

      &:hover {
        border: 1px dashed ${primaryColor} !important;
        border-radius: 99999px !important;
      }
    }
  }

  .custom-upload {
    .ant-upload {
      width: 130px !important;
      height: 130px !important;
    }

    .ant-upload-list-item-container {
      width: 130px !important;
      height: 130px !important;

      // &:hover {
      //   border: 1px dashed ${primaryColor} !important;
      //   border-radius: 99999px !important;
      // }
    }
  }

  .custom-single-upload {
    .ant-upload {
      width: 100% !important;
      height: 130px !important;
    }

    .ant-upload-list-item-container {
      width: 100% !important;
      height: 130px !important;
    }
  }

  .ant-upload-list-item-thumbnail {
    img {
      object-fit: contain !important;
    }
  }

  // .ant-upload-list-item-container:hover {
  //   border: 1px dashed ${primaryColor} !important;
  //   border-radius: 99999px !important;
  // }

  // .ant-upload-select:hover {
  //   border: 1px dashed ${primaryColor} !important;
  //   border-radius: 99999px !important;
  // }
`;

// .ant-menu-submenu-selected > .ant-menu-submenu-title {
//   color: ${primaryColor} !important;
//   background-color: ${secondaryColor} !important;
// }

// .ant-menu-submenu-vertical > .ant-menu-item-active {
//   color: ${primaryColor} !important;
//   background-color: ${secondaryColor} !important;
// }

export { GlobalUtilityStyle };
