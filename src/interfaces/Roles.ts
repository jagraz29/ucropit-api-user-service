export interface IRoles {
  value?: string
  label?: {
    en?: string
    es?: string
  }
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
