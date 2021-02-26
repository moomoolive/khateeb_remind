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
    fullPath,
    baseURL,
    homepageURL
}