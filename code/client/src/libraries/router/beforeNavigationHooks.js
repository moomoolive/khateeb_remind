const authRequired = (routeRecord) => {
  return routeRecord.meta.auth !== undefined
}

export default {
    authRequired
}