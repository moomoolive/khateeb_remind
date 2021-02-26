const targetWallpaper = (baseURL) => {
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
}

const authRequired = (routeRecord) => {
  return routeRecord.meta.auth !== undefined
}

export default {
    targetWallpaper,
    authRequired
}