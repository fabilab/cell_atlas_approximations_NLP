const { dockStart } = require('@nlpjs/basic');
let { questionsGroups } = require("./testQuestions.js");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
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


(async () => {
  const dock = await dockStart({
    settings: {
      nlp: {
        forceNER: true,
        languages: ['en'],
        corpora: ["src/corpus.json"],
      }
    },
    use: ['Basic', 'LangEn'],
  });

  const manager = dock.get('nlp');

  // Train the network
  await manager.train();

  // Create a function to interact with the bot
  async function ask(question, context = {}) {
    question = preProcess(question);

    let response = await manager.process("en", question, context);

    let nAnswers = response.answers.length;
    if (nAnswers > 0) {
      response.answer = response.answers[getRandomInt(0, nAnswers)]["answer"];      
    }

    postProcess(response);

    return response;

    // Check if there are slotFill, in which case the question is not well posed
    if (response.slotFill) {
        return response.answer;
    }

    return response.answer;
  }

  // If questions are put to the script, answer them. Otherwise use test questions
  if ((process.argv.length >= 3) && (process.argv[2] != "")) {
    questionsGroups = [
      {"questions": [process.argv[2]], "intent": process.argv[3]},
    ];
    console.log(process.argv);
  }

  async function testGroup(questions, intent, entities = {}, context = {}, debug = false) {
    if (typeof questions === 'string' || questions instanceof String) {
      questions = [questions];
    }
    if (debug)
      console.log("--------------------------------------------");
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      if (debug)
        console.log(question);
      let response = await ask(question, context);
      if (response.intent != intent) {
        if (debug) {
          console.log(response);
          console.log("WRONG INTENT: not " + intent);
          console.log("--------------------------------------------");
        }
        return false;
      }
      if ((response.slotFill) && (i == questions.length - 1)) {
        if (debug) {
          console.log(response);
          console.log("--------------------------------------------");
          console.log("SLOTS NOT FILLED");
        }
        return false;
      }

      for (let je = 0; je < response.entities.length; je++) {
        const entity = response.entities[je];
        const entityName = entity.entity;
        const entityString = entity["type"] === "enum" ? entity["option"] : entity["sourceText"];
        if ((entities[entityName] !== undefined) && (entities[entityName] != entityString)){
          console.log(response);
          console.log("--------------------------------------------");
          console.log("ENTITY NOT CORRECT: " + entityName + " -> " + entityString);
          return false;
        }
      };

      if (response.intent == "average.geneExpression")
        console.log(response);
    }
    return true;
  }


  // Ask and answer questions
  let exit = false;
  for (let k = 0; k < questionsGroups.length; k++) {
    console.log("############################################");
    console.log("Group" + (k+1));
    // NOTE: Each question group resets the context
    let context = {};
    let { questions, intent, entities } = questionsGroups[k];
    exit = !await testGroup(questions, intent, entities, context, debug = true);
    if (!exit) {
      console.log("--------------------------------------------");
      console.log("OK");
    } else {
      console.log("############################################");
      break;
    }
  }

})();
