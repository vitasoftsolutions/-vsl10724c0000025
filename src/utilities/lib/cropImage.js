export function cropImage(image, imgCroppedArea) {
  return new Promise((resolve, reject) => {
    const canvasFile = document.createElement("canvas");
    canvasFile.width = imgCroppedArea.width;
    canvasFile.height = imgCroppedArea.height;

    const context = canvasFile.getContext("2d");

    let imageObj = new Image();
    imageObj.src = image;
    imageObj.onload = () => {
      context.drawImage(
        imageObj,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      const dataUrl = canvasFile.toDataURL("image/png");
      resolve(dataUrl);
    };
    imageObj.onerror = (error) => {
      reject(error);
    };
  });
}
