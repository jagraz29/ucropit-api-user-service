import PDF from '../utils/PDF'
import Stamp from '../utils/Stamp'

import { basePath, getFullPath, makeDirIfNotExists } from '../utils/Files'

class BlockChainServices {
  /**
   *
   * @param crop
   * @param activity
   * @param user
   */
  public static async sign (crop, activity, user) {
    console.log(crop)
    await makeDirIfNotExists(
      `${basePath()}${process.env.DIR_PDF_SINGS}/${activity.key}`
    )

    const { hash, path } = await PDF.generate({
      pathFile: `${basePath()}${process.env.DIR_PDF_SINGS}/${activity.key}-${
        activity.type.name.es
      }-${user._id}-sing.pdf`,
      data: `
        CULTIVO
        -------------------------------------------------
        Cultivo: ${crop.cropType.name.es}
        Razon Social:
        CUIT:
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
  `,
      files: activity.files
    })

    console.log(hash, path)
  }

  //   private static createStringLots (lots) {
  //     let lotsLiteral = ''

  //     for (const lot of lots) {
  //       lotsLiteral = `
  //                 -Latitude: ${lot.}
  //         `
  //     }
  //   }
}

export default BlockChainServices
