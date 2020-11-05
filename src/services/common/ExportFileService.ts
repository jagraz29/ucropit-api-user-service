import json2xlsx from 'node-json-xlsx'
import { Parser } from 'json2csv'
import fs from 'fs'
import { getFullPath } from '../../utils/Files'

export interface OptionsXls {
  fields?: Object | Array<String>
  fieldNames: Array<String>
}

export interface OptionsCsv {
  label: String
  value: String
}

const headerXls = {
  fields: [
    'cuit',
    'business_name',
    'crop',
    'volume',
    'surface',
    'responsible',
    'date_harvest',
    'localization',
    'kmz_links',
    'surface_total',
    'link_sustainability_agreements',
    'link_land_use_agreement',
    'total_surface_sus',
    'total_surface_explo'
  ],
  fieldNames: [
    'CUIT',
    'razon social',
    'Cultivo',
    'Volumen TON (has x rinde en TON)',
    'has',
    'Ing Responsable/s',
    'Fecha Estimada de Cosecha',
    'Localizaciones',
    'Localizacion KMZ',
    'HAS KMZ',
    'Link ACUERDOS SUSTENTABILIDAD',
    'Link ACUERDOS de USO DE SUELO',
    'HAS ACUERDO SUSTENTABILIDAD',
    'HAS ACUERDOS de USO DE SUELO'
  ]
}

const fields = [
  {
    label: 'CUIT',
    value: 'cuit'
  },
  {
    label: 'razon social',
    value: 'business_name'
  },
  {
    label: 'Cultivo',
    value: 'crop'
  },
  {
    label: 'Volumen TON (has x rinde en TON)',
    value: 'volume'
  },
  {
    label: 'has',
    value: 'surface'
  },
  {
    label: 'Ing Responsable/s',
    value: 'responsible'
  },
  {
    label: 'Fecha Estimada de Cosecha',
    value: 'date_harvest'
  },
  {
    label: 'Localizaciones',
    value: 'localization'
  },
  {
    label: 'Localizacion KMZ',
    value: 'kmz_links'
  },
  {
    label: 'HAS KMZ',
    value: 'surface_total'
  },
  {
    label: 'Link ACUERDOS SUSTENTABILIDAD',
    value: 'link_sustainability_agreements'
  },
  {
    label: 'Link ACUERDOS de USO DE SUELO',
    value: 'link_land_use_agreement'
  },
  {
    label: 'HAS ACUERDO SUSTENTABILIDAD',
    value: 'total_surface_sus'
  },
  {
    label: 'Año',
    value: 'HAS ACUERDOS de USO DE SUELO'
  }
]

class ExportFileService {
  /**
   *
   * @param data
   * @param mode
   */
  public static modeExport (data: Array<any>, mode: string | any) {
    if (mode === 'xls') {
      return this.exportXls(data, headerXls)
    }

    if (mode === 'csv') {
      return this.exportCsv(data, fields)
    }
  }
  /**
   *
   * @param data
   * @param options
   */
  public static exportXls (data: Array<any>, options: OptionsXls): string {
    const xlsx = json2xlsx(data, options)

    fs.writeFileSync(
      getFullPath('/uploads/tmp/dashboard_soja_sustentable.xlsx'),
      xlsx,
      'binary'
    )

    return getFullPath('/uploads/tmp/dashboard_soja_sustentable.xlsx')
  }

  /**
   *
   * @param data
   * @param options
   */
  public static exportCsv (data: Array<any>, options: Array<OptionsCsv>) {
    const opts = { options }
    const parser = new Parser(opts)

    const csv = parser.parse(data)

    return csv
  }
}

export default ExportFileService
