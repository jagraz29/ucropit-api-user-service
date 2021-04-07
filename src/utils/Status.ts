const getStatus = (name) => {
  const status = [
    {
      es: 'COMPLETAR',
      en: 'TO_COMPLETE'
    },
    {
      es: 'PLANIFICADA',
      en: 'PLANNED'
    },
    {
      es: 'REALIZADA',
      en: 'DONE'
    },
    {
      es: 'TERMINADA',
      en: 'FINISHED'
    }
  ]

  return status.find((item) => item.en === name)
}

export const statusActivities = (name) => {
  return [
    {
      name: getStatus(name)
    }
  ]
}
