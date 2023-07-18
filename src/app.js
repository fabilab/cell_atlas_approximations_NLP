const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');

let debug = true;
const modelUrl = "https://gist.githubusercontent.com/iosonofabio/c42d91f7297c949eff0168078940af2d/raw/5a88f44167d9b16b871901a670a6b8408c88230c/model.nlp";

// Construct an answer given the API has provided the requested information
function buildAnswer(intent, data) {
    function _chainList(list, sep, end) {
        let text = "";
        for (let i=0; i < list.length; i++) {
            text += list[i];
            if (i != list.length - 1)
                text += sep;
            else
                text += end;
        }
        return text;
    }

    let answer;
    const intentParts = intent.split(".");
    const gIntent = intentParts[0];
    let sIntent;
    if (intentParts.length > 1)
      sIntent = intentParts[1];
    else
      sIntent == "";
      
    switch (gIntent) {
      case "organisms":
        answer = "The available organisms are: " + _chainList(data.organisms, ", ", ".");
        break;
      case "organs":
        answer = "The available organs for " + data.organism + " are: " + _chainList(data.organs, ", ", ".");
        if ((data.organs.length == 1) && (data.organs[0] === "whole"))
            answer += " The organism was dissociated as a whole and sequenced.";
        break;
      case "celltypes":
        answer = "The cell types in " + data.organism + " " + data.organ + " are: " + _chainList(data.celltypes, ", ", ".");
        break;
      case "celltype_location":
        answer = "The cell type " + data.celltype + " was detected in " + data.organism + " " + data.organ + " are: " + _chainList(data.organs, ", ", ".");
        break;
      case "average":
        switch (sIntent) {
          case "geneExpression":
            answer = "The average expression of " + data.features + " in " + data.organism + " " + data.organ + " is shown in the plot.";
            break;
          case "chromatinAccessibility":
            answer = "The average accessibility of " + data.features + " in " + data.organism + " " + data.organ + " is shown in the plot.";
            break;
          default:
            answer = "The average is shown in the plot.";
        }
        break;
      case "averageAcrossOrgans":
        switch (sIntent) {
          case "geneExpression":
            answer = "The average expression of " + data.features + " in " + data.organism + " " + data.celltype + " is shown in the plot.";
            break;
          case "chromatinAccessibility":
            answer = "The average accessibility of " + data.features + " in " + data.organism + " " + data.celltype + " is shown in the plot.";
            break;
          default:
            answer = "The average is shown in the plot.";
        }
        break;
      case "fraction_detected":
        answer = "A dot plot of " + data.features + " in " + data.organism + " " + data.organ + " is shown in the plot.";
        break;
      case "fraction_detectedAcrossOrgans":
        answer = "A dot plot of " + data.features + " in " + data.organism + " " + data.celltype + " is shown in the plot.";
        break;
      case "markers":
        switch (sIntent) {
          case "geneExpression":
            answer = "The marker genes for " + data.celltype + " in " + data.organism + " " + data.organ + " are: " + data.markers;
            break;
          case "chromatinAccessibility":
            answer = "The marker peaks for " + data.celltype + " in " + data.organism + " " + data.organ + " are: " + data.markers;
            break;
          default:
            answer = "The markers for " + data.celltype + " in " + data.organism + " " + data.organ + " are: " + data.markers;
        }
        break;
      case "similar_features":
        switch (sIntent) {
          case "geneExpression":
            answer = "The genes similar to " + data.feature + " in " + data.organism + " " + organ + " are: " + data.similar_features;
            break;
          case "chromatinAccessibility":
            answer = "The peaks with similar accessibility to " + data.feature + " in " + data.organism + + " " + organ + " are: " + data.similar_features;
            break;
          default:
            answer = "The features similar to " + data.feature + " in " + data.organism + " " + organ + " are: " + data.similar_features;
        }
        break;
      case "similar_celltypes":
        answer = "The cell types similar to " + data.celltype + " in " + data.organism + " are: " + data.similar_celltypes;
        break;
      case "celltypexorgan":
        answer = "The presence matrix of cell types in " + data.organism + " is shown in the plot.";
        break;
      case "highest_measurement":
        switch (sIntent) {
          case "geneExpression":
            answer = "The highest expressors of " + data.feature + " are:";
            break;
          case "chromatinAccessibility":
            answer = "The cell types with the most accessibility of " + data.feature + " are:";
            break;
          default:
            answer = "The highest measurement are in:";
        }
        for (let i = 0; i < data.celltypes.length; i++)
          answer += "<br>" + data.organs[i] + ", " + data.celltypes[i];
        break;
      case "add":
        switch (sIntent) {
          case "features":
            answer = "Features added.";
            break;
          default:
            answer = "Added.";
        }
        break;
      case "remove":
        switch (sIntent) {
          case "features":
            answer = "Features removed.";
            break;
          default:
            answer = "Removed.";
        }
        break;

      default:
        answer = "Sorry, I have no answer to that.";
    };

    return answer;
}

function buildAPIParams(intent, entities) {
    // Extract endpoint from intent
    let endpoint = intent.split(".")[0];

    // Convert entities in request parameters
    let params = {};
    for (let i=0; i < entities.length; i++) {
        const entity = entities[i];
        let param;
        if (entity.type == "enum") {
            paramValue = entity.option;
        } else {
            paramValue = entity.sourceText;
        }
        // entity names and API parameter names are not exactly the same for clarity
        let paramName = entity.entity;
        if (["nFeatures", "nCelltypes"].includes(paramName))
            paramName = "number";

        params[paramName] = paramValue;
    }

    return {
        'endpoint': endpoint,
        'params': params,
    }
}


async function ask(question, context = {}) {

    // This function is only used after window.nlpManager has been set
    const manager = window.nlpManager;

    let response = await manager.process("en", question, context);

    if (debug)
        console.log(response);

    // Check if there are slotFill, in which case the question is not complete
    if (response.slotFill) {
        return {
            complete: false,
            followUpQuestion: response.answer,
        };
    }

    // Otherwise, the question is complete, ready for API call by the caller
    return {
        complete: true,
        intent: response.intent,
        entities: response.entities,
    }
};

// Prepare the nlp manager at loading time
(async () => {

    // Initialize nlpjs objects
    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEn);
    const manager = container.get('nlp');

    // Get data from URL (gist)
    let response = await fetch(modelUrl);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    let data = await response.text();
    
    // Import the model into manager
    await manager.import(data);

    window.nlpManager = manager;
    window.ask = ask;
    window.buildAPIParams = buildAPIParams;
    window.buildAnswer = buildAnswer;
})();
