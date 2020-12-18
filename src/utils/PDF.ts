import fs from 'fs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getFullPath } from '../utils/Files';
import sha256 from 'sha256';
import CompanyService from '../services/CompanyService';
import models from '../models';

import {
  VALID_FORMATS_FILES_IMAGES_PNG,
  VALID_FORMATS_FILES_IMAGES_JPG,
  VALID_FORMATS_FILES_DOCUMENTS
} from '../utils/Constants';

const User = models.User;

class PDF {
  public static async generate({ pathFile, files, crop, activity }) {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();

    // Embed the Times Roman font
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    // Add a blank page to the document
    const page = pdfDoc.addPage();

    // Add a blank page to Activity
    const pageActivity = pdfDoc.addPage();

    // Add a blank page to Lots Selected
    const pageLotsSelected = pdfDoc.addPage();

    // Add a blank page to Achievement
    const pageAchievement = pdfDoc.addPage();

    // Get the width and height of the page
    const { width, height } = page.getSize();

    // Draw a string of text toward the top of the page
    const fontSize = 8;

    page.drawText(`${await this.generateCropTemplate(crop)}`, {
      x: 150,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71)
    });

    pageActivity.drawText(`${this.generateActivityTemplate(activity)}`, {
      x: 150,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71)
    });

    pageLotsSelected.drawText(`${this.generateLotsSelected(activity)}`, {
      x: 150,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71)
    });

    pageAchievement.drawText(`${await this.listAchievements(activity)}`, {
      x: 150,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71)
    });

    if (activity.achievements.length > 0) {
      await this.addFileDocumentAchievements(activity.achievements, pdfDoc);
    }

    if (files.length > 0) {
      const imagesPngBytes = this.readImagesPngFiles(files);
      const imagesJpgBytes = this.readImagesJpgFiles(files);
      const pdfListBytes = this.readPdfFiles(files);

      // Embed PNG files
      if (imagesPngBytes.length > 0) {
        for (const image of imagesPngBytes) {
          // Add a blank page to images
          const pngImage = await pdfDoc.embedPng(image.file);
          const pngDims = pngImage.scale(0.5);
          // Add a blank page to the document
          const pagePng = pdfDoc.addPage();

          pagePng.drawImage(pngImage, {
            x: page.getWidth() / 2 - pngDims.width / 2 + 75,
            y: page.getHeight() / 2 - pngDims.height,
            width: pngDims.width,
            height: pngDims.height
          });
        }
      }

      // Embed JPG files
      if (imagesJpgBytes.length > 0) {
        for (const image of imagesJpgBytes) {
          // Add a blank page to images
          const jpgImage = await pdfDoc.embedJpg(image.file);
          const jpgDims = jpgImage.scale(0.5);
          // Add a blank page to the document
          const pageJpg = pdfDoc.addPage();

          pageJpg.drawImage(jpgImage, {
            x: page.getWidth() / 2 - jpgDims.width / 2 + 75,
            y: page.getHeight() / 2 - jpgDims.height,
            width: jpgDims.width,
            height: jpgDims.height
          });
        }
      }

      // Embed PDF document
      if (pdfListBytes.length > 0) {
        for (const pdfItemByte of pdfListBytes) {
          const [pdfEmbedFile] = await pdfDoc.embedPdf(pdfItemByte.file);
          const pdfEmbedFileDims = pdfEmbedFile.scale(0.3);

          const newPage = pdfDoc.addPage();
          newPage.drawPage(pdfEmbedFile, {
            ...pdfEmbedFileDims,
            x: page.getWidth() / 2 - pdfEmbedFileDims.width / 2,
            y: page.getHeight() - pdfEmbedFileDims.height - 150
          });
        }
      }
    }

    // Add a blank page to Signers
    const pageSigners = pdfDoc.addPage();

    // Se agrega los firmantes
    const signers = await this.generateSignersTemplate(activity.signers);

    pageSigners.drawText(`${signers}`, {
      x: 150,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71)
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    const hash = sha256(pdfBytes);

    fs.writeFileSync(pathFile, pdfBytes);

    return Promise.resolve({
      hash,
      path: pathFile
    });
  }

  public static async generateCropTemplate(crop) {
    const companyProducer = await this.getCompanyProducer(crop);
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
        `;
  }

  public static generateActivityTemplate(activity) {
    return `
    Actividad: ${activity.type.name.es} ${
      activity.typeAgreement ? activity.typeAgreement.name.es : ''
    }
    ${activity.pay || ''} ${activity.unitType ? activity.unitType.name.es : ''}
    ${activity.observation || ''}
    ${
      activity.dateObservation
        ? activity.dateObservation.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        : ''
    }
    -------------------------------------------------------------
    `
  }

  public static generateLotsSelected(activity) {
    return `
    Lotes Seleccionados:
    ${this.createStringLot(activity.lots)}
    --------------------------------------------------
    `
  }

  public static async listAchievements(activity) {
    return `
    Realizaciones
    -------------------------------------------------
    ${await this.generateAchievement(activity.achievements)}
    `
  }

  public static async generateSignersTemplate(signers) {
    const listSigners = await this.listSigners(signers)
    return `
    --------------------------------------------------
    Las siguientes personas expresaron su acuerdo a las declaraciones expresadas ene este documento:
     ${listSigners}

    Hora Firma: ${new Date()}
    `
  }

  private static async generateAchievement(achievements) {
    let list = ''

    for (const achievement of achievements) {
      list += `Fecha de realización: ${achievement.dateAchievement.toLocaleDateString(
        'es-ES',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      )}
        Lotes Seleccionados: ${this.createStringLot(achievement.lots)}
        Porcentaje: ${achievement.percent} %
        -------------------------------------
        Insumos Utilizados: ${this.listSupplies(achievement.supplies)}
        -------------------------------------
        Destinos: ${this.listDestination(achievement.destination)}
        -------------------------------------
        Firmantes de la Realización: ${await this.listSigners(
          achievement.signers
        )}`
    }

    return list
  }

  private static async addFileDocumentAchievements(achievements, pdfDoc) {
    for (const achievement of achievements) {
      const imagesPngBytes = this.readImagesPngFiles(achievement.files)
      const imagesJpgBytes = this.readImagesJpgFiles(achievement.files)
      const pdfListBytes = this.readPdfFiles(achievement.files)

      if (imagesPngBytes.length > 0) {
        for (const image of imagesPngBytes) {
          // Add a blank page to images
          const pngImage = await pdfDoc.embedPng(image.file)
          const pngDims = pngImage.scale(0.5)
          // Add a blank page to the document
          const pagePng = pdfDoc.addPage()

          pagePng.drawText(`${image.date}`, {
            x: 150,
            y: pagePng.getHeight() - 4 * 12,
            size: 12,
            color: rgb(0, 0.53, 0.71)
          })

          pagePng.drawImage(pngImage, {
            x: pagePng.getWidth() / 2 - pngDims.width / 2 + 75,
            y: pagePng.getHeight() / 2 - pngDims.height,
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

          pageJpg.drawText(`${image.date}`, {
            x: 150,
            y: pageJpg.getHeight() - 4 * 12,
            size: 12,
            color: rgb(0, 0.53, 0.71)
          })

          pageJpg.drawImage(jpgImage, {
            x: pageJpg.getWidth() / 2 - jpgDims.width / 2 + 75,
            y: pageJpg.getHeight() / 2 - jpgDims.height,
            width: jpgDims.width,
            height: jpgDims.height
          })
        }
      }

      // Embed PDF document
      if (pdfListBytes.length > 0) {
        for (const pdfItemByte of pdfListBytes) {
          const useLoadPdf = await PDFDocument.load(pdfItemByte.file)

          const preamble = await pdfDoc.embedPage(useLoadPdf.getPages()[1], {
            left: 55,
            bottom: 485,
            right: 300,
            top: 575
          })
          const pdfEmbedFileDims = preamble.scale(0.3)

          const newPage = pdfDoc.addPage()

          newPage.drawText(`${pdfItemByte.date}`, {
            x: 150,
            y: newPage.getHeight() - 4 * 12,
            size: 12,
            color: rgb(0, 0.53, 0.71)
          })

          newPage.drawPage(preamble, {
            ...pdfEmbedFileDims,
            x: newPage.getWidth() / 2 - pdfEmbedFileDims.width / 2,
            y: newPage.getHeight() - pdfEmbedFileDims.height - 150
          })
        }
      }
    }
  }

  private static async listSigners(signers) {
    let users = ''

    for (const sign of signers) {
      if (sign.signed) {
        const user = await User.findOne({ _id: sign.userId })

        users += `${user.firstName} ${user.lastName},`
      }
    }

    return users
  }

  private static listSupplies(supplies) {
    let list = ''

    for (const input of supplies) {
      list += `Nombre: ${input.name}, Unidad: ${input.unit}, Cantidad: ${input.quantity}
      `
    }

    return list
  }

  private static listDestination(destinations) {
    let list = ''
    for (const destination of destinations) {
      list += `Unidad: ${destination.tonsHarvest} ${destination.label} - Destino: ${destination.destinationAddress}`
    }

    return list
  }

  private static readImagesPngFiles(files: any) {
    return files
      .map((item) => {
        const arrayNameFile = item.nameFile.split('.');
        if (arrayNameFile[1].match(VALID_FORMATS_FILES_IMAGES_PNG) !== null) {
          const path = item.pathIntermediate
            ? item.pathIntermediate
            : item.path;
          return {
            file: fs.readFileSync(getFullPath(`${path}`)),
            date: `Fecha de evidencia: ${item.date.toLocaleDateString(
              'es-ES'
            )}`
          };
        }
        return undefined;
      })
      .filter((item) => item)
  }

  private static readImagesJpgFiles(files: any) {
    return files
      .map((item) => {
        console.log(item);
        const arrayNameFile = item.nameFile.split('.');
        if (arrayNameFile[1].match(VALID_FORMATS_FILES_IMAGES_JPG) !== null) {
          const path = item.pathIntermediate
            ? item.pathIntermediate
            : item.path;
          return {
            file: fs.readFileSync(getFullPath(`${path}`)),
            date: `Fecha de evidencia ${item.date.toLocaleDateString('es-ES')}`
          };
        }
        return undefined;
      })
      .filter((item) => item)
  }

  private static readPdfFiles(files: any) {
    return files
      .map((item) => {
        console.log(item)
        const arrayNameFile = item.nameFile.split('.')
        if (arrayNameFile[1].match(VALID_FORMATS_FILES_DOCUMENTS) !== null) {
          return {
            file: fs.readFileSync(getFullPath(`${item.path}`)),
            date: `Fecha de evidencia ${item.date.toLocaleDateString('es-ES')}`
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
      Lote: ${lot.name},
      superficie: ${lot.surface}, Coordenadas: ${this.createStringCoordinate(
        lot.coordinates
      )}`
    }

    return listLots
  }

  private static createStringCoordinate (coordinates) {
    let coordinatesLiteral = ''

    for (const coordinate of coordinates) {
      coordinatesLiteral = `${coordinate.latitude},${coordinate.longitude}`
    }

    return coordinatesLiteral
  }

  private static getCompanyProducer (crop, type = 'PRODUCER') {
    const member = crop.members.filter((item) => item.type === type)[0]

    return CompanyService.search({ identifier: member.identifier })
  }
}

export default PDF
