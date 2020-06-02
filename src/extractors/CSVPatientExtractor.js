const path = require('path');
const { CSVModule } = require('../modules');
const { generateMcodeResources } = require('../helpers/ejsUtils');
const { Extractor } = require('./Extractor');
const logger = require('../helpers/logger');

function joinAndReformatData(patientData) {
  logger.info('Reformatting patient data from CSV into template format');
  // No join needed, just a reformatting
  const {
    mrn, patientId, family, given, gender,
  } = patientData;

  return {
    id: patientId,
    mrn,
    family,
    given,
    gender,
  };
}

class CSVPatientExtractor extends Extractor {
  constructor({ filePath }) {
    super();
    this.csvModule = new CSVModule(path.resolve(filePath));
  }

  async getPatientData(mrn) {
    logger.info('Getting patient data');
    const data = await this.csvModule.get('mrn', mrn);
    // Should only be one patient with this mrn; get that pat from our arr
    return data[0];
  }

  async get({ mrn }) {
    // 1. Get all relevant data and do necessary post-processing
    const patientData = await this.getPatientData(mrn);

    // 2. Format data for research study and research subject
    const packagedPatientData = joinAndReformatData(patientData);

    // 3. Generate FHIR Resources
    return generateMcodeResources('Patient', packagedPatientData);
  }
}

module.exports = {
  CSVPatientExtractor,
};