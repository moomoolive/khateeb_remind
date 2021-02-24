const beforeNavigationGuards = {
    targetWallpaper(baseURL) {
        switch(baseURL) {
            case 'user':
              return 'user'
            case 'root':
            case 'sysAdmin':
              return 'sysAdmin'
            case 'institutionAdmin':
              return 'institutionAdmin'
            default:
              return'main'
          }
    },
    authRequired(routeRecord) {
      return routeRecord.meta.auth !== undefined
    } 
}

const fullPath = toOrFrom => toOrFrom.fullPath

const baseURL = (toOrFrom) => fullPath(toOrFrom).split('/')[1]

const homepageURL = (userType) => {
  switch(userType) {
    case 'root':
    case 'sysAdmin':
      return '/sysAdmin'
    case 'rootInstitutionAdmin':
    case 'institutionAdmin':
      return '/institutionAdmin'
    case 'khateeb':
      return '/khateeb'
    default:
      return '/'
  }
}

export default {
    beforeNavigationGuards,
    fullPath,
    baseURL,
    homepageURL
}