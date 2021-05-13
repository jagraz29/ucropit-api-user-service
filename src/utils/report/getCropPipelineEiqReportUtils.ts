export const getCropPipelineEiqReportUtils = ({ identifier }) => {
  const lookupActivityAgreement: any = {
    from: 'typeagreements',
    let: {
      'typeAgreementId': '$typeAgreement',
    },
    pipeline: [{
      $match: {
        $expr: {
          $eq: ['$_id', '$$typeAgreementId']
        }
      }
    }],
    as: 'typeAgreement'
  }

  const lookupActivitiesFilter: any = {
    from: 'activities',
    let: {
      'activityToMakeIds': '$toMake',
      'activityDoneIds': '$done',
      'activityFinishedIds': '$finished',
    },
    pipeline: [{
      $lookup: lookupActivityAgreement
    },{
      $unwind: {
        path: '$typeAgreement',
        preserveNullAndEmptyArrays: true
      }
    },{
      $match: {
        $expr: {
          $or: [{
            $in: ['$_id', '$$activityToMakeIds']
          },{
            $in: ['$_id', '$$activityDoneIds']
          },{
            $in: ['$_id', '$$activityFinishedIds']
          }]
        },
        'typeAgreement.key' : 'RESPONSIBLE_USE',
        'typeAgreement.visible': {
          $in: [identifier]
        },
      }
    }],
    as: 'activities'
  }

  const lookupActivityType: any = {
    from: 'activitytypes',
    let: {
      'activityTypeId': '$type',
    },
    pipeline: [{
      $match: {
        $expr: {
          $eq : ['$_id', '$$activityTypeId']
        }
      }
    }],
    as: 'activityType'
  }

  const lookupLots: any = {
    from: 'lots',
    let: {
      'lotIds': '$lots',
    },
    pipeline: [{
      $match: {
        $expr: {
          $in: ['$_id', '$$lotIds']
        }
      }
    }],
    as: 'lots'
  }

  const lookupFiles: any = {
    from: 'filedocuments',
    let: {
      'fileIds': '$files',
    },
    pipeline: [{
      $match: {
        $expr: {
          $in: ['$_id', '$$fileIds']
        }
      }
    },{
      $project: {
        _id: 1,
        filePath: {
          $concat: [process.env.BASE_URL, '/', '$path']
        }
      }
    }],
    as: 'files'
  }

  const lookupAchievements: any = {
    from: 'achievements',
    let: {
      'achievementsIds': '$achievements',
    },
    pipeline: [{
      $match: {
        $expr: {
          $in: ['$_id', '$$achievementsIds']
        },
        'signers.signed': {
          $nin: [false]
        }
      }
    },{
      $lookup: lookupLots
    },{
      $unwind: {
        path: '$lots'
      }
    },{
      $lookup: lookupFiles
    },{
      $unwind: {
        path: '$supplies',
        preserveNullAndEmptyArrays: true
      }
    }],
    as: 'achievements'
  }

  const lookupActivities: any = {
    from: 'activities',
    let: {
      'activityToMakeIds': '$toMake',
      'activityDoneIds': '$done',
      'activityFinishedIds': '$finished',
    },
    pipeline: [{
      $lookup: lookupActivityType
    },{
      $unwind: {
        path: '$activityType',
        preserveNullAndEmptyArrays: true
      }
    },{
      $match: {
        $expr: {
          $or: [{
            $in: ['$_id', '$$activityToMakeIds']
          },{
            $in: ['$_id', '$$activityDoneIds']
          },{
            $in: ['$_id', '$$activityFinishedIds']
          }]
        },
        'activityType.tag' : 'ACT_APPLICATION'
      }
    },{
      $lookup: lookupAchievements
    },{
      $unwind: {
        path: '$achievements',
        preserveNullAndEmptyArrays: true
      }
    }],
    as: 'activities'
  }

  const lookupCropType: any = {
    from: 'croptypes',
    let: {
      'cropTypeId': '$cropType',
    },
    pipeline: [{
      $match: {
        $expr: {
          $eq : ['$_id', '$$cropTypeId']
        }
      }
    }],
    as: 'cropType'
  }

  const lookupCompany: any = {
    from: 'companies',
    let: {
      'companyId': '$company',
    },
    pipeline: [{
      $match: {
        $expr: {
          $eq : ['$_id', '$$companyId']
        }
      }
    }],
    as: 'company'
  }

  const pipelineProyect: any = {
    cropId: '$_id',
    activityId: '$activities._id',
    achievementId: '$activities.achievements._id',
    identifier: 1,
    companyName: '$company.name',
    cropTypeName: '$cropType.name.es',
    cropName: '$name',
    activityTypeName: '$activities.activityType.name.es',
    provinceName: '$activities.achievements.lots.provinceName',
    cityName: '$activities.achievements.lots.cityName',
    kmzLocation: {
      $concat: [process.env.BASE_URL, '/v1/reports/map/lot?id=', { $toString: '$activities.achievements.lots._id' }]
    },
    cropLotTag: '$lots.tag',
    lotName: '$activities.achievements.lots.name',
    supplieId: '$activities.achievements.supplies._id',
    supplieName: '$activities.achievements.supplies.name',
    supplieUnit: '$activities.achievements.supplies.unit',
    scheduleDate: {
      $dateToString: {
        format: '%d/%m/%Y',
        date: '$activities.dateStart'
      }
    },
    supplieQuantity: '$activities.achievements.supplies.quantity',
    achievementDate: {
      $dateToString: {
        format: '%d/%m/%Y',
        date: '$activities.achievements.dateAchievement'
      }
    },
    supplieTotal: '$activities.achievements.supplies.total',
    lotSurface: '$activities.achievements.lots.surface',
    evidences: {
      $reduce : {
        input: '$activities.achievements.files',
        initialValue: '',
        in: {
          $cond: {
            if: {
              $eq: [ '$$value', '' ]
            },
            then: '$$this.filePath',
            else: {
              $concat: ['$$value', ', ', '$$this.filePath']
            }
          }
        }
      }
    }
  }

  const pipeline: Array<any> = [{
    $match : {
      'cancelled': false,
    }
  },{
    $lookup: lookupActivitiesFilter
  },{
    $redact:{
      $cond: {
        if: {
          $gt: [{
            $size: ['$activities']
          }, 0]
        },
        then: '$$KEEP',
        else: '$$PRUNE'
      }
    }
  },{
    $lookup: lookupActivities
  },{
    $redact:{
      $cond: {
        if: {
          $and: [{
            $gt: [{
              $size: ['$activities.achievements']
            }, 0]
          },{
            $gt: [{
              $size: ['$activities.achievements.supplies']
            }, 0]
          }]
        },
        then: "$$KEEP",
        else: "$$PRUNE"
      }
    }
  },{
    $unwind: {
      path: '$activities',
      preserveNullAndEmptyArrays: true
    }
  },{
    $redact:{
      $cond: {
        if: {
          $and: [{
            $ifNull: ['$activities.achievements.dateAchievement', false]
          }]
        },
        then: "$$KEEP",
        else: "$$PRUNE"
      }
    }
  },{
    $lookup: lookupCropType
  },{
    $unwind: {
      path: '$cropType',
      preserveNullAndEmptyArrays: true
    }
  },{
    $lookup: lookupCompany
  },{
    $unwind: {
      path: '$company',
      preserveNullAndEmptyArrays: true
    }
  },{
    $unwind: {
      path: '$lots',
      preserveNullAndEmptyArrays: true
    }
  },{
    $project: pipelineProyect
  },{
    $sort : {
      lotName: 1,
      achievementDate: -1,
      supplieName: 1,
    }
  }]

  return pipeline
}
