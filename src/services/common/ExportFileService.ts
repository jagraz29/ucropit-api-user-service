import json2xlsx from 'node-json-xlsx'
import { Parser } from 'json2csv'
import fs from 'fs'
import { getFullPath } from '../../utils/Files'
import { reportHeaderXls, fieldsCSV } from '../../types/reports'
import { dataSetHeaderXls, dataSetFieldsCSV } from '../../types/dataset'

export interface OptionsXls {
  fields?: Object | Array<String>
  fieldNames: Array<String>
}

export interface OptionsCsv {
  label: String
  value: String
}

class ExportFileService {
  /**
   *
   * @param data
   * @param mode
   */
  public static modeExport(data: Array<any>, mode: string | any) {
    if (mode === 'xls') {
      return this.exportXls(
        data,
        reportHeaderXls,
        'dashboard_soja_sustentable.xlsx'
      )
    }

    if (mode === 'csv') {
      return this.exportCsv(data, fieldsCSV)
    }
  }

  /**
   * Data Set export.
   *
   * @param Array data
   * @param string mode
   */
  public static dataSetExport(data: Array<any>, mode: string | any) {
    return this.exportXls(data, dataSetHeaderXls, 'dataset_crop.xlsx')
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
