const { Extractor } = require('./Extractor');
const { BaseFHIRModule } = require('../modules');
const { determineVersion, mapFHIRVersions, isBundleEmpty } = require('../helpers/fhirUtils');
const logger = require('../helpers/logger');

// eslint-disable-next-line no-unused-vars
function parseContextForPatientId(context) {
  // TODO: Sync with Dan
  return undefined;
}

class BaseFHIRExtractor extends Extractor {
  constructor({ baseFhirUrl, requestHeaders, version, resourceType }) {
    super();
    this.resourceType = resourceType;
    this.version = version;
    this.baseFHIRModule = new BaseFHIRModule(baseFhirUrl, requestHeaders);
  }

  updateRequestHeaders(newHeaders) {
    this.baseFHIRModule.updateRequestHeaders(newHeaders);
  }

  // Use mrn to get PatientId by default; common need across almost all extractors
  async parametrizeArgsForFHIRModule({ mrn, context }) {
    const idFromContext = parseContextForPatientId(context);
    if (idFromContext) return { patient: idFromContext };

    logger.info('No patient ID in context; fetching with baseFHIRModule');
    const patientResponseBundle = await this.baseFHIRModule.search('Patient', { identifier: mrn });
    if (!patientResponseBundle || !patientResponseBundle.entry || !patientResponseBundle.entry[0] || !patientResponseBundle.entry[0].resource) {
      logger.error(`Could not get a patient ID to cross-reference for ${this.resourceType}`);
      return {};
    }
    return { patient: patientResponseBundle.entry[0].resource.id };
  }

  // Since different superclasses of the baseFHIRExtractor will parse the `get`
  // arguments differently, all pass to this function which interfaces with the baseFHIRModule
  async getWithFHIRParams(params) {
    // 1. Get data
    logger.info(`Getting ${this.resourceType} FHIR resource`);
    const fhirResponseBundle = await this.baseFHIRModule.search(this.resourceType, params);
    if (isBundleEmpty(fhirResponseBundle)) {
      logger.warn(`${this.resourceType} bundle that was supposed to have entries had 0`);
      return fhirResponseBundle;
    }
    logger.info(`Found ${fhirResponseBundle.entry.length} ${this.resourceType} FHIR resources in get`);

    // 2. Reformat versions where necessary;
    const resVersion = determineVersion(fhirResponseBundle);
    if (this.version && resVersion !== this.version) {
      logger.info(`Mapping ${this.resourceType} FHIR responses from ${resVersion} to ${this.version}`);
      fhirResponseBundle.entry = fhirResponseBundle.entry.map((resource) => mapFHIRVersions(resource, resVersion, this.version));
      return fhirResponseBundle;
    }

    // 3. If versions match, no mapping necessary
    return fhirResponseBundle;
  }

  // eslint-disable-next-line no-unused-vars
  async get(argumentObject) {
    // Need to translate MRN to FHIR params
    const params = await this.parametrizeArgsForFHIRModule(argumentObject);
    return this.getWithFHIRParams(params);
  }
}

module.exports = {
  BaseFHIRExtractor,
};
