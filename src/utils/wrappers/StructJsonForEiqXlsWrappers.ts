import moment from 'moment-timezone'

export const structJsonForEiqXls = crops => {
  let xlsRows = []

  crops.map(crop => {

  	if(!crop.supplieName || !crop.lotName) return

  	let evidences = crop.evidences.map(evidence => {
  		return evidence.baseUrl + '/' + evidence.filePath
  	})

  	const newCrop = {
  		...crop,
  		kmzLocation: crop.kmzLocation.baseUrl + crop.kmzLocation.lotId,
  		scheduleDate: moment(crop.scheduleDate).format('DD/MM/YYYY'),
  		achievementDate: moment(crop.achievementDate).format('DD/MM/YYYY'),
  		evidences: evidences.join(', '),
  	}

  	xlsRows.push(newCrop)

  })


  return xlsRows
}
