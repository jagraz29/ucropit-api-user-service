import fs from 'fs'
import { Parser } from 'json2csv'
import moment from 'moment'
import json2xlsx from 'node-json-xlsx'
import { dataSetFieldsCSV } from '../../types/dataset'
import {
  fieldsCSV,
  reportHeaderXls,
  reportHeaderXlsAplicationBilling,
  reportHeaderXlsSowingBilling
} from '../../types/reports'
import { getFullPath } from '../../utils/Files'

export interface OptionsXls {
  fields?: Object | Array<string>
  fieldNames: Array<string>
}

export interface OptionsCsv {
  label: string
  value: string
}

class ExportFileService {
  /**
   *
   * @param data
   * @param mode
   * @param language
   */
  public static modeExport(
    data: Array<any>,
    mode: string | any,
    language?: string
  ) {
    const today = moment()
    if (mode === 'xls') {
      return this.exportXls(
        data,
        language ? this.searchXlsByLanguage(language) : reportHeaderXls,
        `dashboard_soja_sustentable_${today.format('DD-MM-YYYY')}.xlsx`
      )
    }

    if (mode === 'csv') {
      return this.exportCsv(data, fieldsCSV)
    }
  }

  private static searchXlsByLanguage(language: string) {
    let xlsByLanguage: OptionsXls
    switch (language) {
      case 'es':
        xlsByLanguage = { fieldNames: reportHeaderXls.fieldNamesEs }
        break
      case 'en':
        xlsByLanguage = { fieldNames: reportHeaderXls.fieldNamesEn }
        break
      case 'pt':
        xlsByLanguage = { fieldNames: reportHeaderXls.fieldNamesPt }
        break
    }
    return xlsByLanguage
  }

  /**
   *
   * @param data
   * @param mode
   */
  public static modeExportSowingBilling(data: Array<any>, mode: string | any) {
    if (mode === 'xls') {
      return this.exportXls(
        data,
        reportHeaderXlsSowingBilling,
        'reporte_siembras_facturacion.xlsx'
      )
    }

    if (mode === 'csv') {
      return this.exportCsv(data, fieldsCSV)
    }
  }

  /**
   *
   * @param data
   * @param mode
   */
  public static modeExportAplicationBilling(
    data: Array<any>,
    mode: string | any
  ) {
    if (mode === 'xls') {
      return this.exportXls(
        data,
        reportHeaderXlsAplicationBilling,
        'reporte_aplicacion_facturacion.xlsx'
      )
    }

    if (mode === 'csv') {
      return this.exportCsv(data, fieldsCSV)
    }
  }

  /**
   * Export data set.
   *
   * @param Array data
   * @param string mode
   */
  public static dataSetExport(data: Array<any>, mode: string | any) {
    if (mode === 'csv') {
      return this.exportCsv(data, dataSetFieldsCSV)
    }

    return this.exportJson(data)
  }

  /**
   * Export Data in JSON.
   *
   * @param data
   * @param nameFile
   *
   * @return string
   */
  public static exportJson(data: any, nameFile?: string): string {
    const dataString: string = JSON.stringify(data, null, 2)
    const fileName = nameFile || 'dataset.json'

    const fileFullPath = `${getFullPath(`/uploads/tmp/${fileName}`)}`

    fs.writeFileSync(fileFullPath, dataString)

    return fileFullPath
  }

  /**
   *
   * @param data
   * @param options
   */
  public static exportXls(
    data: Array<any>,
    options: OptionsXls,
    nameFile: string
  ): string {
    const xlsx = json2xlsx(data, options)

    fs.writeFileSync(getFullPath(`/uploads/tmp/${nameFile}`), xlsx, 'binary')

    return getFullPath(`/uploads/tmp/${nameFile}`)
  }

  /**
   *
   * @param data
   * @param options
   */
  public static exportCsv(data: Array<any>, options: Array<OptionsCsv>) {
    const opts = { options }
    const parser = new Parser(opts)

    const csv = parser.parse(data)

    return csv
  }
}

export default ExportFileService
