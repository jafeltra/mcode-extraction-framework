# mCODE Extraction Framework

A Node.js framework for extracting mCODE FHIR resources. All resources are profiled per the [mCODE v1.0.0 R4 FHIR Implementation Guide](https://mcodeinitiative.github.io/index.html)

## Table of Contents

- [mCODE Extraction Framework](#mcode-extraction-framework)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
    - [Latest](#latest)
  - [Usage](#usage)
  - [Terminology and Architecture](#terminology-and-architecture)
    - [Glossary](#glossary)
    - [High Level Diagram](#high-level-diagram)

## Prerequisites

- [Node.js >= 10](https://nodejs.org/en/)

### Latest

```bash
npm install --save git+https://github.com/mcode/mcode-extraction-framework.git
```

## Usage

There are various extractors, modules, and helper functions exposed by the framework that can be imported and used in your project. The framework also exposes a logger designed for outputting log statements to the console during extraction. The framework's exports can be seen in the [index.js file](https://github.com/mcode/mcode-extraction-framework/blob/master/src/index.js).

Each extractor exposes an asynchronous `get` function that will return a bundle of extracted mCODE data.

``` JavaScript
// Example
const { CSVCancerDiseaseStatusExtractor, logger} = require('mcode-extraction-framework');

// Instantiate extractor with base URL and any additional request headers
const cancerDiseaseStatusExtractor = new CSVCancerDiseaseStatusExtractor('path-to-csv');

(async () => {
  logger.info('Extracting primary disease status data');
  const primaryDiseaseStatusBundle = await cancerDiseaseStatusExtractor.get({ mrn: 'some-mrn' });
  logger.info(JSON.stringify(primaryDiseaseStatusBundle));
})();
```

## Terminology and Architecture

This framework consists of three key components: Extractors, Modules and Templates. Below is, in order:

1. A glossary of what components of the mCODE Extraction Framework refer to;
2. A high-level explanation of how those components connect;

### Glossary

![Image detailing exact definitions of what is meant by Client, Extractor, Module and Template](./docs/diagrams/terminology-breakdown.png)

### High Level Diagram

![High-level architecture diagram, detailing exactly how Clients, Extractors, Modules, Templates and various web services communicate with one another](./docs/diagrams/high-level-arch.png)

These diagrams can be modified by updating the XML files in the `/docs/diagrams/` directory using draw.io or a company licensed equivalent.
