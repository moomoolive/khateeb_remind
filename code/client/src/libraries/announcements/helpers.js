const isNew = (announcementUpdateDate, lastLoginDate) => {
    return new Date(announcementUpdateDate).getTime() > new Date(lastLoginDate).getTime()
}

export default {
    isNew
}