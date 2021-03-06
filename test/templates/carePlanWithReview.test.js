const { isValidFHIR } = require('../../src/helpers/fhirUtils');
const minimalCarePlan = require('./fixtures/minimal-careplan-resource.json');
const maximalCarePlan = require('./fixtures/maximal-careplan-resource.json');
const { carePlanWithReviewTemplate } = require('../../src/templates/CarePlanWithReviewTemplate');
const { allOptionalKeyCombinationsNotThrow } = require('../utils');

describe('JavaScript render CarePlan template', () => {
  test('minimal required data passed into template should generate FHIR resource', () => {
    const CARE_PLAN_VALID_DATA = {
      id: 'test-id',
      effectiveDateTime: '2020-01-23T09:07:00Z',
      effectiveDate: '2020-01-23',
      hasChanged: 'false',
      mrn: 'abc-def',
      reasonCode: null,
      reasonDisplayText: null,
      name: null,
    };

    const generatedCarePlan = carePlanWithReviewTemplate(CARE_PLAN_VALID_DATA);
    expect(generatedCarePlan).toEqual(minimalCarePlan);
    expect(isValidFHIR(generatedCarePlan)).toBeTruthy();
  });

  test('maximal data passed into template should generate FHIR resource', () => {
    const MAX_CARE_PLAN_DATA = {
      id: 'test-id',
      effectiveDateTime: '2020-01-23T09:07:00Z',
      effectiveDate: '2020-01-23',
      hasChanged: 'true',
      reasonCode: '281647001',
      reasonDisplayText: 'Adverse reaction (disorder)',
      mrn: 'abc-def',
      name: 'Sample Text',
    };

    const generatedCarePlan = carePlanWithReviewTemplate(MAX_CARE_PLAN_DATA);
    expect(generatedCarePlan).toEqual(maximalCarePlan);
    expect(isValidFHIR(generatedCarePlan)).toBeTruthy();
  });

  test('missing non-required data should not throw an error', () => {
    const NECESSARY_DATA = {
      id: 'test-id',
      effectiveDateTime: '2020-01-23T09:07:00Z',
      effectiveDate: '2020-01-23',
      hasChanged: 'false',
      mrn: 'abc-def',
    };

    const OPTIONAL_DATA = {
      reasonCode: '281647001',
      reasonDisplayText: 'Adverse reaction (disorder)',
      name: 'Sample Text',
    };

    allOptionalKeyCombinationsNotThrow(OPTIONAL_DATA, carePlanWithReviewTemplate, NECESSARY_DATA);
  });

  test('missing required data should throw a reference error', () => {
    const INVALID_DATA = {
      // Omitting 'hasChanged' field which is a required property
      id: 'test-id',
      effectiveDateTime: '2020-01-23T09:07:00Z',
      effectiveDate: '2020-01-23',
      mrn: 'abc-def',
      haschanged: null,
    };

    expect(() => carePlanWithReviewTemplate(INVALID_DATA)).toThrow(Error);
  });
});
