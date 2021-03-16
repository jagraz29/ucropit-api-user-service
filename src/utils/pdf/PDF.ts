import fs from 'fs'
import { PDFDocument } from 'pdf-lib'
import htmlToPDF from 'html-pdf-node'
import { getFullPath } from '../Files'
import sha256 from 'sha256'
import _ from 'lodash'
import CompanyService from '../../services/CompanyService'
import models from '../../models'
import { createDocumentSign } from './TemplateSign'
import { IDataContentPdf } from './PdfTypes'

import {
  VALID_FORMATS_FILES_IMAGES_PNG,
  VALID_FORMATS_FILES_IMAGES_JPG,
  VALID_FORMATS_FILES_DOCUMENTS
} from '../Constants'

const User = models.User

class PDF {
  /**
   * Generate PDF document.
   *
   * @param IDataContentPdf data
   *
   * @returns
   */
  public static async generate(
    data: IDataContentPdf
  ): Promise<{ hash: string; path: string }> {
    const { content, pathFile } = data
    const pdfBytes = await htmlToPDF.generatePdf({ content }, { format: 'A4' })

    const hash = sha256(pdfBytes)

    fs.writeFileSync(pathFile, pdfBytes)
    return Promise.resolve({
      hash,
      path: pathFile
    })
  }

  /**
   * Generate PDF Document to Sign Activities.
   *
   * @param IDataContentPdf data
   * @returns
   */
  public static async generatePdfSign(
    data: IDataContentPdf
  ): Promise<{ hash: string; path: string }> {
    const { crop, activity, pathFile } = data
    const contentCrop = await this.generateCropTemplate(crop)
    const contentActivity = this.generateActivityTemplate(activity)
    const achievements = await this.listAchievements(activity)
    const evidences = this.generateEvidences(activity)
    const signers = await this.generateSignersTemplate(activity)

    const contentDocumentHtml = createDocumentSign(
      contentCrop,
      contentActivity,
      achievements,
      evidences,
      signers
    )

    const pdfBytes = await htmlToPDF.generatePdf(
      { content: contentDocumentHtml },
      { format: 'A4' }
    )

    const pdfBytesWithAttachment = await this.attachPdfDocs(activity, pdfBytes)

    const hash = sha256(pdfBytes)
    fs.writeFileSync(pathFile, pdfBytesWithAttachment)
    return Promise.resolve({
      hash,
      path: pathFile
    })
  }

  private static async generateCropTemplate(crop) {
    const companyProducer = await this.getCompanyProducer(crop)
    return `
          <ul>
            <li>Cultivo: ${crop.cropType.name.es} </li>
            <li>CUIT: ${
              companyProducer ? companyProducer[0].identifier : ''
            }</li>
            <li>Razón Social: ${
              companyProducer ? companyProducer[0].name : ''
            }</li>
            <li>Superficie Total: ${crop.surface}</li>
            <li>Fecha de Siembra Estimada: ${crop.dateCrop.toLocaleDateString(
              'es-ES',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }
            )}</li>
            <li>Fecha de Cosecha Estimada: ${crop.dateHarvest.toLocaleDateString(
              'es-ES',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }
            )}</li>
          </ul>
        `
  }

  private static generateActivityTemplate(activity) {
    return `
        <ul>
          <li>Nombre: ${activity.type.name.es} ${
      activity.typeAgreement ? activity.typeAgreement.name.es : ''
    } </li>
        ${activity.pay ? `<li>Rinde: ${activity.pay}</li>` : ''} ${
      activity.unitType ? `<li>Unidad: ${activity.unitType.name.es}</li>` : ''
    } 
        ${activity.observation ? `<li>${activity.observation}</li>` : ''}
        ${
          activity.dateObservation
            ? `<li>${activity.dateObservation.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</li>`
            : ''
        }
          ${this.generateLotsSelected(activity)}
        </ul>
    `
  }

  private static generateEvidences(activity) {
    const evidencesAchievements = activity.achievements.map(
      (achievement) => achievement.files
    )

    const evidencesImageAchievements = [
      ...this.readImagesPngFiles(evidencesAchievements),
      ...this.readImagesJpgFiles(evidencesAchievements)
    ]

    const evidencesImageActivity = [
      ...this.readImagesPngFiles(activity.files),
      ...this.readImagesJpgFiles(activity.files)
    ]
    const evidences = [
      ...evidencesImageActivity,
      ...evidencesImageAchievements
    ].filter((item) => item)

    return this.generateEvidenceImage(evidences)
  }

  private static generateEvidenceImage(evidences) {
    let list = ''
    for (const evidence of evidences) {
      list += `
      <h4>${evidence.date}</h4>
      <div class="image-evidence">
        <img with="250" height="250" src=${evidence.file}>
      </div>`
    }

    return list
  }

  private static generateLotsSelected(activity) {
    return `
    <li>Lotes Seleccionados:</li>
    <li>
      <ul>${this.createStringLot(activity.lots)}</lu>
    </li>
    `
  }

  private static async listAchievements(activity) {
    return `
    <h5>Realización</h5>
    <ul>
    ${await this.generateAchievement(activity.achievements)}
    </ul>
    `
  }

  private static async attachPdfDocs(activity: any, pdfBytes: ArrayBuffer) {
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const evidenceAchievements = activity.achievements.map(
      (achievement) => achievement.files
    )
    const evidencePDF = [
      ...this.readPdfFiles(activity.files),
      ...this.readPdfFiles(evidenceAchievements)
    ]

    for (const evidence of evidencePDF) {
      await pdfDoc.attach(evidence.file, `attachment-${evidence.index}.pdf`, {
        mimeType: 'application/pdf',
        description: 'Documento PDF Evidencia',
        creationDate: new Date(),
        modificationDate: new Date()
      })
    }

    return pdfDoc.save()
  }

  private static async generateSignersTemplate(activity) {
    let listSigners = ''
    if (activity.achievements.length > 0) {
      const signers = activity.achievements.map((item) => item.signers)
      listSigners = await this.listSigners(
        _.uniqBy(_.flatten(signers), 'email')
      )
    } else {
      listSigners = await this.listSigners(activity.signers)
    }

    return `
      <ul>
      ${listSigners}
      </ul>
      <p>Hora Firma: ${new Date()}</p>
    `
  }

  private static async generateAchievement(achievements) {
    let list = ''

    for (const achievement of achievements) {
      list += `
      <li>Fecha de realización: ${achievement.dateAchievement.toLocaleDateString(
        'es-ES',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      )}</li>
			<li>Lotes Seleccionados:</li>
			<li>
				<ul>
					${this.createStringLot(achievement.lots)}
				</ul>
			</li>
			<li>Insumos Seleccionados</li>
			<li>
				<ul>
					${this.listSupplies(achievement.supplies)}
				</ul>
			</li>
			<li>Destinos:</li>
			<li>
				<ul>
					${this.listDestination(achievement.destination)}
				</ul>
			</li>
			<li>Firmantes</li>
			<li>
        <ul>
				  ${await this.listSigners(achievement.signers)}
        </ul>
			</li>
      `
    }

    return list
  }

  private static async listSigners(signers) {
    let users = ''

    for (const sign of signers) {
      if (sign.signed) {
        const user = await User.findOne({ _id: sign.userId })

        users += `<li>${user.firstName} ${user.lastName}</li>`
      }
    }

    return users
  }

  private static listSupplies(supplies) {
    let list = ''

    for (const input of supplies) {
      list += `<li>Nombre: ${input.name}, Unidad: ${input.unit}, Cantidad: ${input.quantity}</li>
      `
    }

    return list
  }

  private static listDestination(destinations) {
    let list = ''
    for (const destination of destinations) {
      list += `<li>Unidad: ${destination.tonsHarvest} ${destination.label} - Destino: ${destination.destinationAddress}</li>`
    }

    return list
  }

  private static readImagesPngFiles(files: any) {
    return _.flatten(files)
      .map((item) => {
        const arrayNameFile = item.nameFile.split('.')
        if (arrayNameFile[1].match(VALID_FORMATS_FILES_IMAGES_PNG) !== null) {
          const path = item.imagePathIntermediate
          return {
            file: path,
            date: `Fecha de evidencia: ${item.date.toLocaleDateString('es-ES')}`
          }
        }
        return undefined
      })
      .filter((item) => item)
  }

  private static readImagesJpgFiles(files: any) {
    return _.flatten(files)
      .map((item) => {
        console.log(item)
        const arrayNameFile = item.nameFile.split('.')
        if (arrayNameFile[1].match(VALID_FORMATS_FILES_IMAGES_JPG) !== null) {
          const path = item.imagePathIntermediate
          return {
            file: path,
            date: `Fecha de evidencia ${item.date.toLocaleDateString('es-ES')}`
          }
        }
        return undefined
      })
      .filter((item) => item)
  }

  private static readPdfFiles(files: any) {
    return _.flatten(files)
      .map((item, index) => {
        const arrayNameFile = item.nameFile.split('.')
        if (arrayNameFile[1].match(VALID_FORMATS_FILES_DOCUMENTS) !== null) {
          return {
            index: index + 1,
            file: fs.readFileSync(getFullPath(`${item.path}`)),
            date: `Fecha de evidencia ${item.date.toLocaleDateString('es-ES')}`
          }
        }
        return undefined
      })
      .filter((item) => item)
  }

  private static createStringLot(lots) {
    let listLots = ''

    for (const lot of lots) {
      listLots += `
      <li>
      ${lot.name}, ${lot.surface}, Coordenadas: ${this.createStringCoordinate(
        lot.coordinates
      )}
      </li>`
    }

    return listLots
  }

  private static createStringCoordinate(coordinates) {
    let coordinatesLiteral = ''

    for (const coordinate of coordinates) {
      coordinatesLiteral = `${coordinate.latitude},${coordinate.longitude}`
    }

    return coordinatesLiteral
  }

  private static getCompanyProducer(crop, type = 'PRODUCER') {
    const member = crop.members.filter((item) => item.type === type)[0]

    return CompanyService.search({ identifier: member.identifier })
  }
}

export default PDF
