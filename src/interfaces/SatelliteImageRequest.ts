export interface RequestProps {
  lotId: string
  harvestDate: string
  area: any
  customOptions: Object
}

export interface ImageSatelliteProps {
  nameFile: string
  date: string
  type: string
  tag?: string
}

export interface ResponseOkProps {
  status_ok: boolean
  lotId: string
  description?: string
  customOptions?: any
  images?: Array<ImageSatelliteProps>
}
