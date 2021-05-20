export const joinActivitiesByCrop = (crop) => {
  const { done, finished, toMake, pending } = crop
  delete crop.done
  delete crop.finished
  delete crop.toMake
  delete crop.pending
  return { ...crop, activities: [...done, ...finished, ...toMake, ...pending] }
}

export const joinActivitiesFilterTypeWithCrop = (crops, type) => {
  return crops.map((crop) => {
    const { done, finished } = crop

    delete crop.done
    delete crop.finished
    delete crop.toMake
    delete crop.pending

    const doneFiltering = filterActivitiesByType(done, type)
    const finishedFiltering = filterActivitiesByType(finished, type)

    return { ...crop, activities: [...doneFiltering, ...finishedFiltering] }
  })
}

const filterActivitiesByType = (activities, type) => {
  return activities.filter((activity) => activity.type.tag === type)
}
