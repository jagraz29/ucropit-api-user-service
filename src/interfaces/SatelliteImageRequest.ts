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
}

export interface ResponseOkProps {
  status_ok: boolean
  lotId: string
  customObject?: any
  images: Array<ImageSatelliteProps>
}

export interface ResponseFailure {}
