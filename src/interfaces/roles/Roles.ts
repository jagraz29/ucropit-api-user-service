import { INameLanguageProps } from '../../core/commons/interfaces'

export interface IRoles {
  _id?: string
  value?: string
  label?: INameLanguageProps
}

export enum roles {
  PRODUCER_ADVISER = 'Asesor',
  PRODUCER_ADVISER_ENCOURAGED = 'Asesor Promotor',
  PRODUCER = 'Productor',
  PROVIDER = 'Proveedor',
  MARKETER = 'Comercializador',
  CAM = 'KAM',
  KAM = 'KAM',
  CONTACT_REPRESENTATIVE = 'Responsable Comercial'
}
