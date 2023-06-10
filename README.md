# Cell Atlas Approximations - Natural Language Processing
Cell atlases are single cell data sets on the scale of whole organisms. There are presumably many ways for humans to query these atlases using natural language (e.g. English), however human-atlas interactions are currently limited to Python or R programmers.

This project enables biologists, doctors, and anyone else to ask questions in their natural language (starting from English) and convert the question into a formalised query for an atlas approximation. This functionality is used internally in our [Human Interface](https://github.com/fabilab/cell_atlas_approximations_HI) web application.


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


## Processor architecture
TBD. The first prototype will have zero machine learning and see what issues arise.
