[![npm version](https://badge.fury.io/js/@fabilab%2Fatlasapprox-nlp.svg)](https://badge.fury.io/js/@fabilab%2Fatlasapprox-nlp)

<img src="https://raw.githubusercontent.com/fabilab/cell_atlas_approximations/main/figures/figure_NLP.png" width="150" height="150">

# Cell Atlas Approximations - Natural Language Processing
Cell atlases are single cell data sets on the scale of whole organisms. There are presumably many ways for humans to query these atlases using natural language (e.g. English), however human-atlas interactions are currently limited to Python or R programmers.

This project enables biologists, doctors, and anyone else to ask questions in their natural language (starting from English) and convert the question into a formalised query for an atlas approximation. This functionality is used internally in our [Human Interface](https://github.com/fabilab/cell_atlas_approximations_HI) web application. Intents understood via NLP in this library are then forwarded to our [JavaScript API](https://github.com/fabilab/cell_atlas_approximations_API) contained in the [atlasapprox](https://www.npmjs.com/package/@fabilab/atlasapprox) npm package.


## Complete query format
Exact formats for queries are being defined. For the time being, the working draft of a complete formal query (CFQ), i.e. the expected output of a well-posed question in natural language, is shown in a few examples.

- **Q:** What is the expression of Ptprc and Col1a1 in mouse lung?

```javascript

query = {
    target: "average",
    organism: "m_musculus",
    organ: "Lung",
    features: ["Ptprc", "Col1a1"],
    transform: ["log10", "hierarchical(axis=1)", "hierarchical(axis=1)"],
}

```

- **Q**: What organisms are available?

```javascript

query = {
    target: "organisms",
}

```

- **Q:** What organs are available for mouse?

```javascript

query = {
    target: "organs",
    organism: "m_musculus",
}
```

- **Q:** What are the marker genes for alveolar fibroblasts in mouse lung?

```javascript

query = {
    target: "markers",
    organism: "m_musculus",
    organ: "Lung",
    celltype: "alveolar fibroblast",
}

```

This format is related to but richer than the parameter object of the [REST API](https://atlasapprox.readthedocs.io/en/latest/rest/index.html#reference-api). The latter only includes the necessary information to obtain the data from the backend, whereas this format also specifies any subsequent transformations to be applied (e.g. for plotting, download). Also, the REST API specifies lists of features as a comma-separated string, whereas they are a proper list here.

This format is also related to but not identical to the [atlas approximation visualisation data format](https://github.com/fabilab/cell_atlas_approximations_HI), which includes not only the query for some data but the data itself (i.e. the answer to the query). Also, this format can be used for other things than visualisation (e.g. for data download).

**NOTE:** JavaScript used throughout. Trivial conversions into Python dictionaries, JSON, etc. are available of course.

## Incomplete query format
An incomplete query is the result of interpreting a natural language request which is not containing sufficient information to answer it (i.e. to trigger an API call). For instance, the question "What organs are available?" is incomplete because the answer depends on the organism of choice. Examples are as follows:

- **Q:** What organs are available?

```javascript
query = {
    target: "organs",
    missing_parameters: ["organism"],
}

```

- **Q:** What is the expression of Ptprc?

```javascript
query = {
    target: "average",
    features: ["Ptprc"],
    missing_parameters: ["organism", "organ|celltype"],
}

```

In this case, multiple aspects are missing from the query, including what organism to look at. Once an organism is specified, the user can choose either an organ (more common) or a cell type across organs.


## Processor and generator architecture
Early prototypes are using [nlpjs](https://github.com/axa-group/nlp.js) which seems to be flexible and powerful enough.

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
