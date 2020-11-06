import fs from 'fs'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import sha256 from 'sha256'

class PDF {
  public static async generate ({ pathFile, data, files }) {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()

    // Embed the Times Roman font
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    // Add a blank page to the document
    const page = pdfDoc.addPage()

    // Get the width and height of the page
    const { width, height } = page.getSize()

    // Draw a string of text toward the top of the page
    const fontSize = 15
    page.drawText(`${data}`, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71)
    })

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    const hash = sha256(pdfBytes)

    fs.writeFileSync(pathFile, pdfBytes)

    return Promise.resolve({
      hash,
      path: pathFile
    })
  }
}

export default PDF
