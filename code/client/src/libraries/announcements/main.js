import helpers from './helpers.js'
import globalHelpers from '@/libraries/globalUtilities.js'

const tagLoader = (announcement, lastLogin) => {
    let tagArray = []
    if (announcement.important) 
        tagArray.push('important')
    if (announcement.urgent) 
        tagArray.push('urgent')
    if (helpers.isNew(announcement.updatedAt, lastLogin)) 
        tagArray.push('new')
    return tagArray
}

const headlineText = (announcement) => {
    return `${globalHelpers.dynamicDisplayDate(announcement.updatedAt)} || ${announcement.headline}`
}

export default {
    tagLoader,
    headlineText
}