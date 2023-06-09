# Cell Atlas Approximations - Natural Language Processing
Cell atlases are single cell data sets on the scale of whole organisms. There are presumably many ways for humans to query these atlases using natural language (e.g. English), however human-atlas interactions are currently limited to Python or R programmers.

This project enables biologists, doctors, and anyone else to ask questions in their natural language (starting from English) and convert the question into a formalised query for an atlas approximation. This functionality is used internally in our [Human Interface](https://github.com/fabilab/cell_atlas_approximations_HI) web application.


## Format of a complete query
Exact formats for queries are being defined. For the time being, the working draft of a complete formal query (CFQ), i.e. the expected output of a well-posed question in natural language, is shown in a few examples:

- **Q:** What is the expression of Ptprc and Col1a1 in mouse lung?

```javascript

query = {
    target: "average",
    organism: "m_musculus",
    organ: "Lung",
    features: "Ptprc,Col1a1"
    transform: "log10,hierarchical(axis=1),hierarchical(axis=1)",
}

```

- **Q**: What organisms are available?

```javascript

query = {
    target: "organisms",
}

```


**NOTE:** JavaScript used throughout. Trivial conversions into Python dictionaries, JSON, etc. are available of course.
