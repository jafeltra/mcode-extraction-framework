const moment = require('moment');
const { invertObject } = require('./helperUtils');

// Translate an M-language epoch date to an appropriate moment date
function mEpochToDate(date) {
  const epochDate = moment('1840-12-31');
  return epochDate.add(date, 'days');
}

// Code mapping is based on http://standardhealthrecord.org/guides/icare/mapping_guidance.html
// specifically using lowercase versions of the text specified by ICARE for status
const diseaseStatusTextToCodeLookup = {
  'no evidence of disease': 260415000,
  responding: 268910001,
  stable: 359746009,
  progressing: 271299001,
  'not evaluated': 709137006,
};
const diseaseStatusCodeToTextLookup = invertObject(diseaseStatusTextToCodeLookup);

// Code mapping is based on http://standardhealthrecord.org/guides/icare/mapping_guidance.html
// specifically using lowercase versions of the text specified by ICARE for Reason
const evidenceTextToCodeLookup = {
  imaging: 363679005,
  pathology: 252416005,
  symptoms: 711015009,
  'physical exam': 5880005,
  'lab results': 386344002,
};
const evidenceCodeToTextLookup = invertObject(evidenceTextToCodeLookup);

/**
 * Converts Text Value to code in mCODE's ConditionStatusTrendVS
 * @param text, limited to 'no evidence of disease', Responding, Stable, Progressing, or 'not evaluated'
 * @return {code} corresponding code from mCODE's ConditionStatusTrendVS
 */
function getDiseaseStatusCode(text) {
  return diseaseStatusTextToCodeLookup[text];
}

/**
 * Converts code in mCODE's ConditionStatusTrendVS to Text Value
 * @param text, limited to codes in the diseaseStatusTextToCodeLookup above
 * @return {code} corresponding code from mCODE's ConditionStatusTrendVS
 */
function getDiseaseStatusDisplay(code) {
  return diseaseStatusCodeToTextLookup[code];
}

/**
 * Converts Text Value to code in mCODE's CancerDiseaseStatusEvidenceTypeVS
 * @param text, limited to imaging, pathology, symptoms, 'physical exam', 'lab results'
 * @return {code} corresponding code from mCODE's CancerDiseaseStatusEvidenceTypeVS
 */
function getDiseaseStatusEvidenceCode(text) {
  return evidenceTextToCodeLookup[text];
}

/**
 * Converts code in mCODE's CancerDiseaseStatusEvidenceTypeVS to Text Value
 * @param text, limited to codes in the evidenceTextToCodeLookup above
 * @return {code} corresponding code from mCODE's CancerDiseaseStatusEvidenceTypeVS
 */
function getDiseaseStatusEvidenceDisplay(code) {
  return evidenceCodeToTextLookup[code];
}

module.exports = {
  getDiseaseStatusCode,
  getDiseaseStatusDisplay,
  getDiseaseStatusEvidenceCode,
  getDiseaseStatusEvidenceDisplay,
  mEpochToDate,
};
