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
    'crop_name',
    'volume',
    'surface',
    'responsible',
    'date_sowing',
    'date_harvest',
    'date_created_crop',
    'city',
    'province',
    'kmz_links',
    'tags_lots',
    'name_lot',
    'surface_total',
    'link_sustainability_agreements',
    'link_pdf_ots_agreement_sus',
    'names_signers_sustainability_agreements',
    'total_surface_sus',
    'link_land_use_agreement',
    'link_pdf_ots_agreement_explo',
    'names_signers_land_use',
    'total_surface_explo',
    'surface_planned_sowing',
    'date_achievement_sowing',
    'surface_achievement_sowing',
    'total_surface_signed_sowing',
    'date_sign_achievement_by_lot_sowing',
    'total_surface_with_evidence_sowing',
    'link_pdf_ots_sowing',
    'link_evidences_files_sowing',
    'cant_achievements_sowing',
    'surface_planned_harvest',
    'date_achievement_harvest',
    'surface_achievement_harvest',
    'total_surface_signed_harvest',
    'date_sign_achievement_by_lot_harvest',
    'total_surface_with_evidence_harvest',
    'link_pdf_ots_harvest',
    'link_evidences_files_harvest',
    'cant_achievements_harvest',
    'surface_planned_application',
    'date_achievement_application',
    'surface_achievement_application',
    'total_surface_signed_application',
    'date_sign_achievement_by_lot_application',
    'total_surface_with_evidence_application',
    'link_pdf_ots_application',
    'link_evidences_files_application',
    'cant_achievements_application',
    'surface_planned_fertilization',
    'date_achievement_fertilization',
    'surface_achievement_fertilization',
    'total_surface_signed_fertilization',
    'date_sign_achievement_by_lot_fertilization',
    'total_surface_with_evidence_fertilization',
    'link_pdf_ots_fertilization',
    'link_evidences_files_fertilization',
    'cant_achievements_fertilization',
    'surface_planned_tillage',
    'date_achievement_tillage',
    'surface_achievement_tillage',
    'total_surface_signed_tillage',
    'date_sign_achievement_by_lot_tillage',
    'total_surface_with_evidence_tillage',
    'link_pdf_ots_tillage',
    'link_evidences_files_tillage',
    'cant_achievements_tillage',
    'mail_producers',
    'phone_producers'
  ],
  fieldNames: [
    'CUIT',
    'razon social',
    'Cultivo',
    'Nombre del Cultivo',
    'Volumen TON (has x rinde en TON)',
    'has',
    'Ing Responsable/s',
    'Fecha Estimada de Siembra',
    'Fecha Estimada de Cosecha',
    'Fecha de Registración del Cultivo',
    'Departamento Lote',
    'Provincia Lote',
    'Localizacion KMZ',
    'Establecimiento o Agrupador de lotes',
    'Nombre del Lote',
    'Archivo a KMZ LOTE',
    'Documentos de Acuerdo de Sustentabilidad',
    'Lista de HASH de firmas ACUERDOS SUSTENTABILIDAD ',
    'Nombre Firmantes ACUERDOS SUSTENTABILIDAD',
    'HAS ACUERDO SUSTENTABILIDAD',
    'Documentos de Acuerdo de Uso de Suelo',
    'Lista de HASH de firmas ACUERDOS de USO DE SUELO',
    'Nombre Firmantes ACUERDOS de USO DE SUELO',
    'HAS ACUERDOS de USO DE SUELO',
    'Superficie de Planificacion de la ACTIVIDAD SIEMBRA',
    'Fecha de realizacion del lote ACTIVIDAD SIEMBRA',
    'Superficie de la Realizacion de la ACTIVIDAD SIEMBRA',
    'Total Superficie firmada de la ACTIVIDAD SIEMBRA',
    'Fecha de Firma x realizacion del lote por ACTIVIDAD SIEMBRA',
    'Superficie con evidencia x ACTIVIDAD SIEMBRA',
    'Link de descarga de archivos de firmas Siembra',
    'Link evidencias Siembra',
    'Cantidad de realización por Lote de ACTIVIDAD SIEMBRA',
    'Superficie de Planificacion de la ACTIVIDAD COSECHA',
    'Fecha de realizacion del lote ACTIVIDAD COSECHA',
    'Superficie de la Realizacion de la ACTIVIDAD COSECHA',
    'Total Superficie firmada de la ACTIVIDAD COSECHA',
    'Fecha de Firma x realizacion del lote por ACTIVIDAD COSECHA',
    'Superficie con evidencia x ACTIVIDAD COSECHA',
    'Link de descarga de archivos de firmas Cosecha',
    'Link evidencias Cosecha',
    'Cantidad de realización por Lote de ACTIVIDAD COSECHA',
    'Superficie de Planificacion de la ACTIVIDAD APLICACIÓN',
    'Fecha de realizacion del lote ACTIVIDAD APLICACIÓN',
    'Superficie de la Realizacion de la ACTIVIDAD APLICACIÓN',
    'Total Superficie firmada de la ACTIVIDAD APLICACIÓN',
    'Fecha de Firma x realizacion del lote por ACTIVIDAD APLICACIÓN',
    'Superficie con evidencia x ACTIVIDAD APLICACIÓN',
    'Link de descarga de archivos de firmas Aplicación',
    'Link evidencias Aplicación',
    'Cantidad de realización por Lote de ACTIVIDAD APLICACIÓN',
    'Superficie de Planificacion de la ACTIVIDAD FERTILIZACIÓN',
    'Fecha de realizacion del lote ACTIVIDAD FERTILIZACIÓN',
    'Superficie de la Realizacion de la ACTIVIDAD FERTILIZACIÓN',
    'Total Superficie firmada de la ACTIVIDAD FERTILIZACIÓN',
    'Fecha de Firma x realizacion del lote por ACTIVIDAD FERTILIZACIÓN',
    'Superficie con evidencia x ACTIVIDAD FERTILIZACIÓN',
    'Link de descarga de archivos de firmas Fertilización',
    'Link evidencias Fertilización',
    'Cantidad de realización por Lote de ACTIVIDAD FERTILIZACIÓN',
    'Superficie de Planificacion de la ACTIVIDAD LABORES',
    'Fecha de realizacion del lote ACTIVIDAD LABORES',
    'Superficie de la Realizacion de la ACTIVIDAD LABORES',
    'Total Superficie firmada de la ACTIVIDAD LABORES',
    'Fecha de Firma x realizacion del lote por ACTIVIDAD LABORES',
    'Superficie con evidencia x ACTIVIDAD LABORES',
    'Link de descarga de archivos de firmas Labores',
    'Link evidencias Labores',
    'Cantidad de realización por Lote de ACTIVIDAD LABORES',
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
    label: 'Nombre del Cultivo',
    value: 'crop_name'
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
    label: 'Fecha estimada de Siembra',
    value: 'date_sowing'
  },
  {
    label: 'Fecha Estimada de Cosecha',
    value: 'date_harvest'
  },
  {
    label: 'Fecha de registración del Cultivo',
    value: 'date_created_crop'
  },
  {
    label: 'Departamento Lote',
    value: 'city'
  },
  {
    label: 'Provincia Lote',
    value: 'province'
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
    label: 'Nombre del Lote',
    value: 'name_lot'
  },
  {
    label: 'Archivo a KMZ LOTE',
    value: 'surface_total'
  },
  {
    label: 'Documentos de Acuerdo de Sustentabilidad',
    value: 'link_sustainability_agreements'
  },
  {
    label: 'Lista de HASH de firmas ACUERDOS SUSTENTABILIDAD ',
    value: 'link_pdf_ots_agreement_sus'
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
    label: 'Link archivos de firmas ACUERDOS de USO DE SUELO',
    value: 'link_pdf_ots_agreement_explo'
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
    label: 'Superficie de Planificacion de la ACTIVIDAD SIEMBRA',
    value: 'surface_planned_sowing'
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
    label: 'Lote Cantidad de realización de Actividad Siembra',
    value: 'cant_achievements_sowing'
  },
  {
    label: 'Superficie de Planificacion de la ACTIVIDAD COSECHA',
    value: 'surface_planned_harvest'
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
    label: 'Lote Cantidad de realización de Actividad Cosecha',
    value: 'cant_achievements_harvest'
  },
  {
    label: 'Superficie de Planificacion de la ACTIVIDAD APLICACIÓN',
    value: 'surface_planned_application'
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
    label: 'Lote Cantidad de realización de Actividad Aplicación',
    value: 'cant_achievements_application'
  },
  {
    label: 'Superficie de Planificacion de la ACTIVIDAD FERTILIZACIÓN',
    value: 'surface_planned_fertilization'
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
    label: 'Lote Cantidad de realización de Actividad Fertilización',
    value: 'cant_achievements_fertilization'
  },
  {
    label: 'Superficie de Planificacion de la ACTIVIDAD LABORES',
    value: 'surface_planned_tillage'
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
    label: 'Lote Cantidad de realización de Actividad Labores',
    value: 'cant_achievements_tillage'
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
  public static modeExport(data: Array<any>, mode: string | any) {
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
  public static exportXls(data: Array<any>, options: OptionsXls): string {
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
  public static exportCsv(data: Array<any>, options: Array<OptionsCsv>) {
    const opts = { options }
    const parser = new Parser(opts)

    const csv = parser.parse(data)

    return csv
  }
}

export default ExportFileService
