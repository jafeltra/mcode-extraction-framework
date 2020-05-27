const logger = require('./helpers/logger');
const {
  BaseFHIRExtractor,
  CSVCancerDiseaseStatusExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVConditionExtractor,
  CSVPatientExtractor,
  CSVTreatmentPlanChangeExtractor,
  Extractor,
  FHIRAllergyIntoleranceExtractor,
  FHIRConditionExtractor,
  FHIRDocumentReferenceExtractor,
  FHIRMedicationOrderExtractor,
  FHIRMedicationStatementExtractor,
  FHIRObservationExtractor,
  FHIRPatientExtractor,
  FHIRProcedureExtractor,
} = require('./extractors');
const { BaseFHIRModule, CSVModule } = require('./modules');
const { getPatientName } = require('./helpers/patientUtils');
const {
  allResourcesInBundle,
  firstEntryInBundle,
  firstResourceInBundle,
  getBundleResourcesByType,
  isBundleEmpty,
} = require('./helpers/fhirUtils');
const { generateMcodeResources } = require('./helpers/ejsUtils');
const { isConditionPrimary, isConditionSecondary, getICD10Code } = require('./helpers/conditionUtils');
const { getDiseaseStatusCode } = require('./helpers/diseaseStatusUtils');

module.exports = {
  BaseFHIRExtractor,
  CSVModule,
  BaseFHIRModule,
  CSVCancerDiseaseStatusExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVConditionExtractor,
  CSVPatientExtractor,
  CSVTreatmentPlanChangeExtractor,
  Extractor,
  FHIRAllergyIntoleranceExtractor,
  FHIRConditionExtractor,
  FHIRDocumentReferenceExtractor,
  FHIRMedicationOrderExtractor,
  FHIRMedicationStatementExtractor,
  FHIRObservationExtractor,
  FHIRPatientExtractor,
  FHIRProcedureExtractor,
  logger,
  allResourcesInBundle,
  firstEntryInBundle,
  firstResourceInBundle,
  getDiseaseStatusCode,
  generateMcodeResources,
  getBundleResourcesByType,
  getICD10Code,
  getPatientName,
  isBundleEmpty,
  isConditionPrimary,
  isConditionSecondary,
};
