const { dockStart } = require('@nlpjs/basic');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
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
    let response = await manager.process("en", question, context);

    let nAnswers = response.answers.length;
    if (nAnswers > 0) {
      response.answer = response.answers[getRandomInt(0, nAnswers)]["answer"];      
    }

    return response;

    // Check if there are slotFill, in which case the question is not well posed
    if (response.slotFill) {
        return response.answer;
    }

    return response.answer;
  }

  // If questions are put to the script, answer them. Otherwise use test questions
  let questionsGroups = [];
  if ((process.argv.length >= 3) && (process.argv[2] != "")) {
      questionsGroups.push({"questions": [process.argv[2]], "intent": process.argv[3]});
      console.log(process.argv);
  } else {
      questionsGroups = [
        {
          "questions": ["what cell types are available?", "in mouse", "lung"],
          "intent": "celltypes.geneExpression"
        },
        { "questions": ["what are the markers for fibroblast in mouse lung", "5"],
          "intent": "markers.geneExpression"
        },
        {
          "questions": ["what is the expression of Col1a1 in mouse heart"],
          "intent": "average.geneExpression"
        },
        {
          "questions": ["what is the expression of Col1a1?", "in mouse", "in heart"],
          "intent": "average.geneExpression",
        },
        {
          "questions": ["what are the 10 marker genes for fibroblast in murine lung?"],
          "intent": "markers.geneExpression",
        },
        {
          "questions": ["who expresses Col1a1 in mouse?"],
          "intent": "highest_measurement.geneExpression",
        },
        {
          "questions": ["who expresses Col1a1 the most?", "in mouse"],
          "intent": "highest_measurement.geneExpression"},
        {
          "questions": ["show genes similar to Pecam1", "10", "in mouse lung"],
          "intent": "similar_features.geneExpression"},
        {
          "questions": ["show cell types like fibroblast", "in mouse", "10", "Col1a1,Col6a2"],
          "intent": "similar_celltypes.geneExpression"},
        {
          "questions": ["make dotplot of Col1a1,Ptprc in mouse lung"],
          "intent": "fraction_detected.geneExpression"},
        {
          "questions": ["show the presence matrix of cell types in human"],
          "intent": "celltypexorgan.geneExpression"},
        {
          "questions": 'Hello there', "intent": "greetings.hello"},
        {
          "questions": "What organisms are available in AtlasApprox?",
          "intent": "organisms.geneExpression"},
        {
          "questions": "List cell types in microcebus myoxinus pancreas",
          "intent": "celltypes.geneExpression"},
        {
          "questions": "What is the average expression of ALK,CD8A,CD19 in human lung?",
          "intent": "average.geneExpression"},
        {
          "questions": ["Show the marker genes for coronary in human heart.", "3"],
          "intent": "markers.geneExpression"},
        {
          "questions": "Show 10 marker genes for coronary in human heart.",
          "intent": "markers.geneExpression"},
        {
          "questions": "What is the fraction of IL6,TNF,APOE,COL1A1,ALK,CD8A,CD19,TP53 in human lung?",
          "intent": "fraction_detected.geneExpression"},
        {
          "questions": "what cell type is the highest expressor of ALK in human?",
          "intent": "highest_measurement.geneExpression"},
        {
          "questions": "what cell types are present in each organ of mouse?",
          "intent": "celltypexorgan.geneExpression"},
        {
          "questions": "what are 10 genes similar to COL1A1 in human lung?",
          "intent": "similar_features.geneExpression"},
        {
          "questions": ["what are 10 cell types similar to fibroblast in human?", "heart", "Col1a1,Col2a1"],
          "intent": "similar_celltypes.geneExpression"},
        {
          "questions": "what kind of data is available?",
          "intent": "measurement_types"},
        {
          "questions": "what measurement kinds are there?",
          "intent": "measurement_types"},
        {
          "questions": ["what are 10 cell types with similar chromatin peaks to fibroblast in human?", "lung"],
          "intent": "similar_celltypes.chromatinAccessibility"},
        {
          "questions": "what ATAC-Seq cell types are there in human lung?",
          "intent": "celltypes.chromatinAccessibility"},
        {
          "questions": ["what are the marker peaks for fibroblast in human lung?", "3"],
          "intent": "markers.chromatinAccessibility"},
        {
          "questions": "where are fibroblast in human?",
          "intent": "celltype_location.geneExpression"},
        {
          "questions": "What is the average expression of ALK,CD8A,CD19 across organs in human fibroblast?",
          "intent": "average.geneExpression.across_organs"},
        {
          "questions": "What is the fraction of cells expressing ALK,CD8A,CD19 across organs in human fibroblast?",
          "intent": "fraction_detected.geneExpression.across_organs"},
        {
          "questions": ["what cell type is similar to lung fibroblast in human?", "Col1a1,Col2a1"],
          "intent": "similar_celltypes.geneExpression"},
      ];
  }

  async function testGroup(questions, intent, context = {}) {
    if (typeof questions === 'string' || questions instanceof String) {
      questions = [questions];
    }
    console.log("--------------------------------------------");
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      console.log(question);
      let response = await ask(question, context);
      if (response.intent != intent) {
        console.log(response);
        console.log("WRONG INTENT: not " + intent);
        console.log("--------------------------------------------");
        return false;
      }
      if ((response.slotFill) && (i == questions.length - 1)) {
        console.log(response);
        console.log("--------------------------------------------");
        console.log("SLOTS NOT FILLED");
        return false;
      }
    }
    return true;
  }

  // Ask and answer questions
  let exit = false;
  for (let k = 0; k < questionsGroups.length; k++) {
    console.log("############################################");
    console.log("Group" + (k+1));
    // Each question group resets the context
    let context = {};
    let { questions, intent } = questionsGroups[k];
    exit = !await testGroup(questions, intent, context);
    if (!exit) {
      console.log("--------------------------------------------");
      console.log("OK");
    } else {
      console.log("############################################");
      break;
    }
  }

})();
