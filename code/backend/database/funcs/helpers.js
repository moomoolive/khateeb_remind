export default {
    saveSetting(discriminatorName, toBeSaved, response=false) {
        $dbModels[discriminatorName].findOne({}, (err, setting) => {
            if (err) console.log(err)
            else if (setting) {
                $dbModels[discriminatorName].findOneAndUpdate({}, 
                    {
                        options: toBeSaved.options,
                        savedOn: new Date()
                    }, (err) => { funcs.databaseCallback(response, err) }
                ).select(['options'])
            } else {
                const x = new $dbModels[discriminatorName](toBeSaved)
                x.save((err) => { funcs.databaseCallback(response, err) })
            }
        })
    },
    saveDateOfEntry(toBeSaved) {
        toBeSaved.savedOn = new Date().toUTCString()
    }
}