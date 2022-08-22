import AdminIds from '@/helpers/constant'
import bot from '@/helpers/bot'
import tesseract from 'node-tesseract-ocr'

export const imageOcr = async (filePath: string) => {
  try {
    //path.join(__dirname, '../../', 'temp', filePath)

    const text = await tesseract.recognize(filePath, {
      lang: 'eng', // default
      oem: 3,
      psm: 3,
    })

    console.log(`Ocr Text - ""${text}""`)
    return text
  } catch (err) {
    await bot.api
      .sendMessage(AdminIds[0], `Error in checkNumberFromImage: ${err}`)
      .catch(() => {
        //Do Nothing
      })
    console.log(err)
    return false
  }
}

//Get Text From Image And Check If It Is A Phone Number tesseract.js
const checkValidScreenshot = async (cardNumber: number, imageUrl: string) => {
  try {
    //save image from imageUrl to temp file

    const text = await imageOcr(imageUrl)

    if (!text) return false

    if (
      (text.includes('decline') || text.includes('declined')) &&
      text.includes(`${cardNumber}`.replace(/\s/g, ''))
    ) {
      return true
    }

    // //if text contain phone number
    // if (
    //   text.match(
    //     /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/gim
    //   )
    // )
    return true
    return false
  } catch (err) {
    console.log(err)
    return false
  }
}
export default checkValidScreenshot
