const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVProcedureExtractor } = require('../../src/extractors');
const exampleCSVProcedureModuleResponse = require('./fixtures/csv-procedure-module-response.json');
const exampleCSVProcedureBundle = require('./fixtures/csv-procedure-bundle.json');

// Rewired extractor for helper tests
const CSVProcedureExtractorRewired = rewire('../../src/extractors/CSVProcedureExtractor.js');

// Constants for tests
const MOCK_PATIENT_MRN = 'mrn-1'; // linked to values in example-module-response above
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error

// Instantiate module with parameters
const csvProcedureExtractor = new CSVProcedureExtractor({
  filePath: MOCK_CSV_PATH,
});

// Destructure all modules
const { csvModule } = csvProcedureExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');
const formatData = CSVProcedureExtractorRewired.__get__('formatData');

describe('CSVProcedureExtractor', () => {
  describe('formatData', () => {
    test('should join data appropriately and throw errors when missing required properties', () => {
      const expectedErrorString = 'The procedure is missing an expected attribute. Procedure id, mrn, code system, code, status and effective date are all required.';
      const localData = _.cloneDeep(exampleCSVProcedureModuleResponse);
      // Test that valid data works fine
      expect(formatData(localData)).toEqual(expect.anything());

      // Test that removing an optional value works
      delete localData[0].bodySite;
      expect(formatData(localData)).toEqual(expect.anything());

      // Test that removing a required value throws
      delete localData[0].procedureId;
      expect(() => formatData(localData)).toThrow(new Error(expectedErrorString));
    });
  });

  describe('get', () => {
    test('should return bundle with Procedure', async () => {
      csvModuleSpy.mockReturnValue(exampleCSVProcedureModuleResponse);
      const data = await csvProcedureExtractor.get({ mrn: MOCK_PATIENT_MRN });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(1);
      expect(data.entry).toEqual(exampleCSVProcedureBundle.entry);
    });

    test('should return empty bundle when no data available from module', async () => {
      csvModuleSpy.mockReturnValue([]);
      const data = await csvProcedureExtractor.get({ mrn: MOCK_PATIENT_MRN });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(0);
    });
  });
});
