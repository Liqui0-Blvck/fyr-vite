export const compresor = (img: File, calidad: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const $canvas = document.createElement('canvas');
    const imagen = new Image();

    imagen.onload = () => {
      $canvas.width = imagen.width;
      $canvas.height = imagen.height;
      const context = $canvas.getContext('2d');
      if (context) {
        context.drawImage(imagen, 0, 0);
        $canvas.toBlob(
          (blob) => {
            if (blob === null) {
              reject(blob);
            } else {
              resolve(blob);
            }
          },
          'image/webp',
          calidad / 100
        );
      } else {
        reject(new Error('Error obteniendo el contexto 2D del canvas'));
      }
    };

    imagen.onerror = (error) => {
      reject(error);
    };

    imagen.src = URL.createObjectURL(img);
  });
};
