export const getCropPipelineXlsForEiqReportUtils = () => {
  const lookupActivityType: any = {
    from: 'activitytypes',
    let: {
      activityTypeId: '$type'
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ['$_id', '$$activityTypeId']
          }
        }
      }
    ],
    as: 'activityType'
  }

  const lookupLots: any = {
    from: 'lots',
    let: {
      lotIds: '$lots'
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $in: ['$_id', '$$lotIds']
          }
        }
      }
    ],
    as: 'lots'
  }

  const lookupFiles: any = {
    from: 'filedocuments',
    let: {
      fileIds: '$files'
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $in: ['$_id', '$$fileIds']
          }
        }
      },
      {
        $project: {
          _id: 1,
          filePath: {
            $concat: [process.env.BASE_URL, '/', '$path']
          }
        }
      }
    ],
    as: 'files'
  }

  const lookupSupply: any = {
    from: 'supplies',
    let: {
      supplyId: '$supplies.supply'
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ['$_id', '$$supplyId']
          }
        }
      }
    ],
    as: 'supply'
  }

  const lookupAchievements: any = {
    from: 'achievements',
    let: {
      achievementsIds: '$achievements'
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $in: ['$_id', '$$achievementsIds']
          }
        }
      },
      {
        $lookup: lookupLots
      },
      {
        $lookup: lookupFiles
      },
      {
        $unwind: {
          path: '$supplies',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: lookupSupply
      },
      {
        $unwind: {
          path: '$supply',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$lots'
        }
      },
      {
        $addFields: {
          supplyEiq: {
            $reduce: {
              input: '$supply.activeIngredients.eiq',
              initialValue: 0,
              in: {
                $sum: ['$$value', '$$this']
              }
            }
          }
        }
      }
    ],
    as: 'achievements'
  }

  const lookupActivities: any = {
    from: 'activities',
    let: {
      activityToMakeIds: '$toMake',
      activityDoneIds: '$done',
      activityFinishedIds: '$finished'
    },
    pipeline: [
      {
        $lookup: lookupActivityType
      },
      {
        $match: {
          $expr: {
            $or: [
              {
                $in: ['$_id', '$$activityToMakeIds']
              },
              {
                $in: ['$_id', '$$activityDoneIds']
              },
              {
                $in: ['$_id', '$$activityFinishedIds']
              }
            ]
          },
          'activityType.tag': 'ACT_APPLICATION'
        }
      },
      {
        $unwind: {
          path: '$activityType',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$supplies',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: lookupAchievements
      },
      {
        $unwind: {
          path: '$achievements',
          preserveNullAndEmptyArrays: true
        }
      }
    ],
    as: 'activities'
  }

  const lookupCropType: any = {
    from: 'croptypes',
    let: {
      cropTypeId: '$cropType'
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ['$_id', '$$cropTypeId']
          }
        }
      }
    ],
    as: 'cropType'
  }

  const lookupCompany: any = {
    from: 'companies',
    let: {
      companyId: '$company'
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ['$_id', '$$companyId']
          }
        }
      }
    ],
    as: 'company'
  }

  const pipelineProject: any = {
    cropId: '$_id',
    activityId: '$activities._id',
    achievementId: '$activities.achievements._id',
    identifier: 1,
    companyName: '$company.name',
    cropTypeName: '$cropType.name.es',
    cropName: '$name',
    establishments: '$lots.tag',
    lotName: '$activities.achievements.lots.name',
    lotSurface: '$activities.achievements.lots.surface',
    kmzLocation: {
      $concat: [
        process.env.BASE_URL,
        '/v1/reports/map/lot?id=',
        { $toString: '$activities.achievements.lots._id' }
      ]
    },
    achievementSuppliesId: '$activities.achievements.supplies._id',
    achievementSuppliesName: '$activities.achievements.supplies.name',
    achievementSuppliesUnit: '$activities.achievements.supplies.unit',
    achievementSuppliesQuantity: '$activities.achievements.supplies.quantity',
    achievementSuppliesTotal: '$activities.achievements.supplies.total',
    achievementSupplyId: '$activities.achievements.supply._id',
    achievementSupplyEiq: '$activities.achievements.supplyEiq',
    achievementDate: {
      $dateToString: {
        format: '%d/%m/%Y',
        date: '$activities.achievements.dateAchievement'
      }
    },
    achievementSurface: '$activities.achievements.surface',
    evidences: {
      $reduce: {
        input: '$activities.achievements.files',
        initialValue: '',
        in: {
          $cond: {
            if: {
              $eq: ['$$value', '']
            },
            then: '$$this.filePath',
            else: {
              $concat: ['$$value', ', ', '$$this.filePath']
            }
          }
        }
      }
    },
    activitySuppliesId: '$activities.supplies._id',
    activitySuppliesUnit: '$activities.supplies.unit',
    activitySuppliesQuantity: '$activities.supplies.quantity',
    activitySuppliesTotal: '$activities.supplies.total',
    activitySuppliesEiq: '$activities.supplies.eiq',
    activityDateStart: {
      $dateToString: {
        format: '%d/%m/%Y',
        date: '$activities.dateStart'
      }
    },
    activitySurface: '$activities.surface'
  }

  const pipeline: Array<any> = [
    {
      $match: {
        cancelled: false
      }
    },
    {
      $lookup: lookupActivities
    },
    {
      $redact: {
        $cond: {
          if: {
            $and: [
              {
                $gt: [
                  {
                    $size: ['$activities']
                  },
                  0
                ]
              },
              {
                $gt: [
                  {
                    $size: ['$activities.achievements']
                  },
                  0
                ]
              },
              {
                $gt: [
                  {
                    $size: ['$activities.achievements.supplies']
                  },
                  0
                ]
              }
            ]
          },
          then: '$$KEEP',
          else: '$$PRUNE'
        }
      }
    },
    {
      $unwind: {
        path: '$activities',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $redact: {
        $cond: {
          if: {
            $and: [
              {
                $ifNull: ['$activities.achievements.dateAchievement', false]
              }
            ]
          },
          then: '$$KEEP',
          else: '$$PRUNE'
        }
      }
    },
    {
      $lookup: lookupCropType
    },
    {
      $unwind: {
        path: '$cropType',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: lookupCompany
    },
    {
      $unwind: {
        path: '$company',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: pipelineProject
    },
    {
      $sort: {
        lotName: 1,
        achievementDate: -1,
        achievementSuppliesName: 1
      }
    }
  ]

  return pipeline
}
