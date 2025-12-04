import imageCompression from "browser-image-compression";

const cutImg = (file: File, targetSize = 600): Promise<File> => {
  return new Promise<File>((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const size = Math.min(img.width, img.height); // recorte cuadrado
      const canvas = document.createElement("canvas");
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext("2d")!;

      // Dibujar recorte centrado y escalar al tamaño objetivo
      ctx.drawImage(
        img,
        (img.width - size) / 2,
        (img.height - size) / 2,
        size,
        size,
        0,
        0,
        targetSize,
        targetSize
      );

      canvas.toBlob((blob) => {
        resolve(new File([blob!], file.name, { type: file.type }));
      }, file.type, 0.8); // el tercer parámetro es calidad (0–1) si es JPEG/WebP
    };
  });
};

const processImage = async (file: File) => {
    const options = {
        maxWidthOrHeight: 600,
        // maxSizeMB: 1, // límite de peso
        useWebWorker: true,
    };
    return await imageCompression(await cutImg(file), options);
};

export { processImage };
