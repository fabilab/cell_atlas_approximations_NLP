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

  // NOTE: done in the corpus.json
  //// Adds the utterances and intents for the NLP
  //manager.addDocument('en', 'goodbye for now', 'greetings.bye');
  //manager.addDocument('en', 'bye bye take care', 'greetings.bye');
  //manager.addDocument('en', 'okay see you later', 'greetings.bye');
  //manager.addDocument('en', 'bye for now', 'greetings.bye');
  //manager.addDocument('en', 'i must go', 'greetings.bye');
  //manager.addDocument('en', 'hello', 'greetings.hello');
  //manager.addDocument('en', 'hi', 'greetings.hello');
  //manager.addDocument('en', 'howdy', 'greetings.hello');
  
  // TODO: Here for testing, actually move to corpus
  //// Train also the NLG
  //manager.addAnswer('en', 'greetings.bye', 'Till next time');
  //manager.addAnswer('en', 'greetings.bye', 'see you soon!');
  //manager.addAnswer('en', 'greetings.hello', 'Hey there!');
  //manager.addAnswer('en', 'greetings.hello', 'Greetings!');

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
      questionsGroups.push([process.argv[2]]);
  } else {
      questionsGroups = [
        //["what cell types are available?", "in mouse", "lung"],
        //["what are the markers for fibroblast in mouse lung"],
        //["what is the expression of Col1a1 in mouse heart"],
        //["what is the expression of Col1a1?", "in mouse", "in heart"],
        //["what are the 10 marker genes for fibroblast in murine lung?", "10"],
        //["who expresses Col1a1", "in mouse", "lung"],
        //["show genes similar to Pecam1", "10", "in mouse lung"],
        //["show cell types like fibroblast", "in mouse", "10"],
        //["make dotplot of Col1a1,Ptprc in mouse lung"],
        //["show the presence matrix of cell types in human"],
        // Default questions on landing page
        //'Hello there',
        //"What organisms are available in AtlasApprox?",
        //"List cell types in microcebus myoxinus pancreas",
        //"What is the average expression of ALK,CD8A,CD19 in human lung?",
        //"Show the marker genes for coronary in human heart.",
        //"Show 10 marker genes for coronary in human heart.",
        //"What is the fraction of IL6,TNF,APOE,COL1A1,ALK,CD8A,CD19,TP53 in human lung?",
        //"what cell type is the highest expressor of ALK in human?",
        //"what cell types are present in each organ of mouse?",
        //"what are 10 genes similar to COL1A1 in human lung?",
        //"what are 10 cell types similar to fibroblast in human?",
        "what kind of data is available?",
      ];
  }

  // Ask and answer questions
  for (let k = 0; k < questionsGroups.length; k++) {
      // Each question group resets the context
      let context = {};
      let questions = questionsGroups[k];
      if (typeof questions === 'string' || questions instanceof String) {
        questions = [questions];
      }
      console.log("############################################");
      console.log("Group" + (k+1));
      console.log("--------------------------------------------");
      for (let i = 0; i < questions.length; i++) {
        let question = questions[i];
        console.log(question);
        console.log(await ask(question, context));
        console.log("--------------------------------------------");
      }
      console.log("############################################");
  }

})();


/*
 *      "trim": [
        {
          "position": "betweenLast",
          "leftWords": ["of", "to"],
          "rightWords": ["in"]
        },
        {
          "position": "afterLast",
          "words": ["of"]
        },
        {
          "position": "afterFirst",
          "words": ["add", "remove", "delete"]
        },
        {
          "position": "after",
      	  "words": [
            "similar to", "genes like", "similar genes to",
            "expresses", "expressor of"
          ]
        }
      ]
 *
 *
 *      "trim": [
        {
          "position": "betweenLast",
          "leftWords": ["for", "markers of", "marker genes of"],
          "rightWords": ["in"]
        },
        {
          "position": "afterLast",
          "words": ["for", "markers of", "marker genes of"]
        },
        {
          "position": "after",
          "words": ["cell types like", "cell types similar to", "similar to"]
        }
      ]
    }
 *
 *
 * */
