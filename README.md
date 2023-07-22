[![npm version](https://badge.fury.io/js/@fabilab%2Fatlasapprox-nlp.svg)](https://badge.fury.io/js/@fabilab%2Fatlasapprox-nlp)

<img src="https://raw.githubusercontent.com/fabilab/cell_atlas_approximations/main/figures/figure_NLP.png" width="150" height="150">

# Cell Atlas Approximations - Natural Language Processing
Cell atlases are single cell data sets on the scale of whole organisms. There are many ways for humans to query these atlases using natural language (e.g. English), however human-atlas interactions are currently limited to Python or R programmers.

This project enables biologists, doctors, and anyone else to ask questions in their natural language (starting from English) and convert the question into a formalised query for an atlas approximation. This functionality is used internally in our [Human Interface](https://github.com/fabilab/cell_atlas_approximations_HI) web application. Intents understood via NLP in this library are then forwarded to our [JavaScript API](https://github.com/fabilab/cell_atlas_approximations_API) contained in the [atlasapprox](https://www.npmjs.com/package/@fabilab/atlasapprox) npm package.

## Installation
```bash
npm install @fabilab/atlasapprox-nlp
```

If you want to use query the JavaScript API based on the answers you received here, you'll need to install that package as well:

```bash
npm install @fabilab/atlasapprox
```

## Usage
```javascript
// ES6 (e.g. in React development)
import { AtlasApproxNlp, buildAPIParams, buildAnswer } from '@fabilab/atlasapprox-nlp';
// CommonJS variant
//let { AtlasApproxNlp, buildAPIParams, buildAnswer } = require('@fabilab/atlasapprox-nlp');

let nlp = new AtlasApproxNlp();

(async () => {
  await nlp.initialise();

  // NOTE: Multiple initalisation is OK

  // Ask a question
  let response = await nlp.ask("What measurement types are available?");
  console.log(response);

  // Reset context to a virgin state
  nlp.reset();

})();
```

`AtlasapproxNlp` is the main object wrapping the excellent [nlpjs](https://github.com/axa-group/nlp.js) library. Object instantiation is synchronous, but initialisation of the `nlpjs` library is async.

## Architechture
- `src/corpus.json` is the training corpus containing utterances (questions), entities, etc.
- `src/app.js` contains most of the wrapper code, including the `buildAPIParams`, `buildAnswer`, and `ask` functions.
- `src/tail_node.js` contains the object constructor and initalisation methods to be exported in CommonJS format.
- `src/tail_window.js` is an older version that relies on a global `window.nlp` object (deprecated).

## Development
- Add utterances etc. to the corpus.
- Test with `npm run testCorpus`, adding test questions to `test/trainAndTest.js` if needed.
- Once this works, you can pre-train the production model using `npm run train`. `npm run train` saves the model in `gists/model/model.nlp` which is a git submodule, and pushed a new commit to the gist repo.
- Get the URL of the raw file on gist and substitute it on top of `src/app.js`.
- Run `npm run testNpm` to test a webpack-like app that loads the module using CommonJS.

(deprecated):
- `npm run testBrowser` creates a browser-compatible `index.js` and an `index.html` into `build` and opens it in Firefox. Opening the inspector shows an example call and exposes a function called `answerFun` to probe the model by hand.

