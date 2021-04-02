const khateebName = (khateeb={}) => {
    let base = `${khateeb.firstName} ${khateeb.lastName}`
    if (khateeb.title.toLowerCase() !== 'none')
        base += khateeb.title + ' '
    return base
}

export default {
    khateebName
}