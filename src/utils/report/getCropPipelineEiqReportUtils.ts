export const getCropPipelineEiqReportUtils = ({ identifier }) => {
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
          $in : ['$_id', '$$lotIds']
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
          $in : ['$_id', '$$fileIds']
        }
      }
    },{
      $project: {
        _id: 1,
        baseUrl: process.env.BASE_URL,
        filePath: '$path'
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
          $in : ['$_id', '$$achievementsIds']
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
      $unwind: {
        path: '$supplies',
        preserveNullAndEmptyArrays: true
      }
    },{
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
            $in : ['$_id', '$$activityToMakeIds']
          },{
            $in : ['$_id', '$$activityDoneIds']
          },{
            $in : ['$_id', '$$activityFinishedIds']
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
    identifier: 1,
    companyName: '$company.name',
    cropTypeName: '$cropType.name.es',
    cropName: '$name',
    activityTypeName: '$activities.activityType.name.es',
    kmzLocation: {
      baseUrl: process.env.BASE_URL + '/v1/reports/map/lot?id=',
      lotId: '$activities.achievements.lots._id',
    },
    cropLotTag: '$lots.tag',
    lotName: '$activities.achievements.lots.name',
    supplieName: '$activities.supplies.name',
    supplieUnit: '$activities.supplies.unit',
    scheduleDate: '$activities.dateStart',
    supplieQuantity: '$activities.supplies.quantity',
    achievementDate: '$activities.achievements.dateAchievement',
    supplieTotal: '$activities.supplies.total',
    lotSurface: '$activities.achievements.lots.surface',
    evidences: '$activities.achievements.files',
  }

  const pipeline: Array<any> = [{
    $match : {
      'cancelled': false,
      'members.identifier': identifier,
    }
  },{
    $lookup: lookupActivities
  },{
    $unwind: {
      path: '$activities',
      preserveNullAndEmptyArrays: true
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
  }]

  return pipeline
}
