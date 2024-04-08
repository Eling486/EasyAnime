const schedule = require('node-schedule');
const RenameFiles = require('./rename_files')
const UpdateState = require('./update_state')
const ScanRSS = require('./scan_rss')

class ScheduleManager {
    constructor() {
        this.init()
        return this
    }

    init() {
        this.jobList = {
            RenameFiles: schedule.scheduleJob(RenameFiles.cron, async () => {
                await RenameFiles.work()
            }),
            UpdateState: schedule.scheduleJob(UpdateState.cron, async () => {
                await UpdateState.work()
            }),
            ScanRSS: schedule.scheduleJob(global.config.config.jobs.scan_rss, async () => {
                await ScanRSS.work()
            }),
        }
    }

    restart() {
        Object.getOwnPropertyNames(this.jobList).forEach((key) => {
            this.jobList[key].cancel()
        })
        this.init()
        return this
    }
}

module.exports = ScheduleManager;