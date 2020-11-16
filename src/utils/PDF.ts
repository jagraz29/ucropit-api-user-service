import fs from 'fs'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { getFullPath } from '../utils/Files'
import sha256 from 'sha256'
import CompanyService from '../services/CompanyService'
import models from '../models'

import {
  VALID_FORMATS_FILES_IMAGES_PNG,
  VALID_FORMATS_FILES_IMAGES_JPG,
  VALID_FORMATS_FILES_DOCUMENTS
} from '../utils/Constants'

const User = models.User

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
    const fontSize = 12
    page.drawText(`${data}`, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71)
    })

    const imagesPngBytes = this.readImagesPngFiles(files)
    const imagesJpgBytes = this.readImagesJpgFiles(files)
    const pdfListBytes = this.readPdfFiles(files)

    // Embed PNG files
    if (imagesPngBytes.length > 0) {
      for (const image of imagesPngBytes) {
        // Add a blank page to images
        const pngImage = await pdfDoc.embedPng(image.file)
        const pngDims = pngImage.scale(0.5)
        // Add a blank page to the document
        const pagePng = pdfDoc.addPage()

        pagePng.drawImage(pngImage, {
          x: page.getWidth() / 2 - pngDims.width / 2 + 75,
          y: page.getHeight() / 2 - pngDims.height,
          width: pngDims.width,
          height: pngDims.height
        })
      }
    }

    // Embed JPG files
    if (imagesJpgBytes.length > 0) {
      for (const image of imagesJpgBytes) {
        // Add a blank page to images
        const jpgImage = await pdfDoc.embedJpg(image.file)
        const jpgDims = jpgImage.scale(0.5)
        // Add a blank page to the document
        const pageJpg = pdfDoc.addPage()

        pageJpg.drawImage(jpgImage, {
          x: page.getWidth() / 2 - jpgDims.width / 2 + 75,
          y: page.getHeight() / 2 - jpgDims.height,
          width: jpgDims.width,
          height: jpgDims.height
        })
      }
    }

    // Embed PDF document
    if (pdfListBytes.length > 0) {
      for (const pdfItemByte of pdfListBytes) {
        const [pdfEmbedFile] = await pdfDoc.embedPdf(pdfItemByte.file)
        const pdfEmbedFileDims = pdfEmbedFile.scale(0.3)

        const newPage = pdfDoc.addPage()
        newPage.drawPage(pdfEmbedFile, {
          ...pdfEmbedFileDims,
          x: page.getWidth() / 2 - pdfEmbedFileDims.width / 2,
          y: page.getHeight() - pdfEmbedFileDims.height - 150
        })
      }
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    const hash = sha256(pdfBytes)

    fs.writeFileSync(pathFile, pdfBytes)

    return Promise.resolve({
      hash,
      path: pathFile
    })
  }

  public static async generateTemplateActivity (activity, crop, signers) {
    const companyProducer = await this.getCompanyProducer(crop)
    return `
        CULTIVO
        -------------------------------------------------
        Cultivo: ${crop.cropType.name.es}
        Razon Social: ${companyProducer ? companyProducer[0].name : ''}
        CUIT: ${companyProducer ? companyProducer[0].identifier : ''}
        Superficie Total: ${crop.surface}
        Fecha Siembra Estimada: ${crop.dateCrop.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        Fecha Cosecha Estimada: ${crop.dateHarvest.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        -------------------------------------------------
        Actividad: ${activity.type.name.es} ${
      activity.typeAgreement ? activity.typeAgreement.name.es : ''
    }
       Lotes Seleccionados:
       ${this.createStringLot(activity.lots)}
       --------------------------------------------------
       Las siguientes personas expresaron su acuerdo a las declaraciones expresadas ene este documento:
        ${await this.listSigners(signers)}

       Hora Firma: ${new Date()}
  `
  }

  private static async listSigners (signers) {
    let users = ''

    for (const sign of signers) {
      const user = await User.findOne({ _id: sign.userId })

      users += `
       ${user.firstName} ${user.lastName},
      `
    }

    return users
  }

  private static readImagesPngFiles (files: any) {
    return files
      .map((item) => {
        const arrayNameFile = item.nameFile.split('.')
        if (arrayNameFile[1].match(VALID_FORMATS_FILES_IMAGES_PNG) !== null) {
          return {
            file: fs.readFileSync(getFullPath(`${item.path}`))
          }
        }
        return undefined
      })
      .filter((item) => item)
  }

  private static readImagesJpgFiles (files: any) {
    return files
      .map((item) => {
        const arrayNameFile = item.nameFile.split('.')
        if (arrayNameFile[1].match(VALID_FORMATS_FILES_IMAGES_JPG) !== null) {
          return {
            file: fs.readFileSync(getFullPath(`${item.path}`))
          }
        }
        return undefined
      })
      .filter((item) => item)
  }

  private static readPdfFiles (files: any) {
    return files
      .map((item) => {
        const arrayNameFile = item.nameFile.split('.')
        if (arrayNameFile[1].match(VALID_FORMATS_FILES_DOCUMENTS) !== null) {
          return {
            file: fs.readFileSync(getFullPath(`${item.path}`))
          }
        }
        return undefined
      })
      .filter((item) => item)
  }

  private static createStringLot (lots) {
    let listLots = ''

    for (const lot of lots) {
      listLots += `
        Lote: ${lot.name}
        superficie: ${lot.surface}
        Coordenadas:
         ${this.createStringCoordinate(lot.coordinates)}
      `
    }

    return listLots
  }

  private static createStringCoordinate (coordinates) {
    let coordinatesLiteral = ''

    for (const coordinate of coordinates) {
      coordinatesLiteral = `
            -Latitude: ${coordinate.latitude}
            -Longitude: ${coordinate.longitude}
          `
    }

    return coordinatesLiteral
  }

  private static getCompanyProducer (crop, type = 'PRODUCER') {
    const member = crop.members.filter((item) => item.type === type)[0]

    return CompanyService.search({ identifier: member.identifier })
  }
}

export default PDF
