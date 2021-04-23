export interface RequestProps {
  lotId: string
  harvestDate: string
  area: any
  customOptions: Object
}

interface FormatPropsNamesImages {
  RGB: string
  NDVI: string
}

export interface ImageSatellite {
  prev: FormatPropsNamesImages
  post: FormatPropsNamesImages
}

export interface ResponseOkProps {
  status_ok: string
  lotId: string
  customObject?: any
  file_names: ImageSatellite
  dates: {
    prev: string
    post: string
  }
}

export interface ResponseFailure {}
