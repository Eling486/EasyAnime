const empty = {
    cron: '30 * * * * *',
    work: async () => {
        console.log('work')
        return
    }
}

module.exports = empty;