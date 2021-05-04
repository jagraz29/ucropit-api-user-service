export const joinActivitiesByCrop = crop => {
  const { done, finished, toMake, pending } = crop
  delete crop.done
  delete crop.finished
  delete crop.toMake
  delete crop.pending
  return { ...crop, activities: [...done, ...finished, ...toMake, ...pending] }
}
