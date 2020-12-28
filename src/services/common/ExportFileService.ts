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
    'tags_lots',
    'surface_total',
    'link_sustainability_agreements',
    'hash_sustainability_agreements_sign',
    'names_signers_sustainability_agreements',
    'total_surface_sus',
    'link_land_use_agreement',
    'hash_land_use_sign',
    'names_signers_land_use',
    'total_surface_explo',
    'link_pdf_ots_agreement',
    'percent_achievements_sowing',
    'surfaces_signed_sowing',
    'surfaces_files_approved',
    'link_pdf_ots_sowing',
    'percent_achievements_harvest',
    'surfaces_signed_harvest',
    'surfaces_files_approved_harvest',
    'link_pdf_ots_harvest',

    'percent_achievements_application',
    'surfaces_signed_application',
    'surfaces_files_approved_application',
    'link_pdf_ots_application',

    'percent_achievements_fertilization',
    'surfaces_signed_fertilization',
    'surfaces_files_approved_fertilization',
    'link_pdf_ots_fertilization',

    'percent_achievements_tillage',
    'surfaces_signed_tillage',
    'surfaces_files_approved_tillage',
    'link_pdf_ots_tillage',

    'mail_producers',
    'phone_producers'
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
    'Establecimiento o Agrupador de lotes',
    'HAS KMZ',
    'Link ACUERDOS SUSTENTABILIDAD',
    'Lista de HASH de firmas ACUERDOS SUSTENTABILIDAD',
    'Nombre Firmantes ACUERDOS SUSTENTABILIDAD',
    'HAS ACUERDO SUSTENTABILIDAD',
    'Link ACUERDOS de USO DE SUELO',
    'Lista de HASH de firmas ACUERDOS de USO DE SUELO',
    'Nombre Firmantes ACUERDOS de USO DE SUELO',
    'HAS ACUERDOS de USO DE SUELO',
    'Link de descarga de archivos de firmas Acuerdos',
    'Porcentaje de realización de Siembra',
    'Total Superficie firmada de  Siembra',
    'Superficie con evidencia aprovada Siembra',
    'Link de descarga de archivos de firmas Siembra',
    'Porcentaje de realización de Cosecha',
    'Total Superficie firmada de  Cosecha',
    'Superficie con evidencia aprovada Cosecha',
    'Link de descarga de archivos de firmas Cosecha',
    'Porcentaje de realización de Aplicación',
    'Total Superficie firmada de  Aplicación',
    'Superficie con evidencia aprovada Aplicación',
    'Link de descarga de archivos de firmas Aplicación',
    'Porcentaje de realización de Fertilización',
    'Total Superficie firmada de  Fertilización',
    'Superficie con evidencia aprovada Fertilización',
    'Link de descarga de archivos de firmas Fertilización',
    'Porcentaje de realización de Labores',
    'Total Superficie firmada de  Labores',
    'Superficie con evidencia aprovada Labores',
    'Link de descarga de archivos de firmas Labores',
    'Mail de los Productores',
    'Teléfono de los Producuctores'
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
    label: 'Establecimiento o Agrupador de lotes',
    value: 'tags_lots'
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
    label: 'Lista de HASH de firmas ACUERDOS SUSTENTABILIDAD',
    value: 'hash_sustainability_agreements_sign'
  },
  {
    label: 'Nombre Firmantes ACUERDOS SUSTENTABILIDAD',
    value: 'names_signers_sustainability_agreements'
  },
  {
    label: 'Link ACUERDOS de USO DE SUELO',
    value: 'link_land_use_agreement'
  },
  {
    label: 'Lista de HASH de firmas ACUERDOS de USO DE SUELO',
    value: 'hash_land_use_sign'
  },
  {
    label: 'HAS ACUERDO SUSTENTABILIDAD',
    value: 'total_surface_sus'
  },
  {
    label: 'Nombre Firmantes ACUERDOS de USO DE SUELO',
    value: 'names_signers_land_use'
  },
  {
    label: 'HAS ACUERDOS de USO DE SUELO',
    value: 'total_surface_explo'
  },
  {
    label: 'Link de descarga de archivos de firmas Acuerdos',
    value: 'link_pdf_ots_agreement'
  },
  {
    label: 'Porcentaje de realización de Siembra',
    value: 'percent_achievements_sowing'
  },
  {
    label: 'Total Superficie firmada de  Siembra',
    value: 'surfaces_signed_sowing'
  },
  {
    label: 'Superficie con evidencia aprovada Siembra',
    value: 'surfaces_files_approved'
  },
  {
    label: 'Link de descarga de archivos de firmas Siembra',
    value: 'link_pdf_ots_sowing'
  },
  {
    label: 'Porcentaje de realización de Cosecha',
    value: 'percent_achievements_harvest'
  },
  {
    label: 'Total Superficie firmada de  Cosecha',
    value: 'surfaces_signed_harvest'
  },
  {
    label: 'Superficie con evidencia aprovada Cosecha',
    value: 'surfaces_files_approved_harvest'
  },
  {
    label: 'Link de descarga de archivos de firmas Cosecha',
    value: 'link_pdf_ots_harvest'
  },
  {
    label: 'Porcentaje de realización de Aplicación',
    value: 'percent_achievements_application'
  },
  {
    label: 'Total Superficie firmada de Aplicación',
    value: 'surfaces_signed_application'
  },
  {
    label: 'Superficie con evidencia aprovada Aplicación',
    value: 'surfaces_files_approved_application'
  },
  {
    label: 'Link de descarga de archivos de firmas Aplicación',
    value: 'link_pdf_ots_application'
  },
  {
    label: 'Porcentaje de realización de Fertilización',
    value: 'percent_achievements_fertilization'
  },
  {
    label: 'Total Superficie firmada de Fertilización',
    value: 'surfaces_signed_fertilization'
  },
  {
    label: 'Superficie con evidencia aprovada Fertilización',
    value: 'surfaces_files_approved_fertilization'
  },
  {
    label: 'Link de descarga de archivos de firmas Fertilización',
    value: 'link_pdf_ots_fertilization'
  },
  {
    label: 'Porcentaje de realización de Labores',
    value: 'percent_achievements_tillage'
  },
  {
    label: 'Total Superficie firmada de Labores',
    value: 'surfaces_signed_tillage'
  },
  {
    label: 'Superficie con evidencia aprovada Labores',
    value: 'surfaces_files_approved_tillage'
  },
  {
    label: 'Link de descarga de archivos de firmas Labores',
    value: 'link_pdf_ots_tillage'
  },
  {
    label: 'Mail de los Productores',
    value: 'mail_producers'
  },
  {
    label: 'Teléfono de los Producuctores',
    value: 'phone_producers'
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
