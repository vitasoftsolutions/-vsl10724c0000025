export const downloadFile = async (response, extension, pageTitle) => {
  try {
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = blobUrl;
    a.download = `${pageTitle}.${extension}`;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error during file download:", error);
  }
};
