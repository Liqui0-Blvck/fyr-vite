export const compresor = (img, calidad) => {

  return new Promise((resolve, reject) => {
    const $canvas = document.createElement('canvas')
    const imagen = new Image()

    imagen.onload = () => {
      $canvas.width = imagen.width
      $canvas.height = imagen.height
      $canvas.getContext('2d').drawImage(imagen, 0, 0)
      $canvas.toBlob((blob) => {
        if (blob === null){
          return reject(blob)
        } else {
          resolve(blob)
        }
      },
      'image/webp',
      calidad / 100
      )
    }

    imagen.src = URL.createObjectURL(img)
  })
}