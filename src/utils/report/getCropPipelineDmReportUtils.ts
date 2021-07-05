export const getCropPipelineDmReportUtils = ({ identifier }) => {
  const lookupActivityAgreement: any = {
    from: 'typeagreements',
    let: {
      typeAgreementId: '$typeAgreement'
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ['$_id', '$$typeAgreementId']
          }
        }
      }
    ],
    as: 'typeAgreement'
  }

  const lookupFilesActivity: any = {
    from: 'filedocuments',
    let: {
      fileIds: '$files'
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $in: ['$_id', '$$fileIds']
          },
          description: {
            $in: ['Facturas Regalias', 'Factura Semillas']
          }
        }
      },
      {
        $project: {
          _id: 1,
          description: 1
        }
      }
    ],
    as: 'files'
  }

  const lookupActivitiesFilter: any = {
    from: 'activities',
    let: {
      activityToMakeIds: '$toMake',
      activityDoneIds: '$done',
      activityFinishedIds: '$finished'
    },
    pipeline: [
      {
        $lookup: lookupActivityAgreement
      },
      {
        $unwind: {
          path: '$typeAgreement',
          preserveNullAndEmptyArrays: true
        }
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
          'typeAgreement.key': 'SEED_USE',
          'typeAgreement.visible': {
            $in: [identifier]
          }
        }
      },
      {
        $lookup: lookupFilesActivity
      },
      {
        $addFields: {
          paymentType: {
            $reduce: {
              input: '$files',
              initialValue: [],
              in: {
                $concatArrays: [
                  '$$value',
                  {
                    $cond: {
                      if: {
                        $in: ['$$this.description', '$$value.description']
                      },
                      then: [],
                      else: ['$$this']
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $unwind: {
          path: '$paymentType',
          preserveNullAndEmptyArrays: true
        }
      }
    ],
    as: 'activities'
  }

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

  const lookupLotsAchievements: any = {
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
      },
      {
        $project: {
          _id: 1,
          name: 1
        }
      }
    ],
    as: 'lots'
  }

  const lookupFilesAchievements: any = {
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
          description: 1
        }
      }
    ],
    as: 'files'
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
          },
          'signers.signed': {
            $nin: [false]
          }
        }
      },
      {
        $lookup: lookupLotsAchievements
      } /*,{
      $addFields: {
        lotsName: {
          $reduce : {
            input: '$lots',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', {
                $cond: {
                  if: {
                    $in: ['$$this.name', '$$value.name']
                  },
                  then: [],
                  else: ['$$this']
                }
              }]
            }
          }
        }
      }
    }*/,
      {
        $lookup: lookupFilesAchievements
      },
      {
        $unwind: {
          path: '$supplies',
          preserveNullAndEmptyArrays: true
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
        $unwind: {
          path: '$activityType',
          preserveNullAndEmptyArrays: true
        }
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
          'activityType.tag': 'ACT_SOWING'
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

  const pipelineProyect: any = {
    cropId: '$_id',
    activityId: '$activities._id',
    achievementId: '$activities.achievements._id',
    identifier: 1,
    companyName: '$company.name',
    cropName: '$name',
    cropLotTag: '$activities.achievements.lots.name',
    supplyId: '$activities.achievements.supplies._id',
    supplieName: '$activities.achievements.supplies.name',
    activitySurface: '$activities.surface',
    activitySupply: 1,
    kilogramsPlanified: {
      $cond: {
        if: {
          $gte: ['$activitySupply.total', 0]
        },
        then: {
          $round: [
            {
              $multiply: ['$activities.surface', '$activitySupply.total']
            },
            2
          ]
        },
        else: 0
      }
    },
    densityPlanified: {
      $cond: {
        if: {
          $gte: ['$activitySupply.quantity', 0]
        },
        then: '$activitySupply.quantity',
        else: 0
      }
    },
    sowingDate: {
      $dateToString: {
        format: '%d/%m/%Y',
        date: '$activities.dateStart'
      }
    },
    kilogramsSowined: '$activities.achievements.supplies.total',
    haSowined: '$activities.achievements.surface',
    sowingDensity: {
      $round: [
        {
          $divide: [
            '$activities.achievements.supplies.total',
            '$activities.achievements.surface'
          ]
        },
        2
      ]
    },
    paymentType: '$paymentType'
  }

  const pipeline: Array<any> = [
    {
      $match: {
        cancelled: false
      }
    },
    {
      $lookup: lookupActivitiesFilter
    },
    {
      $redact: {
        $cond: {
          if: {
            $gt: [
              {
                $size: ['$activities']
              },
              0
            ]
          },
          then: '$$KEEP',
          else: '$$PRUNE'
        }
      }
    },
    {
      $addFields: {
        paymentType: {
          $reduce: {
            input: '$activities.paymentType',
            initialValue: '',
            in: {
              $cond: {
                if: {
                  $eq: ['$$value', '']
                },
                then: '$$this.description',
                else: {
                  $concat: ['$$value', ', ', '$$this.description']
                }
              }
            }
          }
        }
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
      $lookup: lookupCompany
    },
    {
      $unwind: {
        path: '$company',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        activitySupply: {
          $filter: {
            input: '$activities.supplies',
            as: 'supply',
            cond: {
              $eq: ['$$supply.name', '$activities.achievements.supplies.name']
            }
          }
        }
      }
    },
    {
      $unwind: {
        path: '$activitySupply',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: pipelineProyect
    },
    {
      $sort: {
        supplieName: 1
      }
    }
  ]

  return pipeline
}
