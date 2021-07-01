export const calculateCropVolumeUtils = (
  unit: string,
  pay: number,
  surface: number
) => {
  if (unit === 'kg') {
    return (pay / 1000) * surface
  }

  if (unit === 't') {
    return pay * surface
  }

  if (unit === 'q') {
    return (pay / 10) * surface
  }

  return 0
}
