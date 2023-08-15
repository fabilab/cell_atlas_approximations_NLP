// containerBootstrap is needed for webpack and similar browser envs
// dock works in nodejs though. The hierarchy of objects is a little
// fuzzy from the nlpjs v4 docs, so let's leave this as is for now.
const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');
const modelString = require('./modelString.js');

let debug = true;

// Construct an answer given the API has provided the requested information
const buildAnswer = (intent, data) => {
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
    let sIntent = "", addIntent = "";
    if (intentParts.length > 1) {
      sIntent = intentParts[1];
      if (intentParts.length > 2)
        addIntent = intentParts[2];
    }
      
    switch (gIntent) {
      case "measurement_types":
        answer = "The available measurement types are: " + _chainList(data.measurement_types, ", ", ".");
        break;
      case "organisms":
        answer = "The available organisms are: " + _chainList(data.organisms, ", ", ".");
        break;
      case "organs":
        answer = "The available organs for " + data.organism + " are: " + _chainList(data.organs, ", ", ".");
        if ((data.organs.length == 1) && (data.organs[0] === "whole"))
            answer = "Cells from this organism were dissociated without separating the tissues first. This happens mostly in small organisms, which can be difficult to dissect. While organ information is not directly available, you can ask about cell types: many are good proxies for tissues in this organism. To specify an organ to the chat bot, use 'whole'.";
        break;
      case "celltypes":
        answer = "The cell types in " + data.organism + " " + data.organ + " are: " + _chainList(data.celltypes, ", ", ".");
        break;
      case "celltype_location":
        answer = "The cell type " + data.celltype + " was detected in " + data.organism + " " + data.organ + " are: " + _chainList(data.organs, ", ", ".");
        break;
      case "average":
        switch (addIntent) {
          case "across_organs":
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
          default:
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
        }
        break;
      case "fraction_detected":
        switch (addIntent) {
          case "across_organs":
            answer = "A dot plot of " + data.features + " in " + data.organism + " " + data.celltype + " is shown in the plot.";
            break;
          default:
            answer = "A dot plot of " + data.features + " in " + data.organism + " " + data.organ + " is shown in the plot.";
        }
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
          answer += "<br>" + (i+1) + ". " + data.celltypes[i] + " in " + data.organs[i];
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

const buildAPIParams = (intent, entities) => {
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


const preProcess = (utterance) => {
  // list of features with ", " -> remove the space
  utterance = utterance.replaceAll(", ", ",");

  // cell types with space require attention
  const compositeCelltypes = [
    [/(smooth|striated) muscle/i, "$1_muscle"],
    [/(\w+) progenitor/i, "$1_progenitor"],
  ];
  for (let i = 0; i < compositeCelltypes.length; i++) {
    let patterns = compositeCelltypes[i];
    utterance = utterance.replace(patterns[0], patterns[1]);
  }

  return utterance;
};


const postProcess = (response) => {
  let entitiesForDeletion = [];

  // smooth muscle et al.: the "muscle" gets recognised as an organ. Fix that
  for (let i = 0; i < response.entities.length; i++) {
    const entity = response.entities[i];
    if ((entity['entity'] == "celltype") && (entity['sourceText'].includes("muscle"))) {
      entitiesForDeletion.push("organ");
      break
  } else if ((entity['entity'] == "celltype")) {
     console.log(entity);
    }
  };

  let newEntities = [];
  for (let i = 0; i < response.entities.length; i++) {
    const entity = response.entities[i];
    let keep = true;
    for (let j = 0; j < entitiesForDeletion.length; j++) {
      if (entity['entity'] == entitiesForDeletion[j]) {
        keep = false;
        break;
      }
    };
    if (keep)
      newEntities.push(entity);
  }
  response.entities = newEntities;
}


// This is a method class in the CommonJS module, because it needs the manager
async function ask(question) {

    // This function is only used after window.nlpManager has been set
    const manager = this.nlpManager || window.nlpManager;

    // Pre-process request for quirky situations (e.g. smooth muscle)
    question = preProcess(question);

    let response = await manager.process("en", question, this.context);

    // Post-process response for the same reason as above
    postProcess(response);

    if (debug)
        console.log(response);

    // Check if there are slotFill, in which case the question is not complete
    if (response.slotFill) {
        return {
            complete: false,
            intent: response.intent,
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


function AtlasApproxNlp(context = {}) {
  this.initialised = false;
  this.context = context;
}

AtlasApproxNlp.prototype = {
  async initialise() {
    if (this.initialised == true)
      return this;

    // Initialise nlpjs
    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEn);
    const manager = container.get('nlp');
    
    // Import the model into manager
    // NOTE: this is a horrible hack, but hey
    await manager.import(modelString);

    this.nlpManager = manager;
    this.ask = ask.bind(this);

    this.initialised = true;

    return this;
  },

  reset() {
    this.context = {};
    return this;
  }
}


module.exports = {
  AtlasApproxNlp,
  buildAPIParams,
  buildAnswer,
}
