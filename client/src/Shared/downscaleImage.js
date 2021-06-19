/**@file downscaleImage.js */

/**
 * Получение Image из dataUrl
 * @param {string} dataUrl 
 * @returns {Promise<HTMLImageElement>}
 */
function getImage(dataUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = dataUrl
        image.onload = () => {
            resolve(image)
        }
        image.onerror = (el, err) => {
            reject(err.error)
        }
    })
}

/**
 * Сжатие url изображения
 * @param {string} dataUrl 
 * @param {string} imageType e.g. 'image/jpeg'
 * @param {number} resolution max width/height in pixels
 * @param {number} quality e.g. 0.9 = 90% quality
 * @returns {Promise<string>}
 */
export async function downscaleImage(dataUrl, imageType, resolution, quality = 1) {
    // Create a temporary image so that we can compute the height of the image.
    const image = await getImage(dataUrl)
    const oldWidth = image.naturalWidth
    const oldHeight = image.naturalHeight

    const longestDimension = oldWidth > oldHeight ? 'width' : 'height'
    const currentRes = longestDimension === 'width' ? oldWidth : oldHeight

    if (currentRes > resolution) {
        // Calculate new dimensions
        const newSize = longestDimension === 'width'
            ? Math.floor(oldHeight / oldWidth * resolution)
            : Math.floor(oldWidth / oldHeight * resolution)
        const newWidth = longestDimension === 'width' ? resolution : newSize
        const newHeight = longestDimension === 'height' ? resolution : newSize

        // Create a temporary canvas to draw the downscaled image on.
        const canvas = document.createElement('canvas')
        canvas.width = newWidth
        canvas.height = newHeight

        // Draw the downscaled image on the canvas and return the new data URL.
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, newWidth, newHeight)
        const newDataUrl = canvas.toDataURL(imageType, quality)
        return newDataUrl
    }
    else {
        return dataUrl
    }
}