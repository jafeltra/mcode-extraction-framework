const fs = require('fs');
const moment = require('moment');
const parse = require('csv-parse/lib/sync');
const logger = require('../helpers/logger');

class CSVModule {
  constructor(csvFilePath) {
    this.data = parse(fs.readFileSync(csvFilePath), { columns: true });
  }

  async get(key, value, fromDate) {
    logger.info(`Get csvModule info by key '${key}'`);
    // return all rows if key and value aren't provided
    if (!key && !value) return this.data;
    let result = this.data.filter((d) => d[key] === value);
    if (result.length === 0) throw new ReferenceError(`CSV Record with provided key '${key}' and value was not found`);

    // If fromDate is provided, filter out all results that were recorded before fromDate
    if (fromDate) result = result.filter((r) => !(r.dateRecorded && moment(fromDate).isAfter(r.dateRecorded)));
    if (result.length === 0) logger.warn('No data for patient after specified fromDate');
    return result;
  }
}

module.exports = {
  CSVModule,
};
