const { extensionArr, coding, valueCodeableConcept, reference } = require('./snippets');
const { ifAllArgsObj } = require('../helpers/templateUtils');

function histologyTemplate({ histology }) {
  return {
    url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-histology-morphology-behavior',
    ...valueCodeableConcept({ code: histology, system: 'http://snomed.info/sct' }),
  };
}

function dateOfDiagnosisTemplate({ dateOfDiagnosis }) {
  return {
    url: 'http://hl7.org/fhir/StructureDefinition/condition-assertedDate',
    valueDateTime: dateOfDiagnosis,
  };
}

function clinicalStatusTemplate({ clinicalStatus }) {
  return {
    clinicalStatus: {
      coding: [coding({ code: clinicalStatus, system: 'http://terminology.hl7.org/CodeSystem/condition-clinical' }),
      ],
    },
  };
}

function verificationStatusTemplate({ verificationStatus }) {
  return {
    verificationStatus: {
      coding: [coding({ code: verificationStatus, system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status' }),
      ],
    },
  };
}

function individualCategoryTemplate(category) {
  return {
    coding: [coding({ code: category, system: 'http://terminology.hl7.org/CodeSystem/condition-category' }),
    ],
  };
}

function categoryArrayTemplate(array) {
  const category = array.map(individualCategoryTemplate);
  // Including the fixed value for the category element at the end of the array
  category.push({
    coding: [coding({
      system: 'http://snomed.info/sct',
      code: '64572001',
    }),
    ],
  });
  return { category };
}

function codingTemplate({ code }) {
  return {
    code: {
      coding: [coding(code),
      ],
    },
  };
}

function bodySiteTemplate({ bodySite, laterality }) {
  return {
    bodySite: [
      {
        extension: [
          {
            url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-laterality',
            ...valueCodeableConcept({ code: laterality, system: 'http://snomed.info/sct' }),
          },
        ],
        coding: [coding({ code: bodySite[0], system: 'http://snomed.info/sct' }),
        ],
      },
    ],
  };
}

function subjectTemplate({ subject }) {
  return {
    subject: reference(subject),
  };
}

// Based on https://mcodeinitiative.github.io/StructureDefinition-obf-Condition.html
// Official url: http://hl7.org/fhir/us/mcode/StructureDefinition/obf-Condition
// {
//   id: String,
//   dateOfDiagnosis: DateTime
//   histology: String,
//   clinicalStatus: String,
//   verificationStatus: String,
//   category: [String],
//   code: {
//     system: String,
//     code: String,
//     display: String
//   },
//   bodySite: [String],
//   subject: {
//     id: String
//   },
// }

function conditionTemplate({
  subject, id, code, category, dateOfDiagnosis, clinicalStatus, verificationStatus, bodySite, laterality, histology,
}) {
  if (!(id && subject && code.system && code.code && category)) {
    throw Error('Trying to render a ConditionTemplate, but a required argument is missing; ensure that id, mrn, code, codesystem, and category are all present');
  }

  return {
    resourceType: 'Condition',
    id,
    ...extensionArr(
      ifAllArgsObj(dateOfDiagnosisTemplate)({ dateOfDiagnosis }),
      ifAllArgsObj(histologyTemplate)({ histology }),
    ),
    ...ifAllArgsObj(clinicalStatusTemplate)({ clinicalStatus }),
    ...ifAllArgsObj(verificationStatusTemplate)({ verificationStatus }),
    ...categoryArrayTemplate(category),
    ...codingTemplate({ code }),
    ...ifAllArgsObj(bodySiteTemplate)({ bodySite, laterality }),
    ...subjectTemplate({ subject }),
  };
}

module.exports = {
  conditionTemplate,
};