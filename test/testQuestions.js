let questionsGroups = [
    {
      "questions": ["what species are available?"],
      "intent": "organisms.geneExpression",
    },
    {
      "questions": ["what organisms are available?"],
      "intent": "organisms.geneExpression",
    },
    {
      "questions": ["show organs in human"],
      "intent": "organs.geneExpression",
    },
    {
      "questions": ["show organs for human"],
      "intent": "organs.geneExpression",
      "entities": {
        "organism": "h_sapiens",
      },
    },
    {
      "questions": ["show organs for h_sapiens"],
      "intent": "organs.geneExpression",
    },
    {
      "questions": ["what cell types are available?", "in mouse", "lung"],
      "intent": "celltypes.geneExpression"
    },
    {
      "questions": ["what cell types are available in bread wheat?", "whole"],
      "intent": "celltypes.geneExpression",
      "entities": {
        "organism": "t_aestivum",
        "organ": "whole",
      }
    },
    {
      "questions": ["what cell types are available in sea urchin?", "whole"],
      "intent": "celltypes.geneExpression",
      "entities": {
        "organism": "s_purpuratus",
        "organ": "whole",
      }
    },
    { "questions": ["what are the markers for fibroblast in mouse lung", "5"],
      "intent": "markers.geneExpression"
    },
    {
      "questions": ["what are the markers of AT1 in human lung?", "10"],
      "intent": "markers.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "lung",
        "celltype": "AT1",
        "nFeatures": "10",
      }
    },
    {
      "questions": ["what are 10 markers for all cells in human lung?"],
      "intent": "markers.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "lung",
        "celltype": "all",
        "nFeatures": "10",
      }
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
      "intent": "highest_measurement.geneExpression",
    },
    {
      "questions": ["what express COL1A1 in human?"],
      "intent": "highest_measurement.geneExpression",
      "entitites": {
        "organism": "h_sapiens",
        "features": "COL1A1",
      }
    },
    {
      "questions": ["what express COL1A1 in human lung?"],
      "intent": "average.geneExpression",
      "entitites": {
        "organism": "h_sapiens",
        "organ": "lung",
        "features": "COL1A1",
      }
    },
    {
      "questions": ["show genes similar to Pecam1", "10", "in mouse lung"],
      "intent": "similar_features.geneExpression",
    },
    {
      "questions": "Show 10 genes similar to Col1a1 in mouse lung",
      "intent": "similar_features.geneExpression",
      "entities": {
        "organism": "m_musculus",
        "organ": "lung",
        "features": "Col1a1",
      }
    },
    {
      "questions": ["show cell types like fibroblast", "in mouse", "10", "Col1a1,Col6a2"],
      "intent": "similar_celltypes.geneExpression",
    },
    {
      "questions": ["make dotplot of Col1a1,Ptprc in mouse lung"],
      "intent": "fraction_detected.geneExpression",
    },
    {
      "questions": ["show the presence matrix of cell types in human"],
      "intent": "celltypexorgan.geneExpression",
    },
    {
      "questions": 'Hello there', "intent": "greetings.hello",
    },
    {
      "questions": "What organisms are available in AtlasApprox?",
      "intent": "organisms.geneExpression",
    },
    {
      "questions": "List cell types in microcebus murinus pancreas",
      "intent": "celltypes.geneExpression",
    },
    {
      "questions": "What is the average expression of ALK,CD8A,CD19 in human lung?",
      "intent": "average.geneExpression",
    },
    {
      "questions": ["Show the marker genes for coronary in human heart.", "3"],
      "intent": "markers.geneExpression",
    },
    {
      "questions": "Show 10 marker genes for coronary in human heart.",
      "intent": "markers.geneExpression",
    },
    {
      "questions": "What is the fraction of cells expressing IL6,TNF,APOE,COL1A1,ALK,CD8A,CD19,TP53 in human lung?",
      "intent": "fraction_detected.geneExpression",
    },
    {
      "questions": "what cell type is the highest expressor of ALK in human?",
      "intent": "highest_measurement.geneExpression",
    },
    {
      "questions": "what cell types are present in each organ of mouse?",
      "intent": "celltypexorgan.geneExpression",
    },
    {
      "questions": "what are 10 genes similar to COL1A1 in human lung?",
      "intent": "similar_features.geneExpression",
    },
    {
      "questions": ["what are 10 cell types similar to fibroblast in human?", "heart", "Col1a1,Col2a1"],
      "intent": "similar_celltypes.geneExpression",
    },
    {
      "questions": "what kind of data is available?",
      "intent": "measurement_types",
    },
    {
      "questions": "what measurement kinds are there?",
      "intent": "measurement_types",
    },
    {
      "questions": ["what are 10 cell types with similar chromatin peaks to fibroblast in human?", "lung"],
      "intent": "similar_celltypes.chromatinAccessibility",
    },
    {
      "questions": "what ATAC-Seq cell types are there in human lung?",
      "intent": "celltypes.chromatinAccessibility",
    },
    {
      "questions": ["what are the marker peaks for fibroblast in human lung?", "3"],
      "intent": "markers.chromatinAccessibility",
    },
    {
      "questions": "where are fibroblast in human?",
      "intent": "celltype_location.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "celltype": "fibroblast",
      }
    },
    {
      "questions": "Where are fibroblast detected in human?",
      "intent": "celltype_location.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "celltype": "fibroblast",
      }
    },
    {
      "questions": "What is the average expression of ALK,CD8A,CD19 across organs in human fibroblast?",
      "intent": "average.geneExpression.across_organs",
    },
    {
      "questions": "What is the fraction of cells expressing ALK,CD8A,CD19 across organs in human fibroblast?",
      "intent": "fraction_detected.geneExpression.across_organs",
    },
    {
      "questions": ["what cell type is similar to lung fibroblast in human?", "10", "Col1a1,Col2a1"],
      "intent": "similar_celltypes.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "celltype": "fibroblast",
        "features": "Col1a1,Col2a1",
        "nCelltypes": "10",
      }
    },
    {
      "questions": ["show 8 cell types like Uterus pericyte in human", "COL1A1,COL2A1"],
      "intent": "similar_celltypes.geneExpression",
    },
    {
      "questions": ["show 10 similar genes to COL1A1 in human lung"],
      "intent": "similar_features.geneExpression",
    },
    {
      "questions": ["show 5 cell types like Lung fibroblast in mouse", "Ptprc,Gzma,Col1a1,Col2a1,Col6a2"],
      "intent": "similar_celltypes.geneExpression",
    },
    {
      "questions": "take the logarithm",
      "intent": "plot.log",
    },
    {
      "questions": "where are smooth muscle detected in human?",
      "intent": "celltype_location.geneExpression",
    },
    {
      "questions": "where are muscle progenitor detected in s_mansoni?",
      "intent": "celltype_location.geneExpression",
    },
    {
      "questions": "explore human",
      "intent": "explore.organism.geneExpression",
    },
    {
      "questions": "What is the average expression of ALK, CD8A, CD19 in human lung?",
      "intent": "average.geneExpression",
      "entities": {
        "features": "ALK,CD8A,CD19",
      },
    },
    {
      "questions": "What is the chromatin accessibility of chr1:9955-10355 in human lung?",
      "intent": "average.chromatinAccessibility",
      "entities": {
        "features": "chr1:9955-10355",
      }
    },
    {
      "questions": "Compare fraction of cells expressing TP53, APOE, CD19, COL1A1, TGFBI in fibroblast across organs in human?",
      "intent": "fraction_detected.geneExpression.across_organs",
      "entities": {
        "features": "TP53,APOE,CD19,COL1A1,TGFBI",
        "organism": "h_sapiens",
        "celltype": "fibroblast",
      },
    },
    {
      "questions": "what is the fraction expressing TP53, AHR, MED4, VWF, COL1A1, APOE across organs in human fibroblast?",
      "intent": "fraction_detected.geneExpression.across_organs",
      "entities": {
        "features": "TP53,AHR,MED4,VWF,COL1A1,APOE",
        "organism": "h_sapiens",
        "celltype": "fibroblast",
      },
    },
    {
      "questions": "what is the expression of Hba1.L,Hbg1.L in frog liver",
      "intent": "average.geneExpression",
      "entities": {
        "organism": "x_laevis",
        "organ": "liver",
        "features": "Hba1.L,Hbg1.L",
      }
    },
    {
      "questions": "what is the sequence of COL1A1 in human?",
      "intent": "feature_sequences.geneExpression",
      "entities": {
        "features": "COL1A1",
        "organism": "h_sapiens",
      }
    },
    {
      "questions": "what are the sequences of COL1A1,COL6A2 in human?",
      "intent": "feature_sequences.geneExpression",
      "entities": {
        "features": "COL1A1,COL6A2",
        "organism": "h_sapiens",
      }
    },
    {
      "questions": "download",
      "intent": "download"
    },
    {
      "questions": "download as fasta",
      "intent": "download",
      "entities": {
        "format": "fasta"
      }
    },
    {
      "questions": "show the expression of TRINITY_DN18225_c0_g1,TRINITY_DN18226_c0_g1 across cell states in i_pulchra whole?",
      "intent": "neighborhood.geneExpression",
      "entities": {
        "organism": "i_pulchra",
        "organ": "whole",
        "features": "TRINITY_DN18225_c0_g1,TRINITY_DN18226_c0_g1",
      }
    },
    {
      "questions": "please zoom into cell states",
      "intent": "zoom.in.neighborhood"
    },
    {
      "questions": "can you increase detail?",
      "intent": "zoom.in.neighborhood"
    },
    {
      "questions": "please zoom out to cell types",
      "intent": "zoom.out.neighborhood"
    },
    {
      "questions": "please simplify",
      "intent": "zoom.out.neighborhood"
    },
    {
      "questions": "explore butterfly",
      "intent": "explore.organism.geneExpression",
      "entities": {
        "organism": "butterfly",
      }
    },
    {
      "questions": "What is the expression of TP53, AHR, MED4 in human blood?",
      "intent": "average.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "blood",
        "features": "TP53,AHR,MED4",
      }
    },
    {
      "questions": "Show the 10 marker genes for urothelial in h_sapiens bladder",
      "intent": "markers.geneExpression",
      "entities": {
        "nFeatures": "10",
        "organism": "h_sapiens",
        "organ": "bladder",
        "celltype": "urothelial",
      }
    },
    {
      "questions": "Show the 10 marker genes for luminal in h_sapiens mammary",
      "intent": "markers.geneExpression",
      "entities": {
        "nFeatures": "10",
        "organism": "h_sapiens",
        "organ": "mammary",
        "celltype": "luminal",
      }
    },
    {
      "questions": "what organs are there for chromatin accessibility in human?",
      "intent": "organs.chromatinAccessibility",
      "entities": {
        "organism": "h_sapiens",
      }
    },
    {
      "questions": ["what organs are there for chromatin accessibility", "in human?"],
      "intent": "organs.chromatinAccessibility",
      "entities": {
        "organism": "h_sapiens",
      }
    },
    {
      "questions": "where are radial glia in frog?",
      "intent": "celltype_location.geneExpression",
      "entities": {
        "organism": "x_laevis",
        "celltype": "radial glia",
      }
    },
    {
      "questions": "where are radial glia cells in frog?",
      "intent": "celltype_location.geneExpression",
      "entities": {
        "organism": "x_laevis",
        "celltype": "radial glia",
      }
    },
    {
      "questions": "show 10 markers of radial glia in frog brain",
      "intent": "markers.geneExpression",
      "entities": {
        "celltype": "radial glia",
        "organism": "x_laevis",
        "organ": "brain",
        "nFeatures": "10",
      }
    },
    {
      "questions": "are the genes COL1A1,COL1A2 present in the human genome?",
      "intent": "check_presence.geneExpression",
      "entities": {
        "features": "COL1A1,COL1A2",
        "organism": "h_sapiens",
      }
    },
    {
      "questions": "are COL1A1,COL1A2 found in the human genome?",
      "intent": "check_presence.geneExpression",
      "entities": {
        "features": "COL1A1,COL1A2",
        "organism": "h_sapiens",
      }
    },
    {
      "questions": "what organisms have chromatin accessibility?",
      "intent": "organisms.chromatinAccessibility",
    },
    {
      "questions": "Compare expression of APOE, CD19, COL1A1, TGFBI, EPCAM, COL13A1 in fibroblast across organs in human.",
      "intent": "average.geneExpression.across_organs",
      "entities": {
        "celltype": "fibroblast",
        "organism": "h_sapiens",
        "features": "APOE,CD19,COL1A1,TGFBI,EPCAM,COL13A1",
      }
    },
    {
      "questions": "Compare expression of APOE, CD19, and COL13A1 in fibroblast across organs in human.",
      "intent": "average.geneExpression.across_organs",
      "entities": {
        "celltype": "fibroblast",
        "organism": "h_sapiens",
        "features": "APOE,CD19,COL13A1",
      }
    },
    {
      "questions": "What are the cell states of ML25764a, ML358828a, ML071151a, ML065728a in jellyfish whole?",
      "intent": "neighborhood.geneExpression",
      "entities": {
        "organism": "m_leidyi",
        "organ": "whole",
        "features": "ML25764a,ML358828a,ML071151a,ML065728a"
      }
    },
    {
      "questions": "Show cell neighborhoods of TRINITY_DN30700_c7_g3, TRINITY_DN25289_c1_g3 in i_pulchra whole.",
      "intent": "neighborhood.geneExpression",
      "entities": {
        "organism": "i_pulchra",
        "organ": "whole",
        "features": "TRINITY_DN30700_c7_g3,TRINITY_DN25289_c1_g3",
      }
    },
    {
      "questions": "show expression of HBA1, KDM7A-DT, HBA2, MARK3, KAT2B, YOD1, FBXO9, KIAA0232, TTPAL, SLC25A37, HBB in human marrow",
      "intent": "average.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "marrow",
        "features": "HBA1,KDM7A-DT,HBA2,MARK3,KAT2B,YOD1,FBXO9,KIAA0232,TTPAL,SLC25A37,HBB",
      }
    },
    {
      "questions": "what are the 5 markers of T cells in the human lymphnode?",
      "intent": "markers.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "lymphnode",
        "celltype": "T",
        "nFeatures": "5",
      }
    },
    {
      "questions": "what is the expression of   CD19 in B cells in human lymphnode?",
      "intent": "average.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "lymphnode",
        "features": "CD19",
      }
    },
    {
      "questions": "explore the chromatin state of human",
      "intent": "explore.organism.chromatinAccessibility",
      "entities": {
        "organism": "h_sapiens"
      }
    },
    {
      "questions": "what are 5 peaks similar to chr1:9955-10355 in human lung?",
      "intent": "similar_features.chromatinAccessibility",
      "entities": {
        "organism": "h_sapiens",
        "organ": "lung",
        "features": "chr1:9955-10355",
        "nFeatures": "5",
      }
    },
    {
      "questions": "show neighborhood for CD1C in human pancreas",
      "intent": "neighborhood.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "pancreas",
        "features": "CD1C",
      }
    },
    {
      "questions": "what are the 20 highest PDPN expressors in human?",
      "intent": "highest_measurement.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "features": "PDPN",
        "nFeatures": "20",
      }
    },
    {
      "questions": "show 10 genes most similar to PDGFRB in human uterus",
      "intent": "similar_features.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "uterus",
        "features": "PDGFRB",
        "nFeatures": "10",
      }
    },
    {
      "questions": "Show the 10 top marker peaks for vascular smooth muscle in h_sapiens nerve",
      "intent": "markers.chromatinAccessibility",
      "entities": {
        "organism": "h_sapiens",
        "organ": "nerve",
        "celltype": "vascular smooth muscle",
        "nFeatures": "10",
      }
    },
    {
      "questions": ["what are cell types similar to lung fibroblast in human in chromatin accessibility?", "10"],
      "intent": "similar_celltypes.chromatinAccessibility",
      "entities": {
        "organism": "h_sapiens",
        "organ": "lung",
        "celltype": "fibroblast",
        "nCelltypes": "10",
      }
    },
    {
      "questions": ["what are 10 cell types in chromatin accessibility similar to lung fibroblast in human?"],
      "intent": "similar_celltypes.chromatinAccessibility",
      "entities": {
        "organism": "h_sapiens",
        "organ": "lung",
        "celltype": "fibroblast",
        "nCelltypes": "10",
      }
    },
    {
      "questions": ["what are the 10 cell types in chromatin accessibility similar to lung fibroblast in human?"],
      "intent": "similar_celltypes.chromatinAccessibility",
      "entities": {
        "organism": "h_sapiens",
        "organ": "lung",
        "celltype": "fibroblast",
        "nCelltypes": "10",
      }
    },
    {
      "questions": "compare expression of APOE, CD19, COL1A1 in smooth muscle across tissues in human",
      "intent": "average.geneExpression.across_organs",
      "entities": {
        "organism": "h_sapiens",
        "celltype": "smooth muscle",
        "features": "APOE,CD19,COL1A1",
      }
    },
    {
      "questions": "Compare fraction expressing PTPRC, MARCO, CD68, CD14 in macrophage across organs in human",
      "intent": "fraction_detected.geneExpression.across_organs",
      "entities": {
        "organism": "h_sapiens",
        "celltype": "macrophage",
        "features": "PTPRC,MARCO,CD68,CD14",
      }
    },
    {
      "questions": "please convert to dot plot",
      "intent": "convert_to.dotplot"
    },
    {
      "questions": "convert to heat map",
      "intent": "convert_to.heatmap"
    },
    {
      "questions": "what organs contain neuron across species?",
      "intent": "organxorganism.geneExpression",
      "entities": {
        "celltype": "neuron",
      }
    },
    {
      "questions": "What is the fraction of cells with open chromatin at chr1:9955-10355 in human lung?",
      "intent": "fraction_detected.chromatinAccessibility",
      "entities": {
        "features": "chr1:9955-10355",
        "organ": "lung",
        "organism": "h_sapiens",
      }
    },
    {
      "questions": "Thank you",
      "intent": "greetings.bye",
    },
    {
      "questions": "what cells coexpress ADGRE1 and PDGFRA in human?",
      "intent": "comeasurement.geneExpression",
      "entities": {
        "features": "ADGRE1,PDGFRA",
        "organism": "h_sapiens"
      }
    },
     {
      "questions": "what cells coexpress ADGRE1, PDGFRA in human?",
      "intent": "comeasurement.geneExpression",
      "entities": {
        "features": "ADGRE1,PDGFRA",
        "organism": "h_sapiens"
      }
    }, 
    {
      "questions": "where are smooth muscle cells found across the tree of life?",
      "intent": "organxorganism.geneExpression",
      "entities": {
        "celltype": "smooth muscle",
      }
    },
    {
      "questions": "what are 5 marker of fibroblast in human lung?",
      "intent": "markers.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "lung",
        "celltype": "fibroblast",
        "nFeatures": "5",
      }
    },
    {
      "questions": "what are 5 markers of macrophage in human spleen compared to other organs?",
      "intent": "markers.geneExpression.across_organs",
      "log": false,
      "entities": {
        "organism": "h_sapiens",
        "organ": "spleen",
        "celltype": "macrophage",
        "nFeatures": "5",
      }
    },
    {
      "questions": "who expresses the interaction partners of NOTCH1 in human marrow?",
      "intent": "interactors.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "marrow",
        "features": "NOTCH1",
      }
    },
    {
      "questions": "who expresses interactors of NOTCH1 in human marrow?",
      "intent": "interactors.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "marrow",
        "features": "NOTCH1",
      }
    },
    {
      "questions": "who expresses partners of NOTCH1 in human marrow?",
      "intent": "interactors.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "marrow",
        "features": "NOTCH1",
      }
    },
    {
      "questions": "what are the homologs of Ptprc, Col1a1 from mouse to human?",
      "intent": "homologs.geneExpression",
      "log": false,
      "entities": {
        "organism": "m_musculus",
        "targetOrganism": "h_sapiens",
        "features": "Ptprc,Col1a1",
      }
    },
    {
      "questions": "what are the homologs of these features from mouse to human?",
      "intent": "homologs.geneExpression",
      "log": false,
      "entities": {
        "organism": "m_musculus",
        "targetOrganism": "h_sapiens",
        "features": "these genes",
      }
    },
    {
      "questions": "where is the video guide for this website?",
      "intent": "link.video",
    },
    {
      "questions": "where is the user guide for this website?",
      "intent": "link.userguide",
    },
    {
      "questions": "where is the API for this website?",
      "intent": "link.api",
    },
    {
      "questions": "show 5 markers for all cells in rice root?",
      "intent": "markers.geneExpression",
      "entities": {
        "organism": "o_sativa",
        "organ": "root",
        "celltype": "all",
        "nFeatures": "5",
      }
    },
    {
      "questions": "show 5 markers for all cells in arabidopsis shoot?",
      "intent": "markers.geneExpression",
      "entities": {
        "organism": "a_thaliana",
        "organ": "shoot",
        "celltype": "all",
        "nFeatures": "5",
      }
    },
    {
      "questions": [
        "what are 10 celltypes similar to fat fibroblast in human?",
        "COL1A1,COL2A1,COL6A2",
      ],
      "intent": "similar_celltypes.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "fat",
        "celltype": "fibroblast",
        "nCelltypes": "10",
        "features": "COL1A1,COL2A1,COL6A2",
      }
    },
    {
      "questions": ["what are the 3 top surface markers of B cells in human liver"],
      "intent": "markers.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "liver",
        "nFeatures": "3",
        "surface": "surface",
      }
    },
    {
      "questions": ["show 3 surface markers of B cells in human liver"],
      "intent": "markers.geneExpression",
      "entities": {
        "organism": "h_sapiens",
        "organ": "liver",
        "nFeatures": "3",
        "surface": "surface",
      }
    }
  ];

module.exports = {
  questionsGroups,
}
