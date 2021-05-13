import ServiceBase from './common/ServiceBase'
const staticMapApi = process.env.GOOGLE_API_STATIC_MAP
const apiKey = process.env.GOOGLE_API_KEY

class StaticMapService extends ServiceBase {
  public static getStaticMapImageUrl (data) {
    let path: string = `fillcolor:${data.path.fillcolor}|color:${data.path.color}|weight:${data.path.weight}`

    data.path.area.map((element) => {
      path = path + '|' + element[1] + ',' + element[0]
    })

    return `${staticMapApi}?center=${data.center.latitude},${data.center.longitude}&zoom=${data.zoom}&size=${data.size}&maptype=${data.maptype}&path=${path}&key=${apiKey}`
  }
}

export default StaticMapService
