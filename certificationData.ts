

export interface TestQuestion {
  type: 'mcq' | 'msq';
  question: string;
  options: string[];
  correctAnswer: string | string[];
}

export interface Module {
  id: string;
  titleKey: string;
  content: string;
  test: TestQuestion[];
}

export interface CertificationCourse {
  id: string;
  titleKey: string;
  modules: Module[];
  finalExam: TestQuestion[];
}

interface CertificationData {
  veterinarian: CertificationCourse[];
  agronomist: CertificationCourse[];
}

export const certificationData: CertificationData = {
  agronomist: [
    // Certification 1: Crop Production & Management
    {
      id: 'agro_cert_1',
      titleKey: 'agro_cert_1',
      modules: [
        { 
          id: 'a1m1', 
          titleKey: 'agro_cert_1_mod_1', 
          content: `This module introduces learners to the core principles of agronomy, emphasizing the scientific and practical aspects of crop cultivation. It covers the understanding of **plant growth stages**, crop morphology, and physiological processes that influence yield. 
          
Learners explore the significance of climate, soil type, and seasonal variations in determining crop performance. The module also explains how crop selection is based on agro-climatic zones, rainfall patterns, and market demand. Key topics include **crop rotation**, mixed cropping, intercropping, and relay cropping, with real-world examples from Indian farming systems. Learners are introduced to sowing methods, seedbed preparation, and the importance of seed quality. The module further explains how to interpret cropping calendars, select suitable varieties, and assess field conditions. By the end, participants develop a foundational understanding of how scientific crop planning increases profitability, reduces risk, and ensures sustainable production. Critical thinking exercises help learners differentiate between traditional and modern methods, while case studies illustrate how agronomy decisions affect yields. This knowledge sets the stage for advanced modules focusing on nutrient management, irrigation, and pest control.`, 
          test: [
            // MCQs
            { type: 'mcq', question: 'What is the practice of growing different crops in succession on the same land called?', options: ['Intercropping', 'Mixed cropping', 'Crop rotation', 'Relay cropping'], correctAnswer: 'Crop rotation' },
            { type: 'mcq', question: 'Which of the following is NOT a major factor in determining crop performance mentioned in the module?', options: ['Climate', 'Soil type', 'Machinery brand', 'Seasonal variations'], correctAnswer: 'Machinery brand' },
            { type: 'mcq', question: 'According to the module, scientific crop planning leads to:', options: ['Increased risk', 'Reduced profitability', 'Increased profitability and reduced risk', 'Guaranteed high yields regardless of weather'], correctAnswer: 'Increased profitability and reduced risk' },
            { type: 'mcq', question: 'What does agronomy primarily focus on?', options: ['Animal husbandry', 'Crop cultivation science and practice', 'Farm economics only', 'Pest control chemicals'], correctAnswer: 'Crop cultivation science and practice' },
            { type: 'mcq', question: 'Interpreting cropping calendars helps a farmer to do what?', options: ['Predict the weather', 'Select suitable crop varieties for the season', 'Set market prices', 'Analyze soil pH'], correctAnswer: 'Select suitable crop varieties for the season' },
            // MSQs
            { type: 'msq', question: 'Which of the following are cropping systems mentioned in the module? (Select all that apply)', options: ['Crop rotation', 'Monoculture', 'Intercropping', 'Hydroponics'], correctAnswer: ['Crop rotation', 'Intercropping'] },
            { type: 'msq', question: 'Scientific crop planning helps to achieve which outcomes? (Select all that apply)', options: ['Increase profitability', 'Increase risk', 'Reduce risk', 'Ensure sustainable production'], correctAnswer: ['Increase profitability', 'Reduce risk', 'Ensure sustainable production'] },
            { type: 'msq', question: 'Which factors are considered when selecting a crop for a specific area? (Select all that apply)', options: ['Agro-climatic zone', 'Rainfall patterns', 'The farmer\'s favorite color', 'Market demand'], correctAnswer: ['Agro-climatic zone', 'Rainfall patterns', 'Market demand'] },
          ] 
        },
        { 
          id: 'a1m2', 
          titleKey: 'agro_cert_1_mod_2', 
          content: `This module focuses on the techniques and science behind choosing high-quality seeds and establishing successful nurseries. It begins with the classification of seeds—**foundation, certified, breeder, and hybrid**—explaining how their genetic purity influences crop uniformity and productivity. 
          
Learners study seed treatment methods, including fungicide coating, bio-priming, and inoculation, to protect seedlings from early-stage diseases. The module includes detailed nursery management practices used in vegetables, rice, and horticulture crops. Participants learn about germination requirements, nursery soil mixtures, temperature regulation, shading, and water management. Sowing methods such as **broadcasting, dibbling, transplanting, line sowing, and bed sowing** are explained with diagrams and field examples. The module also covers seed rate calculations, row spacing, plant population density, and factors affecting germination success. By understanding these parameters, learners can optimize yields and avoid common field problems such as poor stand establishment or uneven crop growth. Practical case examples show how farmers use nurseries to reduce seed costs, improve plant health, and maintain better control over crop cycles.`, 
          test: [
            // MCQs
            { type: 'mcq', question: 'Which seed type is specifically mentioned for its genetic purity influencing crop uniformity?', options: ['Wild seeds', 'Certified seeds', 'Untreated seeds', 'Saved seeds'], correctAnswer: 'Certified seeds' },
            { type: 'mcq', question: 'What is the purpose of seed treatment with fungicides?', options: ['To increase seed size', 'To protect seedlings from early-stage diseases', 'To make seeds taste better', 'To improve germination speed'], correctAnswer: 'To protect seedlings from early-stage diseases' },
            { type: 'mcq', question: 'Which of the following is a sowing method discussed in the module?', options: ['Broadcasting', 'Fertigation', 'Pollination', 'Harvesting'], correctAnswer: 'Broadcasting' },
            { type: 'mcq', question: 'Why do farmers use nurseries, according to the module?', options: ['To increase seed costs', 'To reduce seed costs and improve plant health', 'To make plants grow slower', 'To attract more pests'], correctAnswer: 'To reduce seed costs and improve plant health' },
            { type: 'mcq', question: 'What does "plant population density" refer to?', options: ['How many people work in the field', 'The number of plants in a given area', 'The weight of a single plant', 'The age of the plants'], correctAnswer: 'The number of plants in a given area' },
            // MSQs
            { type: 'msq', question: 'Which of the following are seed treatment methods mentioned in the module? (Select all that apply)', options: ['Fungicide coating', 'Painting the seeds blue', 'Inoculation', 'Bio-priming'], correctAnswer: ['Fungicide coating', 'Inoculation', 'Bio-priming'] },
            { type: 'msq', question: 'What aspects of nursery management are covered in the module? (Select all that apply)', options: ['Temperature regulation', 'Market price analysis', 'Shading', 'Nursery soil mixtures'], correctAnswer: ['Temperature regulation', 'Shading', 'Nursery soil mixtures'] },
            { type: 'msq', question: 'Which of these are sowing methods explained in the text? (Select all that apply)', options: ['Dibbling', 'Line sowing', 'Drone seeding', 'Transplanting'], correctAnswer: ['Dibbling', 'Line sowing', 'Transplanting'] },
          ] 
        },
        { 
          id: 'a1m3', 
          titleKey: 'agro_cert_1_mod_3', 
          content: `This module focuses on the crucial elements of soil fertility and plant nutrition. Learners begin by studying soil composition, pH, texture, structure, and nutrient availability. They learn to interpret soil testing reports, understand **macro- and micronutrient** requirements, and develop nutrient plans aligned with crop demands. The module covers organic amendments like compost, green manure, biofertilizers, and farmyard manure, explaining how they improve soil health. 
          
Participants explore balanced fertilization, including NPK application methods, foliar sprays, fertigation, and slow-release fertilizers. Water management is another central component, covering irrigation scheduling, evapotranspiration, and soil moisture conservation. **Drip and sprinkler irrigation** are compared with traditional flood irrigation, and learners study the economic and agronomic benefits of micro-irrigation. Techniques such as mulching, contour farming, and rainwater harvesting are introduced as climate-smart practices. The module provides practical tools to diagnose nutrient deficiencies and correct them promptly. By mastering this module, learners can implement efficient water and nutrient strategies that reduce costs, increase yields, and improve soil health over time.`, 
          test: [
            // MCQs
            { type: 'mcq', question: 'What are the two main categories of plant nutrients discussed?', options: ['Primary and secondary', 'Macro- and micronutrients', 'Organic and inorganic', 'Liquid and solid'], correctAnswer: 'Macro- and micronutrients' },
            { type: 'mcq', question: 'Which irrigation method is mentioned as a modern, efficient alternative to flood irrigation?', options: ['Canal irrigation', 'Drip irrigation', 'River irrigation', 'Rain-fed irrigation'], correctAnswer: 'Drip irrigation' },
            { type: 'mcq', question: 'What is the primary benefit of using organic amendments like compost?', options: ['They are cheaper than water', 'They sterilize the soil', 'They improve soil health', 'They work instantly'], correctAnswer: 'They improve soil health' },
            { type: 'mcq', question: 'What does "mulching" help with?', options: ['Increasing sunlight on the soil', 'Soil moisture conservation', 'Attracting pests', 'Making the field look tidy'], correctAnswer: 'Soil moisture conservation' },
            { type: 'mcq', question: 'What does NPK stand for in fertilization?', options: ['Nitrogen, Phosphorus, Potassium', 'Nitrate, Phosphate, Kerosene', 'Nitrogen, Potash, Kilogram', 'Nature, Plants, Knowledge'], correctAnswer: 'Nitrogen, Phosphorus, Potassium' },
            // MSQs
            { type: 'msq', question: 'Which of the following are considered organic amendments? (Select all that apply)', options: ['Compost', 'Urea', 'Green manure', 'Farmyard manure'], correctAnswer: ['Compost', 'Green manure', 'Farmyard manure'] },
            { type: 'msq', question: 'What aspects are part of water management as described in the module? (Select all that apply)', options: ['Irrigation scheduling', 'Soil moisture conservation', 'Pest identification', 'Rainwater harvesting'], correctAnswer: ['Irrigation scheduling', 'Soil moisture conservation', 'Rainwater harvesting'] },
            { type: 'msq', question: 'Which of these are modern micro-irrigation systems? (Select all that apply)', options: ['Flood irrigation', 'Drip irrigation', 'Sprinkler irrigation', 'Furrow irrigation'], correctAnswer: ['Drip irrigation', 'Sprinkler irrigation'] },
          ] 
        },
        { 
          id: 'a1m4', 
          titleKey: 'agro_cert_1_mod_4', 
          content: `This module explains **Integrated Pest Management (IPM)** and how to protect crops using a combination of biological, cultural, mechanical, and chemical methods. Learners begin by understanding pest life cycles, disease symptoms, and weed competition dynamics. The module introduces monitoring tools such as pheromone traps, sticky traps, and field scouting for early detection. 
          
Participants learn to identify major pests and diseases in cereals, pulses, oilseeds, vegetables, and fruits, along with their economic thresholds. **Cultural practices** like crop rotation, clean cultivation, and resistant varieties are emphasized as the first line of defense. Biological controls, including predators, parasitoids, and microbial pesticides, are explained with real farm examples. Chemical control is taught responsibly, focusing on safe pesticide selection, dosage calculation, spraying techniques, and residue management. Herbicide use, weed identification, and integrated weed management strategies are also covered. By the end of this module, learners gain practical decision-making skills that reduce crop losses, minimize chemical use, and ensure environmentally sustainable farming.`, 
          test: [
            // MCQs
            { type: 'mcq', question: 'What does IPM stand for?', options: ['Intensive Pest Mitigation', 'Integrated Pest Management', 'Immediate Pest Mobilization', 'Important Plant Medicine'], correctAnswer: 'Integrated Pest Management' },
            { type: 'mcq', question: 'Which of the following is considered a cultural practice for pest control?', options: ['Spraying chemicals', 'Using pheromone traps', 'Crop rotation', 'Introducing predators'], correctAnswer: 'Crop rotation' },
            { type: 'mcq', question: 'What is the purpose of a pheromone trap?', options: ['To water the plants', 'To monitor for pests', 'To fertilize the soil', 'To scare away birds'], correctAnswer: 'To monitor for pests' },
            { type: 'mcq', question: 'What is mentioned as the "first line of defense" in pest management?', options: ['Chemical sprays', 'Cultural practices', 'Biological controls', 'Mechanical traps'], correctAnswer: 'Cultural practices' },
            { type: 'mcq', question: 'IPM aims to...', options: ['Use as many chemicals as possible', 'Eliminate all insects from the farm', 'Minimize chemical use and farm sustainably', 'Only use biological methods'], correctAnswer: 'Minimize chemical use and farm sustainably' },
            // MSQs
            { type: 'msq', question: 'IPM is a combination of which methods? (Select all that apply)', options: ['Biological', 'Astrological', 'Cultural', 'Chemical'], correctAnswer: ['Biological', 'Cultural', 'Chemical'] },
            { type: 'msq', question: 'Which of the following are monitoring tools for pests? (Select all that apply)', options: ['Pheromone traps', 'Field scouting', 'Sticky traps', 'Soil pH meters'], correctAnswer: ['Pheromone traps', 'Field scouting', 'Sticky traps'] },
            { type: 'msq', question: 'Which of these are examples of cultural practices in IPM? (Select all that apply)', options: ['Using resistant varieties', 'Spraying pesticides', 'Clean cultivation', 'Crop rotation'], correctAnswer: ['Using resistant varieties', 'Clean cultivation', 'Crop rotation'] },
          ] 
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'Which of these is a key principle of agronomy?', options: ['Using only one type of seed forever', 'Understanding plant growth and its environment', 'Watering plants at noon every day', 'Avoiding crop rotation'], correctAnswer: 'Understanding plant growth and its environment' },
        { type: 'mcq', question: 'A certified seed is important because of its...', options: ['Color', 'Size', 'Genetic purity', 'Price'], correctAnswer: 'Genetic purity' },
        { type: 'mcq', question: 'Drip irrigation is considered more efficient than flood irrigation because it...', options: ['Uses more water', 'Delivers water directly to the root zone', 'Is a traditional method', 'Washes the leaves'], correctAnswer: 'Delivers water directly to the root zone' },
        { type: 'mcq', question: 'What is the main goal of Integrated Pest Management (IPM)?', options: ['To eradicate all insects', 'To rely solely on chemical pesticides', 'To manage pests sustainably with minimal chemical use', 'To only use traps'], correctAnswer: 'To manage pests sustainably with minimal chemical use' },
        { type: 'mcq', question: 'Which is an example of a cultural practice in pest control?', options: ['Spraying insecticide', 'Releasing ladybugs', 'Planting resistant crop varieties', 'Using a sticky trap'], correctAnswer: 'Planting resistant crop varieties' },
        { type: 'mcq', question: 'What are N, P, and K?', options: ['Types of soil', 'Essential macronutrients for plants', 'Pest control chemicals', 'Water purification elements'], correctAnswer: 'Essential macronutrients for plants' },
        { type: 'mcq', question: 'What is a primary benefit of using a nursery for seedlings?', options: ['It increases the risk of disease', 'It uses more seeds than direct sowing', 'It improves plant health and reduces seed cost', 'It requires more land'], correctAnswer: 'It improves plant health and reduces seed cost' },
        { type: 'mcq', question: 'Field scouting and sticky traps are used for...', options: ['Irrigation scheduling', 'Early detection of pests', 'Soil testing', 'Harvesting'], correctAnswer: 'Early detection of pests' },
        // MSQs
        { type: 'msq', question: 'Which of the following are modern, water-efficient irrigation systems? (Select all that apply)', options: ['Drip irrigation', 'Flood irrigation', 'Sprinkler irrigation', 'Canal irrigation'], correctAnswer: ['Drip irrigation', 'Sprinkler irrigation'] },
        { type: 'msq', question: 'Integrated Pest Management (IPM) incorporates which of the following control methods? (Select all that apply)', options: ['Cultural', 'Biological', 'Chemical', 'Financial'], correctAnswer: ['Cultural', 'Biological', 'Chemical'] },
        { type: 'msq', question: 'Which are considered macronutrients for plants? (Select all that apply)', options: ['Nitrogen', 'Zinc', 'Potassium', 'Iron'], correctAnswer: ['Nitrogen', 'Potassium'] },
        { type: 'msq', question: 'What are the benefits of using a nursery for raising seedlings? (Select all that apply)', options: ['Reduced seed cost', 'Better control over the growing environment', 'Healthier, more uniform seedlings', 'Higher chance of disease'], correctAnswer: ['Reduced seed cost', 'Better control over the growing environment', 'Healthier, more uniform seedlings'] },
        { type: 'msq', question: 'Which of these are examples of organic amendments for soil? (Select all that apply)', options: ['Compost', 'Synthetic NPK fertilizer', 'Farmyard manure', 'Green manure'], correctAnswer: ['Compost', 'Farmyard manure', 'Green manure'] },
      ]
    },
    // Certification 2: Soil Testing & Fertility Management
    {
      id: 'agro_cert_2',
      titleKey: 'agro_cert_2',
      modules: [
        {
          id: 'a2m1',
          titleKey: 'agro_cert_2_mod_1',
          content: `This module builds a strong foundation in soil science by introducing learners to the physical, chemical, and biological characteristics of soil. It begins with soil formation processes, including weathering, parent material influence, and the role of climate and organisms. Learners explore **soil texture (sand, silt, clay)**, structure, porosity, and bulk density, understanding how these properties influence water retention, aeration, and root penetration. 
          
The module provides detailed insight into soil color, mineral composition, organic matter content, and cation exchange capacity—all key determinants of fertility. **Indian soil types** such as alluvial, black cotton, red, laterite, desert, and forest soils are explained in detail, along with their crop suitability and limitations. Students also study soil horizons, classification systems, and landscape formation. Emphasis is placed on understanding soil health indicators and how human activities—tilling, fertilizers, and irrigation—impact long-term soil quality. By the end of this module, learners will be able to identify soil characteristics in the field, predict crop performance based on soil type, and recognize degradation issues such as salinity, acidity, erosion, and nutrient depletion, laying the groundwork for advanced fertility management.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What are the three main components of soil texture?', options: ['Sand, Silt, Clay', 'Rocks, Water, Air', 'Organic Matter, Minerals, Microbes', 'Topsoil, Subsoil, Bedrock'], correctAnswer: 'Sand, Silt, Clay' },
            { type: 'mcq', question: 'Which Indian soil type is well-known for growing cotton?', options: ['Alluvial', 'Red Soil', 'Laterite', 'Black Cotton Soil'], correctAnswer: 'Black Cotton Soil' },
            { type: 'mcq', question: 'What does "cation exchange capacity" (CEC) of a soil indicate?', options: ['Its color', 'Its temperature', 'Its fertility and ability to hold nutrients', 'Its depth'], correctAnswer: 'Its fertility and ability to hold nutrients' },
            { type: 'mcq', question: 'Soil formation is influenced by which factor?', options: ['Parent material and climate', 'Only human activity', 'The phase of the moon', 'The price of crops'], correctAnswer: 'Parent material and climate' },
            { type: 'mcq', question: 'The horizontal layers of soil are known as:', options: ['Textures', 'Structures', 'Horizons', 'Profiles'], correctAnswer: 'Horizons' },
            // MSQs
            { type: 'msq', question: 'The physical characteristics of soil include which of the following? (Select all that apply)', options: ['Texture', 'pH', 'Structure', 'Porosity'], correctAnswer: ['Texture', 'Structure', 'Porosity'] },
            { type: 'msq', question: 'Which of the following are major Indian soil types mentioned in the module? (Select all that apply)', options: ['Alluvial', 'Black Cotton', 'Red', 'Arctic Permafrost'], correctAnswer: ['Alluvial', 'Black Cotton', 'Red'] },
            { type: 'msq', question: 'Soil degradation issues discussed in the module include: (Select all that apply)', options: ['Salinity', 'Increased organic matter', 'Acidity', 'Erosion'], correctAnswer: ['Salinity', 'Acidity', 'Erosion'] },
          ]
        },
        {
          id: 'a2m2',
          titleKey: 'agro_cert_2_mod_2',
          content: `This module trains learners in the scientific approach to soil sampling and testing, ensuring accuracy and reliability in fertility recommendations. Participants begin by learning proper sampling techniques, including the **zig-zag pattern**, depth standards for various crops, and avoiding contamination around bunds, manure heaps, or waterlogged areas. 
          
The module explains how to prepare composite samples, dry and pack them, and submit them to certified labs. Students explore key laboratory tests such as **pH, EC (electrical conductivity), organic carbon, nitrogen, phosphorus, potassium, micronutrients (Zn, Fe, B, Mn), and soil texture analysis**. Hands-on interpretation exercises teach learners how to read soil health cards and lab reports, identify deficiencies, and evaluate soil constraints like salinity or sodicity. The module also covers rapid field kits and digital soil testing technologies. Special emphasis is placed on mistake prevention—how incorrect sampling leads to wrong fertilizer recommendations. By the end, learners develop confidence in collecting, evaluating, and validating soil test information, which is essential for building scientifically sound nutrient plans.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is the recommended pattern for collecting soil samples from a field?', options: ['A straight line', 'A circle in the center', 'A zig-zag pattern', 'Only from the corners'], correctAnswer: 'A zig-zag pattern' },
            { type: 'mcq', question: 'What does EC stand for in a soil test report?', options: ['Elemental Composition', 'Electrical Conductivity', 'Energy Content', 'Erosion Capability'], correctAnswer: 'Electrical Conductivity' },
            { type: 'mcq', question: 'Why is it important to avoid contaminated areas when sampling soil?', options: ['It makes the sample heavier', 'It gives an inaccurate, non-representative result', 'It is a traditional belief', 'It requires more paperwork'], correctAnswer: 'It gives an inaccurate, non-representative result' },
            { type: 'mcq', question: 'What information does a soil health card primarily provide?', options: ['Weather forecast', 'Crop prices', 'Nutrient status and soil constraints', 'Pest identification'], correctAnswer: 'Nutrient status and soil constraints' },
            { type: 'mcq', question: 'A composite sample is created by:', options: ['Taking soil from just one spot', 'Mixing several subsamples taken from across the field', 'Adding water to the soil', 'Testing the soil directly in the field'], correctAnswer: 'Mixing several subsamples taken from across the field' },
            // MSQs
            { type: 'msq', question: 'Which areas should be AVOIDED when taking soil samples? (Select all that apply)', options: ['Near manure heaps', 'The middle of a uniform field section', 'Waterlogged spots', 'Under large trees or near bunds'], correctAnswer: ['Near manure heaps', 'Waterlogged spots', 'Under large trees or near bunds'] },
            { type: 'msq', question: 'A standard soil lab report includes values for which of the following? (Select all that apply)', options: ['pH', 'Organic Carbon', 'Phosphorus (P)', 'The farmer\'s name'], correctAnswer: ['pH', 'Organic Carbon', 'Phosphorus (P)'] },
            { type: 'msq', question: 'What skills does this module help learners develop? (Select all that apply)', options: ['Confidence in collecting soil samples', 'Ability to interpret lab reports', 'Knowledge to build nutrient plans', 'How to operate a tractor'], correctAnswer: ['Confidence in collecting soil samples', 'Ability to interpret lab reports', 'Knowledge to build nutrient plans'] },
          ]
        },
        {
          id: 'a2m3',
          titleKey: 'agro_cert_2_mod_3',
          content: `This module focuses on plant nutrients, their functions, deficiency symptoms, and delivery systems. Learners study essential nutrients—**macro, secondary, and micro**—and understand how they interact in the soil environment. The module explains the nitrogen, phosphorus, and potassium cycles, showing how nutrients transform, move, or get lost through leaching, volatilization, and fixation. 
          
Participants explore organic fertilizers (FYM, compost, vermicompost), **biofertilizers (Rhizobium, Azotobacter, PSB)**, and chemical fertilizers (urea, DAP, MOP, NPK complexes), analyzing their advantages and limits. Application methods such as broadcasting, band placement, fertigation, foliar spray, side dressing, and top dressing are described in practical detail. Learners also study slow-release fertilizers, nano-urea, water-soluble fertilizers, and micronutrient chelates. Special emphasis is placed on balanced fertilization—how excessive or imbalanced use affects soil and crop health. Through real-world scenarios, students learn to choose the correct fertilizer based on soil test values, crop stage, and environmental conditions. The module empowers learners to create nutrient schedules that reduce cost and increase productivity sustainably.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Which of the following is a primary macronutrient essential for plants?', options: ['Nitrogen', 'Zinc', 'Iron', 'Copper'], correctAnswer: 'Nitrogen' },
            { type: 'mcq', question: 'The process of applying fertilizers through the irrigation system is called:', options: ['Top dressing', 'Broadcasting', 'Foliar spray', 'Fertigation'], correctAnswer: 'Fertigation' },
            { type: 'mcq', question: 'Rhizobium and Azotobacter are well-known examples of:', options: ['Chemical fertilizers', 'Biofertilizers', 'Herbicides', 'Fungicides'], correctAnswer: 'Biofertilizers' },
            { type: 'mcq', question: 'A foliar spray is used to apply nutrients directly to the plant\'s:', options: ['Roots', 'Stem', 'Leaves', 'Soil'], correctAnswer: 'Leaves' },
            { type: 'mcq', question: 'Muriate of Potash (MOP) is a primary source of which nutrient?', options: ['Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)', 'Sulphur (S)'], correctAnswer: 'Potassium (K)' },
            // MSQs
            { type: 'msq', question: 'Which of the following are considered primary macronutrients? (Select all that apply)', options: ['Nitrogen', 'Phosphorus', 'Zinc', 'Potassium'], correctAnswer: ['Nitrogen', 'Phosphorus', 'Potassium'] },
            { type: 'msq', question: 'Which of these are fertilizer application methods discussed in the module? (Select all that apply)', options: ['Broadcasting', 'Foliar spray', 'Band placement', 'Crop rotation'], correctAnswer: ['Broadcasting', 'Foliar spray', 'Band placement'] },
            { type: 'msq', question: 'Examples of biofertilizers mentioned in the module include: (Select all that apply)', options: ['Rhizobium', 'Azotobacter', 'Urea', 'PSB (Phosphate Solubilizing Bacteria)'], correctAnswer: ['Rhizobium', 'Azotobacter', 'PSB (Phosphate Solubilizing Bacteria)'] },
          ]
        },
        {
          id: 'a2m4',
          titleKey: 'agro_cert_2_mod_4',
          content: `This module integrates all aspects of nutrient management to teach long-term soil health strategies. **INM (Integrated Nutrient Management)** combines organic, inorganic, and biological sources to supply nutrients in a balanced manner. Learners explore how combining compost, crop residues, green manure, and biofertilizers with chemical fertilizers enhances nutrient efficiency and improves soil structure. 
          
The module includes techniques like **crop rotation, intercropping, and cover cropping** to naturally fix nitrogen and suppress pests. Soil health improvement methods such as liming acidic soils, gypsum application for sodic soils, and deep irrigation for salt leaching are explained. Participants learn about soil conservation practices—mulching, no-till farming, bunding, contour plowing, and agroforestry—that reduce erosion and increase water retention. Carbon sequestration through organic matter addition is also discussed as a climate-friendly approach. By the end of this module, learners can design holistic INM plans that improve soil productivity, reduce input costs, and promote long-term farm sustainability.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is the core principle of INM (Integrated Nutrient Management)?', options: ['Using only chemical fertilizers', 'Combining organic, inorganic, and biological nutrient sources', 'Avoiding fertilizers completely', 'Using only biofertilizers'], correctAnswer: 'Combining organic, inorganic, and biological nutrient sources' },
            { type: 'mcq', question: 'Which practice is used to correct acidic soils?', options: ['Gypsum application', 'Liming', 'Adding more nitrogen', 'Deep irrigation'], correctAnswer: 'Liming' },
            { type: 'mcq', question: 'No-till farming is a method of:', options: ['Nutrient application', 'Pest control', 'Soil conservation', 'Irrigation'], correctAnswer: 'Soil conservation' },
            { type: 'mcq', question: 'What is a primary benefit of using cover crops?', options: ['They increase soil erosion', 'They compete with the main crop for water', 'They can fix nitrogen and suppress pests', 'They require a lot of fertilizer'], correctAnswer: 'They can fix nitrogen and suppress pests' },
            { type: 'mcq', question: 'Carbon sequestration in soil is enhanced by:', options: ['Removing all crop residues', 'Adding organic matter', 'Using only chemical fertilizers', 'Frequent and deep tilling'], correctAnswer: 'Adding organic matter' },
            // MSQs
            { type: 'msq', question: 'INM involves the use of which of the following? (Select all that apply)', options: ['Compost', 'Chemical fertilizers', 'Green manure', 'Biofertilizers'], correctAnswer: ['Compost', 'Chemical fertilizers', 'Green manure', 'Biofertilizers'] },
            { type: 'msq', question: 'Which of the following are soil conservation practices? (Select all that apply)', options: ['Mulching', 'Contour plowing', 'Daily tilling', 'Bunding'], correctAnswer: ['Mulching', 'Contour plowing', 'Bunding'] },
            { type: 'msq', question: 'The goals of a good INM plan include: (Select all that apply)', options: ['Improve soil productivity', 'Reduce input costs', 'Increase reliance on a single fertilizer type', 'Promote long-term sustainability'], correctAnswer: ['Improve soil productivity', 'Reduce input costs', 'Promote long-term sustainability'] },
          ]
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'Black cotton soil is primarily found in India and is ideal for growing cotton due to its:', options: ['Low water retention', 'High sand content', 'High clay content and water-holding capacity', 'Acidic nature'], correctAnswer: 'High clay content and water-holding capacity' },
        { type: 'mcq', question: 'A soil test report shows a pH of 5.5. This soil is considered:', options: ['Neutral', 'Alkaline', 'Saline', 'Acidic'], correctAnswer: 'Acidic' },
        { type: 'mcq', question: 'What is the most critical first step for accurate fertilizer recommendation?', options: ['Checking the weather forecast', 'Proper soil sampling', 'Buying the cheapest fertilizer', 'Asking a neighbor'], correctAnswer: 'Proper soil sampling' },
        { type: 'mcq', question: 'Which of the following is an organic fertilizer?', options: ['Urea', 'DAP', 'Vermicompost', 'MOP'], correctAnswer: 'Vermicompost' },
        { type: 'mcq', question: 'The main benefit of INM is that it:', options: ['Is the fastest method', 'Uses only one nutrient source', 'Improves soil health sustainably', 'Requires no soil testing'], correctAnswer: 'Improves soil health sustainably' },
        { type: 'mcq', question: 'What does a high EC (Electrical Conductivity) value in soil indicate?', options: ['High organic matter', 'Good aeration', 'High salinity', 'Low pH'], correctAnswer: 'High salinity' },
        { type: 'mcq', question: 'Applying gypsum is a common practice to reclaim which type of soil?', options: ['Acidic soils', 'Sodic (alkaline) soils', 'Sandy soils', 'Waterlogged soils'], correctAnswer: 'Sodic (alkaline) soils' },
        { type: 'mcq', question: 'PSB (Phosphate Solubilizing Bacteria) are a type of:', options: ['Chemical fertilizer', 'Pesticide', 'Biofertilizer', 'Soil conditioner'], correctAnswer: 'Biofertilizer' },
        // MSQs
        { type: 'msq', question: 'A comprehensive soil test report typically includes which parameters? (Select all that apply)', options: ['pH', 'Organic Carbon', 'Potassium (K)', 'Pest count'], correctAnswer: ['pH', 'Organic Carbon', 'Potassium (K)'] },
        { type: 'msq', question: 'Which practices contribute to improving long-term soil health? (Select all that apply)', options: ['Adding compost', 'Using cover crops', 'No-till farming', 'Burning crop residue'], correctAnswer: ['Adding compost', 'Using cover crops', 'No-till farming'] },
        { type: 'msq', question: 'Which of the following are methods for applying fertilizer? (Select all that apply)', options: ['Fertigation', 'Foliar spray', 'Broadcasting', 'Soil sampling'], correctAnswer: ['Fertigation', 'Foliar spray', 'Broadcasting'] },
        { type: 'msq', question: 'The physical properties of soil include: (Select all that apply)', options: ['Texture', 'Structure', 'Color', 'Cation Exchange Capacity'], correctAnswer: ['Texture', 'Structure', 'Color'] },
        { type: 'msq', question: 'Integrated Nutrient Management (INM) aims to achieve which of the following goals? (Select all that apply)', options: ['Balance nutrient supply', 'Enhance nutrient use efficiency', 'Rely completely on chemical inputs', 'Improve soil structure'], correctAnswer: ['Balance nutrient supply', 'Enhance nutrient use efficiency', 'Improve soil structure'] },
      ]
    },
    // Certification 3: Precision Agriculture
    {
      id: 'agro_cert_3',
      titleKey: 'agro_cert_3',
      modules: [
        {
          id: 'a3m1',
          titleKey: 'agro_cert_3_mod_1',
          content: `This module introduces learners to the concept of **Precision Agriculture (PA)**, a modern approach that uses technology and data to optimize farming decisions. It begins by explaining how PA differs from traditional farming—shifting from uniform practices to site-specific management. 
          
The module explores the role of digital tools like **GPS, GIS, sensors, mobile apps, and satellite imagery** in understanding field variability. Learners study how PA reduces input waste, increases profitability, and supports sustainable farming. The global evolution of digital agriculture is discussed with examples from India, showcasing success stories in crops like cotton, wheat, sugarcane, and horticulture. The module also explains the terminology of variable-rate application, real-time monitoring, and data-driven decision-making. Participants learn how PA improves irrigation accuracy, nutrient efficiency, pest control, and yield prediction. Practical scenarios show how small and large farmers benefit from adopting these technologies. By the end, learners gain a clear understanding of how precision farming empowers both farmers and agribusinesses to make smarter, faster, and more efficient decisions.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is the main principle of Precision Agriculture (PA)?', options: ['Applying inputs uniformly across the entire field', 'Using only traditional farming methods', 'Site-specific management based on field variability', 'Reducing the use of all technology'], correctAnswer: 'Site-specific management based on field variability' },
            { type: 'mcq', question: 'Which technology is NOT listed as a digital tool for PA?', options: ['GPS', 'Sensors', 'Weather Vanes', 'Satellite imagery'], correctAnswer: 'Weather Vanes' },
            { type: 'mcq', question: 'What is "variable-rate application"?', options: ['Applying inputs at different times of the day', 'Changing the price of inputs', 'Adjusting the amount of input applied to different parts of a field', 'Using various brands of fertilizer'], correctAnswer: 'Adjusting the amount of input applied to different parts of a field' },
            { type: 'mcq', question: 'A primary benefit of Precision Agriculture is:', options: ['Increased input waste', 'Reduced profitability', 'Reduced input waste and increased profitability', 'Making farming more complicated'], correctAnswer: 'Reduced input waste and increased profitability' },
            { type: 'mcq', question: 'PA helps improve the accuracy of which farming activity?', options: ['Irrigation', 'Astrology', 'Crop dusting by hand', 'Traditional plowing'], correctAnswer: 'Irrigation' },
            // MSQs
            { type: 'msq', question: 'Precision Agriculture utilizes which of the following digital tools? (Select all that apply)', options: ['GPS', 'Mobile apps', 'GIS', 'Handwritten logs'], correctAnswer: ['GPS', 'Mobile apps', 'GIS'] },
            { type: 'msq', question: 'What are the key benefits of adopting PA? (Select all that apply)', options: ['Supports sustainable farming', 'Increases input waste', 'Improves nutrient efficiency', 'Increases profitability'], correctAnswer: ['Supports sustainable farming', 'Improves nutrient efficiency', 'Increases profitability'] },
            { type: 'msq', question: 'PA shifts farming from uniform practices to what kind of management? (Select all that apply)', options: ['Site-specific', 'Data-driven', 'Randomized', 'Real-time'], correctAnswer: ['Site-specific', 'Data-driven', 'Real-time'] },
          ]
        },
        {
          id: 'a3m2',
          titleKey: 'agro_cert_3_mod_2',
          content: `This module focuses on geospatial technologies that form the backbone of precision agriculture. Learners begin with the basics of **GPS (Global Positioning System)** and how it enables accurate mapping of farm boundaries, field paths, and operational routes for machinery. They then explore **GIS (Geographic Information Systems)**, understanding how spatial data layers—soil maps, crop health, slope, moisture zones—are combined to make actionable decisions. 
          
Remote sensing is introduced through concepts like **NDVI (Normalized Difference Vegetation Index)**, canopy temperature, and leaf area index, which help monitor crop stress, disease, and growth patterns. Participants learn how satellites like Sentinel, Landsat, and ISRO’s Cartosat provide imagery that can be interpreted for vegetation health and moisture conditions. The module includes hands-on exercises in reading color maps, identifying anomalies, and comparing multi-date satellite images to detect changes across crop stages. Students also explore how drones complement satellite data by providing high-resolution images. By the end, learners can interpret remote sensing data and convert it into practical recommendations for farmers.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What does GPS stand for?', options: ['Global Positioning System', 'Geographic Positioning Software', 'General Planting Science', 'Global Pricing Strategy'], correctAnswer: 'Global Positioning System' },
            { type: 'mcq', question: 'What does NDVI measure?', options: ['Soil pH', 'Rainfall', 'Vegetation health and density', 'Air temperature'], correctAnswer: 'Vegetation health and density' },
            { type: 'mcq', question: 'What is a Geographic Information System (GIS) used for in agriculture?', options: ['To plow the field', 'To combine spatial data layers for decision-making', 'To sell crops online', 'To forecast the weather'], correctAnswer: 'To combine spatial data layers for decision-making' },
            { type: 'mcq', question: 'How do drones complement satellite imagery?', options: ['They are faster than satellites', 'They provide lower-resolution images', 'They provide high-resolution images for detailed analysis', 'They can fly in any weather'], correctAnswer: 'They provide high-resolution images for detailed analysis' },
            { type: 'mcq', question: 'What can remote sensing help monitor in crops?', options: ['The farmer\'s mood', 'Crop stress and disease patterns', 'The price of fertilizer', 'The number of insects in the air'], correctAnswer: 'Crop stress and disease patterns' },
            // MSQs
            { type: 'msq', question: 'Geospatial technologies discussed in the module include: (Select all that apply)', options: ['GPS', 'GIS', 'Remote Sensing', 'Soil Augers'], correctAnswer: ['GPS', 'GIS', 'Remote Sensing'] },
            { type: 'msq', question: 'What kind of spatial data layers can be used in a GIS for agriculture? (Select all that apply)', options: ['Soil maps', 'Crop health maps', 'Slope maps', 'Farmer\'s family tree'], correctAnswer: ['Soil maps', 'Crop health maps', 'Slope maps'] },
            { type: 'msq', question: 'Remote sensing can be used to monitor which of the following crop parameters? (Select all that apply)', options: ['Canopy temperature', 'Growth patterns', 'Moisture conditions', 'Genetic makeup'], correctAnswer: ['Canopy temperature', 'Growth patterns', 'Moisture conditions'] },
          ]
        },
        {
          id: 'a3m3',
          titleKey: 'agro_cert_3_mod_3',
          content: `This module explores the use of smart sensors and **Internet of Things (IoT)** devices that continuously monitor field conditions. Learners study different types of sensors—**soil moisture sensors, nutrient sensors, weather stations, pH sensors, and crop canopy sensors**—and understand how each contributes to precision input management. 
          
The module explains how IoT devices collect real-time data and transmit it to cloud platforms or mobile apps, where farmers or experts can view insights instantly. Participants explore dashboards, alert systems, and predictive analytics tools that recommend irrigation schedules, fertilizer doses, and pest control timings. The module emphasizes how integrating sensor data with weather forecasts and crop models improves accuracy and reduces risk. Case examples show how sensor-based irrigation saves water in horticulture and sugarcane, while nutrient sensors optimize fertigation in greenhouses. Students also learn troubleshooting, calibration, and maintenance of sensor systems. By the end, participants understand how to convert raw field data into actionable decisions that enhance yield and reduce resource waste.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is the primary function of IoT devices in agriculture?', options: ['To plant seeds manually', 'To collect and transmit real-time field data', 'To sell produce directly to consumers', 'To predict crop prices'], correctAnswer: 'To collect and transmit real-time field data' },
            { type: 'mcq', question: 'A soil moisture sensor helps farmers decide:', options: ['Which crop to plant', 'When and how much to irrigate', 'The best time to harvest', 'The pH of the soil'], correctAnswer: 'When and how much to irrigate' },
            { type: 'mcq', question: 'How does integrating sensor data with weather forecasts help?', options: ['It confuses the system', 'It improves accuracy and reduces risk', 'It makes decisions slower', 'It only works for one type of crop'], correctAnswer: 'It improves accuracy and reduces risk' },
            { type: 'mcq', question: 'What is "fertigation" which can be optimized by nutrient sensors?', options: ['A type of soil', 'A method of harvesting', 'Applying fertilizer through the irrigation system', 'A pest control technique'], correctAnswer: 'Applying fertilizer through the irrigation system' },
            { type: 'mcq', question: 'What do predictive analytics tools do with sensor data?', options: ['Store it for later', 'Delete it immediately', 'Recommend actions like irrigation or fertilization', 'Display it without interpretation'], correctAnswer: 'Recommend actions like irrigation or fertilization' },
            // MSQs
            { type: 'msq', question: 'Which types of sensors are mentioned in the module? (Select all that apply)', options: ['Soil moisture sensors', 'pH sensors', 'Vehicle speed sensors', 'Crop canopy sensors'], correctAnswer: ['Soil moisture sensors', 'pH sensors', 'Crop canopy sensors'] },
            { type: 'msq', question: 'IoT devices in farming can transmit data to which platforms? (Select all that apply)', options: ['Cloud platforms', 'Mobile apps', 'Local newspapers', 'Alert systems'], correctAnswer: ['Cloud platforms', 'Mobile apps', 'Alert systems'] },
            { type: 'msq', question: 'Sensor-based systems can help optimize which farming activities? (Select all that apply)', options: ['Irrigation schedules', 'Fertilizer doses', 'Pest control timings', 'Crop variety selection'], correctAnswer: ['Irrigation schedules', 'Fertilizer doses', 'Pest control timings'] },
          ]
        },
        {
          id: 'a3m4',
          titleKey: 'agro_cert_3_mod_4',
          content: `This module covers advanced technologies that automate farm operations and apply inputs precisely where needed. Learners begin with an introduction to agricultural **drones** used for spraying, mapping, and crop scouting. They study flight planning, safety protocols, payload capacity, spray patterns, and regulatory requirements under DGCA. 
          
The module then explains automation technologies like autonomous tractors, robotic weeders, smart irrigation controllers, and automated fertigation systems. A major component is **Variable Rate Technology (VRT)**, which adjusts fertilizer, seed, or pesticide application based on field variability. Learners examine the machinery and software needed for VRT, including controllers, flow meters, and prescription maps. Real-life case studies highlight how VRT reduces input costs by 20–30% and improves crop performance in uneven fields. The module concludes with discussions on economic feasibility, maintenance challenges, and the skill sets needed to implement automation effectively. By the end, participants will understand how drones and VRT transform farming into an efficient, data-driven system.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is Variable Rate Technology (VRT) used for?', options: ['To change the speed of the tractor', 'To adjust the application of inputs like fertilizer based on field maps', 'To communicate with satellites', 'To plant seeds at a constant rate everywhere'], correctAnswer: 'To adjust the application of inputs like fertilizer based on field maps' },
            { type: 'mcq', question: 'What is a primary use for agricultural drones mentioned in the module?', options: ['Transporting harvested crops', 'Watering the entire field', 'Spraying, mapping, and crop scouting', 'Plowing the soil'], correctAnswer: 'Spraying, mapping, and crop scouting' },
            { type: 'mcq', question: 'According to case studies, by how much can VRT reduce input costs?', options: ['0-5%', '5-10%', '10-15%', '20-30%'], correctAnswer: '20-30%' },
            { type: 'mcq', question: 'Which of these is an example of an automation technology in farming?', options: ['Hand-weeding', 'Autonomous tractors', 'Manual irrigation', 'Horse-drawn plows'], correctAnswer: 'Autonomous tractors' },
            { type: 'mcq', question: 'What is a "prescription map" used for in VRT?', options: ['A map to the nearest pharmacy', 'A map that tells machinery how much input to apply in different locations', 'A weather map', 'A soil texture map'], correctAnswer: 'A map that tells machinery how much input to apply in different locations' },
            // MSQs
            { type: 'msq', question: 'What are agricultural drones used for? (Select all that apply)', options: ['Spraying pesticides', 'Mapping fields', 'Crop scouting', 'Harvesting wheat'], correctAnswer: ['Spraying pesticides', 'Mapping fields', 'Crop scouting'] },
            { type: 'msq', question: 'Variable Rate Technology (VRT) can be used to adjust the application of which inputs? (Select all that apply)', options: ['Fertilizer', 'Seeds', 'Pesticides', 'Sunlight'], correctAnswer: ['Fertilizer', 'Seeds', 'Pesticides'] },
            { type: 'msq', question: 'What topics are discussed regarding the implementation of automation? (Select all that apply)', options: ['Economic feasibility', 'Maintenance challenges', 'Required skill sets', 'The color of the machinery'], correctAnswer: ['Economic feasibility', 'Maintenance challenges', 'Required skill sets'] },
          ]
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'The core idea of Precision Agriculture is to move from uniform field management to:', options: ['Random management', 'No management', 'Site-specific management', 'Historical management'], correctAnswer: 'Site-specific management' },
        { type: 'mcq', question: 'What does a high NDVI value typically indicate on a satellite map?', options: ['Bare soil', 'Water stress', 'Healthy, dense vegetation', 'A building or structure'], correctAnswer: 'Healthy, dense vegetation' },
        { type: 'mcq', question: 'An IoT-based soil moisture sensor helps a farmer to:', options: ['Identify pests', 'Optimize irrigation schedules', 'Measure plant height', 'Analyze market prices'], correctAnswer: 'Optimize irrigation schedules' },
        { type: 'mcq', question: 'What technology allows a machine to apply different amounts of fertilizer to different parts of a field?', options: ['GPS', 'GIS', 'VRT (Variable Rate Technology)', 'NDVI'], correctAnswer: 'VRT (Variable Rate Technology)' },
        { type: 'mcq', question: 'What is a primary advantage of using drones over satellites for farm imaging?', options: ['They cover a larger area in one go', 'They provide much higher-resolution images', 'They are not affected by clouds', 'They are cheaper to launch'], correctAnswer: 'They provide much higher-resolution images' },
        { type: 'mcq', question: 'GIS in agriculture is used to:', options: ['Drive tractors automatically', 'Analyze layers of spatial data like soil type and yield', 'Spray pesticides on crops', 'Communicate with other farmers'], correctAnswer: 'Analyze layers of spatial data like soil type and yield' },
        { type: 'mcq', question: 'Real-time data from sensors helps in making what kind of decisions?', options: ['Decisions for next year\'s crop', 'Decisions based on past experience only', 'Immediate, data-driven decisions', 'Decisions based on calendar dates'], correctAnswer: 'Immediate, data-driven decisions' },
        { type: 'mcq', question: 'What does DGCA stand for in the context of drone regulations?', options: ['Directorate General of Civil Aviation', 'Digital GPS Crop Analyzer', 'Data Gathering and Collection App', 'Drone Guidance and Control Authority'], correctAnswer: 'Directorate General of Civil Aviation' },
        // MSQs
        { type: 'msq', question: 'Precision Agriculture aims to achieve which of the following outcomes? (Select all that apply)', options: ['Reduce input waste', 'Increase profitability', 'Support sustainable farming', 'Increase soil compaction'], correctAnswer: ['Reduce input waste', 'Increase profitability', 'Support sustainable farming'] },
        { type: 'msq', question: 'Which of these are key technologies used in Precision Agriculture? (Select all that apply)', options: ['GPS', 'Sensors', 'Drones', 'Traditional Almanacs'], correctAnswer: ['GPS', 'Sensors', 'Drones'] },
        { type: 'msq', question: 'What types of data can be collected by smart sensors in a field? (Select all that apply)', options: ['Soil moisture', 'Nutrient levels', 'Crop canopy health', 'Market prices'], correctAnswer: ['Soil moisture', 'Nutrient levels', 'Crop canopy health'] },
        { type: 'msq', question: 'What are the main functions of agricultural drones mentioned in the course? (Select all that apply)', options: ['Mapping', 'Spraying', 'Crop Scouting', 'Harvesting'], correctAnswer: ['Mapping', 'Spraying', 'Crop Scouting'] },
        { type: 'msq', question: 'Which elements are required for Variable Rate Technology (VRT) to function? (Select all that apply)', options: ['A prescription map', 'A GPS receiver', 'A VRT controller on the machinery', 'A mobile phone with internet'], correctAnswer: ['A prescription map', 'A GPS receiver', 'A VRT controller on the machinery'] },
      ]
    },
    // Certification 4: Organic Farming
    {
      id: 'agro_cert_4',
      titleKey: 'agro_cert_4',
      modules: [
        {
          id: 'a4m1',
          titleKey: 'agro_cert_4_mod_1',
          content: `This module introduces learners to the foundational principles of organic agriculture, focusing on **sustainability, ecological balance, and soil health**. It begins by explaining how organic farming differs from conventional chemical-based farming in terms of inputs, cultivation methods, and environmental impact. 
          
Learners study global and Indian organic standards such as **NPOP (National Programme for Organic Production), PGS-India (Participatory Guarantee System)**, USDA Organic, and EU Organic certifications. The module highlights how farmers can transition from conventional to organic systems, detailing the mandatory conversion period and record-keeping requirements. Students learn about prohibited inputs, acceptable organic amendments, documentation protocols, internal control systems (ICS), and audit procedures followed by certification bodies like APEDA-accredited agencies. Real-world examples show how farmers benefit from premium pricing, export opportunities, and climate-resilient cultivation. By the end, participants understand how certification ensures credibility, protects consumer trust, and opens doors to global markets. This module forms the backbone for implementing organic farming practices in later modules.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What are the core principles of organic agriculture?', options: ['Maximum chemical use', 'Sustainability, ecological balance, and soil health', 'Profit at any cost', 'Using genetically modified seeds'], correctAnswer: 'Sustainability, ecological balance, and soil health' },
            { type: 'mcq', question: 'What does NPOP stand for in Indian organic standards?', options: ['National Program for Organic Pricing', 'National Programme for Organic Production', 'New Program for Optimal Planting', 'National Policy on Organic Products'], correctAnswer: 'National Programme for Organic Production' },
            { type: 'mcq', question: 'What is the "conversion period" in organic farming?', options: ['The time it takes to harvest a crop', 'The mandatory period of farming organically before certification', 'The time of day to apply fertilizers', 'The lifespan of an organic product'], correctAnswer: 'The mandatory period of farming organically before certification' },
            { type: 'mcq', question: 'What is a key benefit of organic certification for farmers?', options: ['Access to cheaper chemical fertilizers', 'Ability to use prohibited inputs', 'Premium pricing and access to global markets', 'Less record-keeping'], correctAnswer: 'Premium pricing and access to global markets' },
            { type: 'mcq', question: 'PGS-India is a type of:', options: ['Chemical fertilizer', 'Pest control method', 'Organic certification system', 'Hybrid seed'], correctAnswer: 'Organic certification system' },
            // MSQs
            { type: 'msq', question: 'Organic farming differs from conventional farming in which aspects? (Select all that apply)', options: ['Types of inputs used', 'Impact on the environment', 'Cultivation methods', 'The types of crops grown'], correctAnswer: ['Types of inputs used', 'Impact on the environment', 'Cultivation methods'] },
            { type: 'msq', question: 'What are some organic standards mentioned in the module? (Select all that apply)', options: ['NPOP', 'USDA Organic', 'ISO 9001', 'PGS-India'], correctAnswer: ['NPOP', 'USDA Organic', 'PGS-India'] },
            { type: 'msq', question: 'The process of getting organically certified involves which of the following? (Select all that apply)', options: ['A conversion period', 'Detailed record-keeping', 'Audit procedures', 'Use of specific chemical pesticides'], correctAnswer: ['A conversion period', 'Detailed record-keeping', 'Audit procedures'] },
          ]
        },
        {
          id: 'a4m2',
          titleKey: 'agro_cert_4_mod_2',
          content: `This module focuses on building living, fertile soil—the core of organic farming. Learners explore how organic matter, microbial activity, and soil structure influence crop health. The module details various organic nutrient sources, including **farmyard manure, compost, vermicompost, poultry manure, green manure, and crop residues**. 
          
Students learn how to prepare high-quality compost using aerobic, anaerobic, windrow, and pit methods. **Vermicomposting** is covered in depth, including earthworm species selection, bedding materials, moisture management, and harvesting practices. The module explains nutrient-release dynamics, emphasizing how organic sources gradually improve soil fertility and benefit long-term productivity. **Biofertilizers** such as Rhizobium, Azotobacter, Azospirillum, PSB, Trichoderma, and Mycorrhiza are introduced, highlighting their roles in nutrient solubilization, nitrogen fixation, and disease suppression. Learners also study soil health improvement techniques like mulching, cover cropping, crop rotation, and natural carbon sequestration. By the end, participants understand how to design organic nutrient plans that enhance soil structure, increase water retention, and enrich soil biodiversity without synthetic chemicals.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is considered the "core of organic farming"?', options: ['Using chemical fertilizers', 'Building living, fertile soil', 'Maximizing water use', 'Planting a single crop'], correctAnswer: 'Building living, fertile soil' },
            { type: 'mcq', question: 'What is vermicomposting?', options: ['Composting with chemicals', 'Composting using earthworms', 'A type of green manure', 'A synthetic fertilizer'], correctAnswer: 'Composting using earthworms' },
            { type: 'mcq', question: 'What is the role of biofertilizers like Rhizobium and Azotobacter?', options: ['To kill all soil microbes', 'Nutrient solubilization and nitrogen fixation', 'To make the soil more compact', 'To increase soil acidity'], correctAnswer: 'Nutrient solubilization and nitrogen fixation' },
            { type: 'mcq', question: 'Which of the following is an example of a green manure?', options: ['Cow dung', 'A crop grown and plowed back into the soil', 'Decomposed kitchen waste', 'Earthworm castings'], correctAnswer: 'A crop grown and plowed back into the soil' },
            { type: 'mcq', question: 'How do organic nutrient sources improve soil fertility?', options: ['They release nutrients instantly and then disappear', 'They gradually improve fertility and benefit long-term productivity', 'They sterilize the soil', 'They are less effective than chemicals'], correctAnswer: 'They gradually improve fertility and benefit long-term productivity' },
            // MSQs
            { type: 'msq', question: 'Which of the following are organic nutrient sources mentioned in the module? (Select all that apply)', options: ['Vermicompost', 'Urea', 'Farmyard manure', 'Green manure'], correctAnswer: ['Vermicompost', 'Farmyard manure', 'Green manure'] },
            { type: 'msq', question: 'Techniques to improve soil health in organic farming include: (Select all that apply)', options: ['Mulching', 'Cover cropping', 'Applying synthetic herbicides', 'Crop rotation'], correctAnswer: ['Mulching', 'Cover cropping', 'Crop rotation'] },
            { type: 'msq', question: 'What are the roles of the biofertilizers discussed in the module? (Select all that apply)', options: ['Nitrogen fixation', 'Nutrient solubilization', 'Disease suppression', 'Weed elimination'], correctAnswer: ['Nitrogen fixation', 'Nutrient solubilization', 'Disease suppression'] },
          ]
        },
        {
          id: 'a4m3',
          titleKey: 'agro_cert_4_mod_3',
          content: `This module teaches non-chemical, eco-friendly approaches to managing pests, diseases, and weeds. It begins with the concept of **ecological balance**, emphasizing preventive measures such as crop diversity, resistant varieties, clean cultivation, and habitat management for beneficial insects. 
          
Learners explore various organic pest control tools like **neem oil, cow urine distillate (Ark), herbal extracts, pheromone traps, sticky traps, and light traps**. Microbial pesticides—Trichoderma, Beauveria, Metarhizium, Bacillus thuringiensis (Bt)—are covered with details on dosage, application timing, and target pests. The module explains natural disease management using compost teas, biocontrol agents, and botanical decoctions. Weed management is addressed through **mulching, mechanical weeding, stale seedbed techniques, cover cropping, and solarization**. Students learn how to monitor pest populations, maintain field sanitation, and use cultural practices to reduce infestations. Real-life case studies show how integrated organic practices lower chemical dependency, increase farm biodiversity, and maintain crop health. By the end, learners can design holistic pest and weed management strategies suitable for various organic cropping systems.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is a key preventive measure in organic pest management?', options: ['Spraying chemicals weekly', 'Promoting crop diversity and using resistant varieties', 'Removing all insects from the farm', 'Watering less frequently'], correctAnswer: 'Promoting crop diversity and using resistant varieties' },
            { type: 'mcq', question: 'Neem oil is an example of what type of pest control tool?', options: ['A chemical pesticide', 'A mechanical trap', 'An organic/botanical pest control tool', 'A microbial pesticide'], correctAnswer: 'An organic/botanical pest control tool' },
            { type: 'mcq', question: 'What is solarization used for?', options: ['Pest control', 'Irrigation', 'Weed management', 'Fertilization'], correctAnswer: 'Weed management' },
            { type: 'mcq', question: 'Bacillus thuringiensis (Bt) is a type of:', options: ['Weed', 'Beneficial insect', 'Microbial pesticide', 'Herbal extract'], correctAnswer: 'Microbial pesticide' },
            { type: 'mcq', question: 'What is a "stale seedbed" technique?', options: ['A method to make seeds last longer in storage', 'A way to encourage weed germination and then remove them before planting', 'A type of nursery bed', 'A bed that is too old to be used'], correctAnswer: 'A way to encourage weed germination and then remove them before planting' },
            // MSQs
            { type: 'msq', question: 'Which of the following are organic pest control tools? (Select all that apply)', options: ['Pheromone traps', 'Neem oil', 'Synthetic insecticides', 'Sticky traps'], correctAnswer: ['Pheromone traps', 'Neem oil', 'Sticky traps'] },
            { type: 'msq', question: 'Organic weed management strategies include: (Select all that apply)', options: ['Mulching', 'Application of glyphosate', 'Mechanical weeding', 'Cover cropping'], correctAnswer: ['Mulching', 'Mechanical weeding', 'Cover cropping'] },
            { type: 'msq', question: 'Preventive measures in organic pest management focus on: (Select all that apply)', options: ['Using resistant varieties', 'Maintaining clean cultivation', 'Managing habitats for beneficial insects', 'Scheduled chemical spraying'], correctAnswer: ['Using resistant varieties', 'Maintaining clean cultivation', 'Managing habitats for beneficial insects'] },
          ]
        },
        {
          id: 'a4m4',
          titleKey: 'agro_cert_4_mod_4',
          content: `This module integrates all organic practices into a profitable and well-managed farming system. Learners begin with crop planning principles—choosing crops suited to climate, soil type, and market demand. They explore **organic seed sourcing**, nursery management, spacing, spacing adjustments, intercropping patterns, and crop rotation sequences that enhance soil fertility and reduce pest pressure. 
          
The module covers water management using drip irrigation, mulching, and rainwater harvesting. **Farm-level documentation** requirements, including activity logs, input registers, field maps, and harvest records, are explained in detail to maintain certification compliance. Students learn post-harvest handling, safe storage, grading, and packaging for organic produce. The module also introduces marketing channels—farmers’ markets, organic retail chains, institutional buyers, online platforms, and export markets. Participants explore how **FPOs, cooperatives, and certification agencies** support market access. Case studies highlight successful organic farmers who have built sustainable business models through branding and direct consumer connections. By the end, learners can plan, manage, document, and market a fully organic farming operation.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Why is detailed farm-level documentation important in organic farming?', options: ['It is a good hobby for farmers', 'To maintain certification compliance', 'To calculate chemical dosages', 'It is not important'], correctAnswer: 'To maintain certification compliance' },
            { type: 'mcq', question: 'Which of the following is a marketing channel for organic produce?', options: ['The conventional grain market only', 'Farmers\' markets and organic retail chains', 'Government subsidy programs', 'Chemical fertilizer shops'], correctAnswer: 'Farmers\' markets and organic retail chains' },
            { type: 'mcq', question: 'What is the role of an FPO in organic farming?', options: ['To sell chemical inputs', 'To certify farms individually', 'To support farmers with collective marketing and market access', 'To set the rules for organic farming'], correctAnswer: 'To support farmers with collective marketing and market access' },
            { type: 'mcq', question: 'Organic crop planning includes choosing crops based on:', options: ['Only the highest price', 'Climate, soil type, and market demand', 'The prettiest flower', 'The easiest crop to grow'], correctAnswer: 'Climate, soil type, and market demand' },
            { type: 'mcq', question: 'Which water management technique is suitable for organic farming?', options: ['Flood irrigation', 'Canal water overuse', 'Drip irrigation and mulching', 'Watering during the hottest part of the day'], correctAnswer: 'Drip irrigation and mulching' },
            // MSQs
            { type: 'msq', question: 'What types of documentation are required for organic certification? (Select all that apply)', options: ['Activity logs', 'Input registers', 'Field maps', 'A list of preferred chemical pesticides'], correctAnswer: ['Activity logs', 'Input registers', 'Field maps'] },
            { type: 'msq', question: 'Which organizations help organic farmers with market access? (Select all that apply)', options: ['FPOs (Farmer Producer Organizations)', 'Pesticide companies', 'Cooperatives', 'Certification agencies'], correctAnswer: ['FPOs (Farmer Producer Organizations)', 'Cooperatives', 'Certification agencies'] },
            { type: 'msq', question: 'Organic crop planning involves considering which of the following? (Select all that apply)', options: ['Organic seed sourcing', 'Intercropping patterns', 'Crop rotation sequences', 'The latest synthetic fertilizer'], correctAnswer: ['Organic seed sourcing', 'Intercropping patterns', 'Crop rotation sequences'] },
          ]
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'What is a mandatory step for a conventional farm to become certified organic?', options: ['Doubling chemical use', 'Undergoing a conversion period', 'Planting only one crop', 'Ignoring all records'], correctAnswer: 'Undergoing a conversion period' },
        { type: 'mcq', question: 'Vermicompost is a nutrient-rich organic fertilizer produced by:', options: ['Chemical factories', 'Decomposing plants', 'Earthworms', 'Specialized bacteria'], correctAnswer: 'Earthworms' },
        { type: 'mcq', question: 'Which of the following is a key preventive strategy in organic pest management?', options: ['Scheduled insecticide sprays', 'Enhancing crop diversity', 'Removing all insects, including beneficial ones', 'Using genetically modified seeds'], correctAnswer: 'Enhancing crop diversity' },
        { type: 'mcq', question: 'What does "PGS-India" refer to?', options: ['A type of fertilizer', 'A pest', 'A Participatory Guarantee System for organic certification', 'A government loan scheme'], correctAnswer: 'A Participatory Guarantee System for organic certification' },
        { type: 'mcq', question: 'Mulching is an effective organic method for:', options: ['Weed management and water conservation', 'Attracting pests', 'Applying fertilizer', 'Sterilizing the soil'], correctAnswer: 'Weed management and water conservation' },
        { type: 'mcq', question: 'Bacillus thuringiensis (Bt) is used in organic farming as a:', options: ['Biofertilizer', 'Microbial pesticide', 'Soil conditioner', 'Weedicide'], correctAnswer: 'Microbial pesticide' },
        { type: 'mcq', question: 'The primary purpose of keeping an "input register" on an organic farm is to:', options: ['Track rainfall', 'Document all substances applied to the fields for certification', 'Record harvest quantities', 'Manage employee salaries'], correctAnswer: 'Document all substances applied to the fields for certification' },
        { type: 'mcq', question: 'Which is NOT a principle of organic farming?', options: ['Ecological balance', 'Soil health', 'Sustainability', 'Heavy reliance on synthetic inputs'], correctAnswer: 'Heavy reliance on synthetic inputs' },
        // MSQs
        { type: 'msq', question: 'Which of the following are considered organic nutrient sources? (Select all that apply)', options: ['Compost', 'Farmyard manure', 'Synthetic Urea', 'Green manure'], correctAnswer: ['Compost', 'Farmyard manure', 'Green manure'] },
        { type: 'msq', question: 'Organic certification standards like NPOP define which of the following? (Select all that apply)', options: ['Prohibited inputs', 'Record-keeping requirements', 'Mandatory conversion period', 'Recommended chemical pesticides'], correctAnswer: ['Prohibited inputs', 'Record-keeping requirements', 'Mandatory conversion period'] },
        { type: 'msq', question: 'Which methods are used for weed management in organic farming? (Select all that apply)', options: ['Application of selective herbicides', 'Cover cropping', 'Mechanical weeding', 'Solarization'], correctAnswer: ['Cover cropping', 'Mechanical weeding', 'Solarization'] },
        { type: 'msq', question: 'What are the benefits for farmers who get their farms organically certified? (Select all that apply)', options: ['Premium pricing for produce', 'Access to export markets', 'Improved soil health over time', 'Ability to use cheaper synthetic fertilizers'], correctAnswer: ['Premium pricing for produce', 'Access to export markets', 'Improved soil health over time'] },
        { type: 'msq', question: 'Biofertilizers like Rhizobium and PSB help organic farms by: (Select all that apply)', options: ['Fixing atmospheric nitrogen', 'Solubilizing nutrients like phosphorus', 'Suppressing soil-borne diseases', 'Killing all weeds'], correctAnswer: ['Fixing atmospheric nitrogen', 'Solubilizing nutrients like phosphorus', 'Suppressing soil-borne diseases'] },
      ]
    },
    // Certification 5: Water & Irrigation Management
    {
      id: 'agro_cert_5',
      titleKey: 'agro_cert_5',
      modules: [
        {
          id: 'a5m1',
          titleKey: 'agro_cert_5_mod_1',
          content: `This module introduces the fundamentals of agricultural water management, helping learners understand how water availability and distribution influence crop productivity. It begins with an overview of India’s water resources—surface water, groundwater, canals, tanks, and rainfall patterns—and their significance for farming. 
          
Learners study the concepts of **evapotranspiration (ET), crop water requirement (CWR), effective rainfall, and water-use efficiency (WUE)**. The module explains how different crops require varying amounts of water at different growth stages, making timing crucial for optimal yield. Students explore methods to estimate water needs using climatic data, crop coefficients (Kc), and soil moisture status. Traditional irrigation methods (flooding, furrow, basin, border) are compared with modern systems to highlight efficiency differences. Case examples show how improper irrigation leads to yield loss, nutrient leaching, or disease outbreaks. By the end of this module, learners can assess crop water requirements accurately and understand how resource planning ensures sustainability in water-scarce regions.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What does CWR stand for in water management?', options: ['Canal Water Regulation', 'Crop Water Requirement', 'Critical Water Ratio', 'Complete Water Resource'], correctAnswer: 'Crop Water Requirement' },
            { type: 'mcq', question: 'What is evapotranspiration (ET)?', options: ['The process of fertilizing with water', 'The combined loss of water from soil evaporation and plant transpiration', 'A method of irrigation', 'Rainfall that is effective for crop growth'], correctAnswer: 'The combined loss of water from soil evaporation and plant transpiration' },
            { type: 'mcq', question: 'Which of the following is a traditional irrigation method?', options: ['Drip irrigation', 'Sprinkler irrigation', 'Flood irrigation', 'Automated irrigation'], correctAnswer: 'Flood irrigation' },
            { type: 'mcq', question: 'Why is the timing of irrigation crucial?', options: ['Because water is only available at certain times', 'Because different crops need different amounts of water at different growth stages', 'To wash pests off the leaves', 'It is not crucial, any time is fine'], correctAnswer: 'Because different crops need different amounts of water at different growth stages' },
            { type: 'mcq', question: 'What is a potential negative consequence of improper irrigation?', options: ['Increased nutrient availability', 'Yield loss and nutrient leaching', 'Healthier soil structure', 'Reduced pest attacks'], correctAnswer: 'Yield loss and nutrient leaching' },
            // MSQs
            { type: 'msq', question: 'India\'s water resources mentioned in the module include: (Select all that apply)', options: ['Groundwater', 'Surface water (rivers, canals)', 'Desalinated ocean water', 'Rainfall'], correctAnswer: ['Groundwater', 'Surface water (rivers, canals)', 'Rainfall'] },
            { type: 'msq', question: 'Which concepts are key to understanding crop water needs? (Select all that apply)', options: ['Evapotranspiration (ET)', 'Crop Water Requirement (CWR)', 'Water-Use Efficiency (WUE)', 'Soil pH'], correctAnswer: ['Evapotranspiration (ET)', 'Crop Water Requirement (CWR)', 'Water-Use Efficiency (WUE)'] },
            { type: 'msq', question: 'Methods to estimate crop water needs include: (Select all that apply)', options: ['Using climatic data', 'Assessing soil moisture status', 'Using crop coefficients (Kc)', 'Guessing based on the season'], correctAnswer: ['Using climatic data', 'Assessing soil moisture status', 'Using crop coefficients (Kc)'] },
          ]
        },
        {
          id: 'a5m2',
          titleKey: 'agro_cert_5_mod_2',
          content: `This module explores the various irrigation methods available to farmers and their suitability for different crops and soil types. It begins with surface irrigation techniques—flooding, basin, furrow, and check-basin methods—detailing their water losses, labor needs, and efficiency levels. 
          
Students then dive into modern irrigation technologies, including **sprinkler systems** that simulate rainfall and are suitable for uneven terrains and light soils. **Drip irrigation** is covered extensively, explaining components like laterals, emitters, filters, pumps, and fertigation units. Learners study how drip systems deliver water directly to the root zone, reducing evaporation and increasing efficiency. The module also covers micro-sprinklers and rain-gun systems used in horticulture and field crops. Comparisons are made to highlight cost, efficiency, maintenance needs, and crop suitability. Case studies show how farmers adopt micro-irrigation to save 30–50% water while improving yields. By the end, learners understand how to choose the right irrigation method based on soil texture, crop type, slope, and water availability.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Which modern irrigation system delivers water directly to the root zone?', options: ['Flood irrigation', 'Sprinkler irrigation', 'Drip irrigation', 'Furrow irrigation'], correctAnswer: 'Drip irrigation' },
            { type: 'mcq', question: 'Sprinkler systems are particularly suitable for:', options: ['Perfectly level fields only', 'Heavy clay soils', 'Uneven terrains and light soils', 'Indoor farming'], correctAnswer: 'Uneven terrains and light soils' },
            { type: 'mcq', question: 'What is a major disadvantage of surface irrigation methods like flooding?', options: ['High water efficiency', 'Low labor needs', 'High water losses', 'Low initial cost'], correctAnswer: 'High water losses' },
            { type: 'mcq', question: 'What are "emitters" a component of?', options: ['Sprinkler systems', 'Canal systems', 'Drip irrigation systems', 'Rain-gun systems'], correctAnswer: 'Drip irrigation systems' },
            { type: 'mcq', question: 'According to case studies, how much water can micro-irrigation save?', options: ['0-10%', '10-20%', '30-50%', 'Over 60%'], correctAnswer: '30-50%' },
            // MSQs
            { type: 'msq', question: 'Which of the following are modern irrigation technologies? (Select all that apply)', options: ['Drip irrigation', 'Flood irrigation', 'Sprinkler systems', 'Micro-sprinklers'], correctAnswer: ['Drip irrigation', 'Sprinkler systems', 'Micro-sprinklers'] },
            { type: 'msq', question: 'The choice of irrigation method depends on which factors? (Select all that apply)', options: ['Soil texture', 'Crop type', 'The color of the crop', 'Water availability'], correctAnswer: ['Soil texture', 'Crop type', 'Water availability'] },
            { type: 'msq', question: 'Components of a drip irrigation system include: (Select all that apply)', options: ['Laterals', 'Emitters', 'Filters', 'Large water cannons'], correctAnswer: ['Laterals', 'Emitters', 'Filters'] },
          ]
        },
        {
          id: 'a5m3',
          titleKey: 'agro_cert_5_mod_3',
          content: `This module teaches learners how to plan irrigation strategically to maximize water efficiency and crop health. It begins with methods to determine irrigation timing—**soil moisture monitoring, tensiometers, visual indicators, crop growth stages, and evapotranspiration-based scheduling**. 
          
Students explore automation tools like **soil moisture sensors, drip irrigation controllers, and IoT-based water management systems** that enable real-time decision-making. The module explains the concept of deficit irrigation, partial root-zone drying, and regulated deficit irrigation for crops like grapes, pomegranates, and cotton. Water conservation practices such as **mulching, ridge–furrow planting, bunding, contour cultivation, and zero tillage** are discussed to reduce evaporation and runoff. Learners also study rainwater harvesting, farm pond construction, percolation tanks, and groundwater recharge methods. Real-life examples illustrate how farms increase productivity through scientific water scheduling and automation. By the end, participants acquire the knowledge to design water-saving strategies that cut irrigation costs while maintaining or increasing yields.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is a tensiometer used for?', options: ['Measuring rainfall', 'Monitoring soil moisture', 'Controlling irrigation timers', 'Applying fertilizer'], correctAnswer: 'Monitoring soil moisture' },
            { type: 'mcq', question: 'Which of the following is an automation tool for irrigation?', options: ['A watering can', 'A traditional plow', 'An IoT-based water management system', 'A visual indicator like wilting'], correctAnswer: 'An IoT-based water management system' },
            { type: 'mcq', question: 'What is the purpose of mulching in water conservation?', options: ['To increase sunlight on the soil', 'To reduce evaporation from the soil surface', 'To attract beneficial insects', 'To cool the plant leaves'], correctAnswer: 'To reduce evaporation from the soil surface' },
            { type: 'mcq', question: '"Deficit irrigation" is a strategy that involves:', options: ['Applying more water than the crop needs', 'Applying less water than the crop fully needs to save water', 'Watering only at night', 'Irrigating with saline water'], correctAnswer: 'Applying less water than the crop fully needs to save water' },
            { type: 'mcq', question: 'How does a farm pond contribute to water management?', options: ['It helps in rainwater harvesting and storage for later use', 'It is used for fish farming only', 'It drains excess water from the field', 'It purifies the groundwater'], correctAnswer: 'It helps in rainwater harvesting and storage for later use' },
            // MSQs
            { type: 'msq', question: 'Methods to determine when to irrigate include: (Select all that apply)', options: ['Soil moisture monitoring', 'Checking the calendar date', 'Observing crop growth stages', 'Evapotranspiration-based scheduling'], correctAnswer: ['Soil moisture monitoring', 'Observing crop growth stages', 'Evapotranspiration-based scheduling'] },
            { type: 'msq', question: 'Which of these are water conservation practices? (Select all that apply)', options: ['Mulching', 'Bunding', 'Zero tillage', 'Daily watering'], correctAnswer: ['Mulching', 'Bunding', 'Zero tillage'] },
            { type: 'msq', question: 'Automation in irrigation can be achieved using: (Select all that apply)', options: ['Soil moisture sensors', 'Drip irrigation controllers', 'Weather forecasts', 'A bucket'], correctAnswer: ['Soil moisture sensors', 'Drip irrigation controllers', 'Weather forecasts'] },
          ]
        },
        {
          id: 'a5m4',
          titleKey: 'agro_cert_5_mod_4',
          content: `This module focuses on managing excess water and maintaining water quality—two critical but often overlooked aspects of irrigation management. It begins with identifying the causes and symptoms of **waterlogging**, including poor drainage, heavy rains, clayey soils, and over-irrigation. Students learn techniques for **surface drainage (open ditches, field leveling, raised beds)** and subsurface drainage (tile drains, perforated pipes). The module covers the impact of waterlogging on root respiration, nutrient uptake, and disease occurrence. 
          
Learners also study water quality parameters such as **pH, EC, salinity, SAR (Sodium Adsorption Ratio), and RSC (Residual Sodium Carbonate)**, understanding how they affect soil structure and crop health. Solutions like gypsum application, organic matter addition, dilution, and blending of water sources are explained for managing saline or sodic water. The module includes examples from regions where irrigation water quality is a major challenge. By the end, participants can evaluate water quality, diagnose waterlogging problems, and apply corrective measures that protect both crops and soil.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is a common cause of waterlogging?', options: ['Under-irrigation', 'Sandy soils', 'Poor drainage', 'High temperatures'], correctAnswer: 'Poor drainage' },
            { type: 'mcq', question: 'Open ditches and raised beds are examples of what type of drainage?', options: ['Subsurface drainage', 'Surface drainage', 'Natural drainage', 'Automated drainage'], correctAnswer: 'Surface drainage' },
            { type: 'mcq', question: 'What does a high SAR (Sodium Adsorption Ratio) in water indicate?', options: ['The water is very pure', 'The water has high levels of sodium which can damage soil structure', 'The water is acidic', 'The water is good for all crops'], correctAnswer: 'The water has high levels of sodium which can damage soil structure' },
            { type: 'mcq', question: 'How does waterlogging negatively affect plants?', options: ['It improves nutrient uptake', 'It harms root respiration', 'It prevents all diseases', 'It makes the stems stronger'], correctAnswer: 'It harms root respiration' },
            { type: 'mcq', question: 'Which of these is a solution for managing high salinity in water or soil?', options: ['Applying more salty water', 'Gypsum application and organic matter addition', 'Compacting the soil', 'Avoiding drainage'], correctAnswer: 'Gypsum application and organic matter addition' },
            // MSQs
            { type: 'msq', question: 'What are the causes of waterlogging? (Select all that apply)', options: ['Heavy rains', 'Over-irrigation', 'Good drainage', 'Clayey soils'], correctAnswer: ['Heavy rains', 'Over-irrigation', 'Clayey soils'] },
            { type: 'msq', question: 'Water quality parameters that affect crop health include: (Select all that apply)', options: ['pH', 'EC (Electrical Conductivity)', 'SAR (Sodium Adsorption Ratio)', 'The color of the water'], correctAnswer: ['pH', 'EC (Electrical Conductivity)', 'SAR (Sodium Adsorption Ratio)'] },
            { type: 'msq', question: 'Techniques for drainage include: (Select all that apply)', options: ['Field leveling', 'Tile drains', 'Open ditches', 'Watering more often'], correctAnswer: ['Field leveling', 'Tile drains', 'Open ditches'] },
          ]
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'What is Crop Water Requirement (CWR)?', options: ['The amount of water a canal can hold', 'The total amount of water needed by a crop for optimal growth', 'A brand of irrigation pipe', 'A weather forecasting model'], correctAnswer: 'The total amount of water needed by a crop for optimal growth' },
        { type: 'mcq', question: 'Which irrigation system is most efficient in terms of water use?', options: ['Flood', 'Furrow', 'Drip', 'Basin'], correctAnswer: 'Drip' },
        { type: 'mcq', question: 'An IoT-based irrigation system uses what to make real-time decisions?', options: ['The calendar', 'The farmer\'s intuition', 'Data from soil moisture sensors and weather stations', 'The price of water'], correctAnswer: 'Data from soil moisture sensors and weather stations' },
        { type: 'mcq', question: 'What is a primary negative impact of soil waterlogging on crops?', options: ['It provides too much oxygen', 'It interferes with root respiration', 'It washes away all pests', 'It cools the soil too much'], correctAnswer: 'It interferes with root respiration' },
        { type: 'mcq', question: 'High EC (Electrical Conductivity) in irrigation water is an indicator of:', options: ['Purity', 'High Salinity', 'Low temperature', 'Acidity'], correctAnswer: 'High Salinity' },
        { type: 'mcq', question: 'What is the main purpose of mulching?', options: ['To reduce soil moisture evaporation', 'To attract pests to a central location', 'To make the field look neat', 'To increase soil temperature'], correctAnswer: 'To reduce soil moisture evaporation' },
        { type: 'mcq', question: 'Tile drains are a form of:', options: ['Surface irrigation', 'Surface drainage', 'Subsurface drainage', 'Rainwater harvesting'], correctAnswer: 'Subsurface drainage' },
        { type: 'mcq', question: 'What does "fertigation" mean?', options: ['A festival of harvesting', 'Applying fertilizers through the irrigation system', 'Removing excess water from the field', 'Testing the fertility of the soil'], correctAnswer: 'Applying fertilizers through the irrigation system' },
        // MSQs
        { type: 'msq', question: 'Which of the following are modern, water-efficient irrigation methods? (Select all that apply)', options: ['Drip irrigation', 'Flood irrigation', 'Sprinkler irrigation', 'Check-basin irrigation'], correctAnswer: ['Drip irrigation', 'Sprinkler irrigation'] },
        { type: 'msq', question: 'Water conservation techniques discussed in the course include: (Select all that apply)', options: ['Mulching', 'Contour cultivation', 'Rainwater harvesting', 'Daily flood irrigation'], correctAnswer: ['Mulching', 'Contour cultivation', 'Rainwater harvesting'] },
        { type: 'msq', question: 'Poor quality irrigation water can be characterized by: (Select all that apply)', options: ['High salinity (EC)', 'High Sodium Adsorption Ratio (SAR)', 'Optimal pH between 6.5 and 8.4', 'High levels of nutrients'], correctAnswer: ['High salinity (EC)', 'High Sodium Adsorption Ratio (SAR)'] },
        { type: 'msq', question: 'How can a farmer decide the right time to irrigate? (Select all that apply)', options: ['By using a tensiometer', 'By following a fixed weekly schedule regardless of weather', 'Based on the crop\'s growth stage', 'Through evapotranspiration-based scheduling'], correctAnswer: ['By using a tensiometer', 'Based on the crop\'s growth stage', 'Through evapotranspiration-based scheduling'] },
        { type: 'msq', question: 'Which factors should be considered when selecting an irrigation system? (Select all that apply)', options: ['Soil type', 'Field slope', 'Water availability', 'The farmer\'s favorite color'], correctAnswer: ['Soil type', 'Field slope', 'Water availability'] },
      ]
    },
    // Certification 6: Agri-Business Management
    {
      id: 'agro_cert_6',
      titleKey: 'agro_cert_6',
      modules: [
        {
          id: 'a6m1',
          titleKey: 'agro_cert_6_mod_1',
          content: `This module introduces learners to the business side of agriculture, highlighting how farming connects to upstream and downstream industries. It begins by explaining the meaning and scope of **agri-business**, covering sectors like input supply (seeds, fertilizers, machinery), production, processing, warehousing, logistics, marketing, and retail. 
          
Learners study the structure of **agricultural value chains** and how value is added at each stage—from the farm gate to the consumer’s plate. The module discusses supply-demand dynamics, price fluctuations, MSP, commodity markets, and the role of government policies in shaping agri-economics. Students explore cost of cultivation, break-even analysis, gross margins, and basic financial concepts relevant to farm enterprises. Real-world examples show how farmers, FPOs, cooperatives, and agri-tech start-ups build profitable business models by identifying market gaps. By the end, learners gain a foundational understanding of how agriculture functions as an economic system and how business skills can improve profitability at the farm and enterprise levels.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Agri-business includes which of the following sectors?', options: ['Only crop production', 'Only input supply', 'Input supply, production, processing, and marketing', 'Only retail'], correctAnswer: 'Input supply, production,processing, and marketing' },
            { type: 'mcq', question: 'What is an agricultural value chain?', options: ['A type of fence for farms', 'The process of adding value to a product from farm to consumer', 'A government policy', 'A method of irrigation'], correctAnswer: 'The process of adding value to a product from farm to consumer' },
            { type: 'mcq', question: 'What does "break-even analysis" determine?', options: ['The maximum profit a farm can make', 'The point at which costs and revenues are equal', 'The quality of the crop', 'The best time to plant'], correctAnswer: 'The point at which costs and revenues are equal' },
            { type: 'mcq', question: 'What is MSP in the context of agri-economics?', options: ['Maximum Sale Price', 'Minimum Support Price', 'Market Supply Potential', 'Major Seed Provider'], correctAnswer: 'Minimum Support Price' },
            { type: 'mcq', question: 'The "downstream" part of the agri-business industry includes:', options: ['Seed and fertilizer companies', 'Processing, warehousing, and retail', 'Farming and production only', 'Government agencies'], correctAnswer: 'Processing, warehousing, and retail' },
            // MSQs
            { type: 'msq', question: 'The agri-business sector covers which of the following? (Select all that apply)', options: ['Input supply', 'Production', 'Processing', 'Weather forecasting'], correctAnswer: ['Input supply', 'Production', 'Processing'] },
            { type: 'msq', question: 'Which financial concepts relevant to farms are mentioned? (Select all that apply)', options: ['Cost of cultivation', 'Break-even analysis', 'Stock market trading', 'Gross margins'], correctAnswer: ['Cost of cultivation', 'Break-even analysis', 'Gross margins'] },
            { type: 'msq', question: 'Which entities can build profitable business models in agriculture? (Select all that apply)', options: ['Farmers', 'FPOs', 'Agri-tech start-ups', 'Only large corporations'], correctAnswer: ['Farmers', 'FPOs', 'Agri-tech start-ups'] },
          ]
        },
        {
          id: 'a6m2',
          titleKey: 'agro_cert_6_mod_2',
          content: `This module focuses on marketing strategies and supply chain management—two essential pillars for successful agri-business operations. Learners begin by understanding agricultural markets, wholesale mandis, private procurement centers, FPO networks, and direct-to-consumer platforms. 
          
The module explains **branding techniques, packaging design, storytelling, and quality grading** to differentiate products in competitive markets. Students explore price discovery mechanisms, contract farming arrangements, and digital marketplaces. The supply chain component teaches how produce moves from farms to consumers through storage, transportation, warehousing, and **cold-chain logistics**. Post-harvest management topics include cleaning, grading, sorting, dehydration, packaging, cooling methods, and shelf-life extension. Special attention is given to reducing post-harvest losses, which account for 10–40% of crop waste in India. Learners discover how agribusiness companies build efficient supply chains using technology, partnerships, and real-time data. By the end, participants can design market strategies and supply chain plans that maximize profitability and reduce losses.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is a key technique to differentiate agricultural products in the market?', options: ['Selling at the lowest price', 'Branding and quality grading', 'Using minimal packaging', 'Selling only to wholesalers'], correctAnswer: 'Branding and quality grading' },
            { type: 'mcq', question: 'What is the purpose of cold-chain logistics?', options: ['To transport goods cheaply', 'To maintain a specific low temperature for perishable goods during transit', 'To speed up the ripening process', 'To dry the produce during transport'], correctAnswer: 'To maintain a specific low temperature for perishable goods during transit' },
            { type: 'mcq', question: 'What is a major focus of post-harvest management?', options: ['Increasing planting density', 'Reducing post-harvest losses', 'Selecting seed varieties', 'Analyzing soil'], correctAnswer: 'Reducing post-harvest losses' },
            { type: 'mcq', question: 'Which of these is a modern marketing platform for farmers?', options: ['Traditional village markets only', 'Digital marketplaces and direct-to-consumer platforms', 'Bartering with neighbors', 'Government storage only'], correctAnswer: 'Digital marketplaces and direct-to-consumer platforms' },
            { type: 'mcq', question: '"Contract farming" is an arrangement between:', options: ['Two farmers', 'A farmer and a buyer', 'A farmer and the government', 'A farmer and a seed company'], correctAnswer: 'A farmer and a buyer' },
            // MSQs
            { type: 'msq', question: 'Marketing strategies discussed in the module include: (Select all that apply)', options: ['Branding techniques', 'Packaging design', 'Quality grading', 'Using old sacks for all products'], correctAnswer: ['Branding techniques', 'Packaging design', 'Quality grading'] },
            { type: 'msq', question: 'The agricultural supply chain involves which of the following? (Select all that apply)', options: ['Storage', 'Transportation', 'Warehousing', 'Planting'], correctAnswer: ['Storage', 'Transportation', 'Warehousing'] },
            { type: 'msq', question: 'Post-harvest management activities include: (Select all that apply)', options: ['Cleaning', 'Grading', 'Sorting', 'Fertilizing'], correctAnswer: ['Cleaning', 'Grading', 'Sorting'] },
          ]
        },
        {
          id: 'a6m3',
          titleKey: 'agro_cert_6_mod_3',
          content: `This module provides practical training in managing finances for agri-businesses, farms, FPOs, and start-ups. Learners begin with budgeting, cost estimation, cash flow management, and profit–loss calculations. They study cost components—seed, labor, fertilizer, machinery, irrigation, and post-harvest expenses—and learn to prepare enterprise-level cost sheets. 
          
Investment analysis techniques such as **NPV, IRR, payback period, and benefit–cost ratio** are introduced in simple, agriculture-friendly terms. Learners explore how banks evaluate agri-projects and study relevant schemes (NABARD, PMFBY, Agri-Infra Fund). The module explains financial instruments like **crop loans, KCC, working capital, term loans, warehouse receipts, and insurance**. Students also learn how to prepare business plans, feasibility studies, and proposals for investors or funding agencies. Real-life examples from dairy farms, poultry units, vegetable clusters, and agri-processing units make concepts easy to understand. By the end, learners can assess the financial viability of agri-enterprises and make informed investment decisions.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is a "cash flow management" in a farm business?', options: ['Tracking water flow in irrigation', 'Tracking the movement of money in and out of the business', 'Managing the flow of workers', 'A type of crop loan'], correctAnswer: 'Tracking the movement of money in and out of the business' },
            { type: 'mcq', question: 'What does KCC stand for in financial instruments?', options: ['Kisan Credit Card', 'Key Cost Component', 'Crop Cash Control', 'Kilo Calorie Count'], correctAnswer: 'Kisan Credit Card' },
            { type: 'mcq', question: 'Which technique is used to analyze the profitability of a long-term investment?', options: ['Daily weather forecast', 'NPV (Net Present Value)', 'Soil testing', 'Crop rotation plan'], correctAnswer: 'NPV (Net Present Value)' },
            { type: 'mcq', question: 'What is the purpose of preparing a business plan?', options: ['It is a government requirement for all farmers', 'To get a discount on seeds', 'To present to investors or funding agencies', 'To track daily tasks'], correctAnswer: 'To present to investors or funding agencies' },
            { type: 'mcq', question: 'The Agri-Infra Fund is an example of a:', options: ['Private company', 'Type of fertilizer', 'Government scheme', 'Marketing platform'], correctAnswer: 'Government scheme' },
            // MSQs
            { type: 'msq', question: 'Cost components for a farm enterprise include: (Select all that apply)', options: ['Seed', 'Labor', 'The farmer\'s personal expenses', 'Fertilizer'], correctAnswer: ['Seed', 'Labor', 'Fertilizer'] },
            { type: 'msq', question: 'Which financial instruments are available to farmers? (Select all that apply)', options: ['Crop loans', 'Kisan Credit Card (KCC)', 'Warehouse receipts', 'A personal loan for a vacation'], correctAnswer: ['Crop loans', 'Kisan Credit Card (KCC)', 'Warehouse receipts'] },
            { type: 'msq', question: 'Investment analysis techniques mentioned in the module are: (Select all that apply)', options: ['NPV', 'IRR', 'Payback period', 'Guesswork'], correctAnswer: ['NPV', 'IRR', 'Payback period'] },
          ]
        },
        {
          id: 'a6m4',
          titleKey: 'agro_cert_6_mod_4',
          content: `This module focuses on building and managing modern agricultural enterprises through FPOs, start-ups, and digital innovations. Learners study how **Farmer Producer Organizations (FPOs)** are formed, governed, and managed, including shareholder structures, BOD functions, procurement planning, and collective marketing strategies. 
          
The module highlights the role of **agri-tech innovations** such as AI-based crop advisory, satellite mapping, precision farming, farm automation, digital payments, and supply-chain apps that transform traditional agriculture. Students explore entrepreneurship skills—idea validation, customer discovery, pricing, competition mapping, MVP development, and fundraising. Case studies showcase successful agri-startups in dairy-tech, food processing, fintech, logistics, organic retail, and climate-smart farming. The module also discusses challenges such as farmer adoption, capital constraints, operational bottlenecks, and policy compliance. By the end, learners gain the confidence to manage FPO operations, adopt technology solutions, and build sustainable agricultural enterprises with strong market linkages.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is an FPO?', options: ['A type of fertilizer', 'A government agency', 'A Farmer Producer Organization', 'A farming technique'], correctAnswer: 'A Farmer Producer Organization' },
            { type: 'mcq', question: 'Which of the following is an example of an agri-tech innovation?', options: ['A traditional plow', 'AI-based crop advisory', 'A hand sickle', 'Manual record keeping'], correctAnswer: 'AI-based crop advisory' },
            { type: 'mcq', question: 'What does "collective marketing" for an FPO mean?', options: ['Every farmer sells their produce individually', 'The FPO pools produce from members to sell in larger quantities', 'Marketing only to family members', 'Selling produce before it is harvested'], correctAnswer: 'The FPO pools produce from members to sell in larger quantities' },
            { type: 'mcq', question: 'What is "MVP development" in the context of entrepreneurship?', options: ['Most Valuable Player', 'Minimum Viable Product', 'Major Venture Proposal', 'Maximum Viable Profit'], correctAnswer: 'Minimum Viable Product' },
            { type: 'mcq', question: 'Which of these is a challenge for agri-tech adoption?', options: ['Too much funding', 'High farmer adoption rates', 'Capital constraints and operational bottlenecks', 'Lack of technology'], correctAnswer: 'Capital constraints and operational bottlenecks' },
            // MSQs
            { type: 'msq', question: 'FPO management includes which activities? (Select all that apply)', options: ['Procurement planning', 'Governance and BOD functions', 'Collective marketing', 'Individual sales only'], correctAnswer: ['Procurement planning', 'Governance and BOD functions', 'Collective marketing'] },
            { type: 'msq', question: 'Agri-tech innovations mentioned in the module include: (Select all that apply)', options: ['Satellite mapping', 'Digital payments', 'Supply-chain apps', 'Using bullock carts'], correctAnswer: ['Satellite mapping', 'Digital payments', 'Supply-chain apps'] },
            { type: 'msq', question: 'Entrepreneurship skills for an agri-startup involve: (Select all that apply)', options: ['Idea validation', 'Fundraising', 'Competition mapping', 'Avoiding technology'], correctAnswer: ['Idea validation', 'Fundraising', 'Competition mapping'] },
          ]
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'The agricultural value chain describes the process from:', options: ['Seed to harvest only', 'Farm gate to consumer', 'Wholesaler to retailer', 'Input supply to retail'], correctAnswer: 'Input supply to retail' },
        { type: 'mcq', question: 'What is the main purpose of branding for agricultural products?', options: ['To make the package heavier', 'To differentiate the product and potentially get a better price', 'It is a legal requirement for all products', 'To use more ink'], correctAnswer: 'To differentiate the product and potentially get a better price' },
        { type: 'mcq', question: 'A Kisan Credit Card (KCC) is a:', options: ['Marketing tool', 'Financial instrument for farmers', 'Type of farm machinery', 'Government policy on crop prices'], correctAnswer: 'Financial instrument for farmers' },
        { type: 'mcq', question: 'The primary advantage of an FPO for a small farmer is:', options: ['Increased competition with neighbors', 'The ability to market produce collectively for better bargaining power', 'Access to government jobs', 'Guaranteed profits'], correctAnswer: 'The ability to market produce collectively for better bargaining power' },
        { type: 'mcq', question: 'Cold-chain logistics are most critical for which type of products?', options: ['Grains like wheat and rice', 'Perishable products like fruits and vegetables', 'Cotton and jute', 'Processed foods in cans'], correctAnswer: 'Perishable products like fruits and vegetables' },
        { type: 'mcq', question: 'What does "break-even analysis" help a farm manager understand?', options: ['The weather forecast', 'The point where total costs equal total revenue', 'The soil nutrient level', 'The best crop to plant'], correctAnswer: 'The point where total costs equal total revenue' },
        { type: 'mcq', question: 'An example of an agri-tech innovation is:', options: ['Using a traditional sickle', 'A mobile app for supply chain management', 'A scarecrow', 'Keeping records in a paper notebook'], correctAnswer: 'A mobile app for supply chain management' },
        { type: 'mcq', question: 'What is a major cause of post-harvest losses in India?', options: ['Farmers selling too quickly', 'Lack of proper storage and supply chain infrastructure', 'Crops being too healthy', 'Too much demand from consumers'], correctAnswer: 'Lack of proper storage and supply chain infrastructure' },
        // MSQs
        { type: 'msq', question: 'Which are key components of financial management for an agri-enterprise? (Select all that apply)', options: ['Budgeting', 'Cash flow management', 'Profit-loss calculations', 'Guessing expenses'], correctAnswer: ['Budgeting', 'Cash flow management', 'Profit-loss calculations'] },
        { type: 'msq', question: 'An agri-business plan should include which of the following? (Select all that apply)', options: ['Feasibility study', 'Costing and financial projections', 'Marketing strategy', 'The farmer\'s favorite movie'], correctAnswer: ['Feasibility study', 'Costing and financial projections', 'Marketing strategy'] },
        { type: 'msq', question: 'The agricultural supply chain includes which stages? (Select all that apply)', options: ['Storage', 'Transportation', 'Processing', 'Planting'], correctAnswer: ['Storage', 'Transportation', 'Processing'] },
        { type: 'msq', question: 'What are the functions of a Farmer Producer Organization (FPO)? (Select all that apply)', options: ['Collective procurement of inputs', 'Collective marketing of produce', 'Providing technical services to members', 'Competing with its own members'], correctAnswer: ['Collective procurement of inputs', 'Collective marketing of produce', 'Providing technical services to members'] },
        { type: 'msq', question: 'Agri-tech innovations can be applied in which areas of farming? (Select all that apply)', options: ['Crop advisory', 'Farm automation', 'Supply chain logistics', 'Weather prediction'], correctAnswer: ['Crop advisory', 'Farm automation', 'Supply chain logistics'] },
      ]
    },
    // Certification 7: Post-Harvest & Supply Chain Management
    {
      id: 'agro_cert_7',
      titleKey: 'agro_cert_7',
      modules: [
        {
          id: 'a7m1',
          titleKey: 'agro_cert_7_mod_1',
          content: `This module introduces learners to the physiological changes that occur in crops after harvest, which significantly influence quality, shelf life, and market value. Students begin with an understanding of **respiration rate, ethylene production, moisture loss, and microbial activity**—key factors responsible for spoilage. 
          
The module covers maturity indices and harvesting techniques for cereals, pulses, fruits, vegetables, and oilseeds to ensure minimal damage and optimal quality. Learners study **pre-cooling methods** that remove field heat, helping extend shelf life, especially for perishables. Handling procedures such as sorting, trimming, washing, and sanitization are explained with a focus on hygiene and food safety standards. Real-world case studies highlight how minor improvements in harvesting and handling can drastically reduce post-harvest losses, which account for 15–35% wastage in India. By the end, learners understand how physiological processes influence product quality and how proper handling at the initial stages enhances marketability.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Which factor is a key cause of spoilage in harvested crops?', options: ['Sunlight', 'Low humidity', 'Respiration rate and microbial activity', 'Cold temperatures'], correctAnswer: 'Respiration rate and microbial activity' },
            { type: 'mcq', question: 'What is the purpose of pre-cooling?', options: ['To cook the produce', 'To remove field heat and extend shelf life', 'To make the produce ripen faster', 'To wash the produce'], correctAnswer: 'To remove field heat and extend shelf life' },
            { type: 'mcq', question: 'What are "maturity indices"?', options: ['Standards to determine the right time to harvest', 'The weight of the harvested crop', 'The price of the crop', 'A type of storage facility'], correctAnswer: 'Standards to determine the right time to harvest' },
            { type: 'mcq', question: 'Which gas is known as the "ripening hormone" in fruits?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Ethylene'], correctAnswer: 'Ethylene' },
            { type: 'mcq', question: 'Proper handling procedures like sorting and trimming help to:', options: ['Increase spoilage', 'Improve hygiene and marketability', 'Reduce the weight of the produce', 'Make the produce less nutritious'], correctAnswer: 'Improve hygiene and marketability' },
            // MSQs
            { type: 'msq', question: 'Key physiological factors causing spoilage after harvest include: (Select all that apply)', options: ['Respiration rate', 'Moisture loss', 'Photosynthesis', 'Microbial activity'], correctAnswer: ['Respiration rate', 'Moisture loss', 'Microbial activity'] },
            { type: 'msq', question: 'Post-harvest handling procedures mentioned in the module are: (Select all that apply)', options: ['Sorting', 'Washing', 'Fertilizing', 'Sanitization'], correctAnswer: ['Sorting', 'Washing', 'Sanitization'] },
            { type: 'msq', question: 'Proper post-harvest management at the initial stages can lead to: (Select all that apply)', options: ['Reduced post-harvest losses', 'Extended shelf life', 'Enhanced marketability', 'Increased ethylene production'], correctAnswer: ['Reduced post-harvest losses', 'Extended shelf life', 'Enhanced marketability'] },
          ]
        },
        {
          id: 'a7m2',
          titleKey: 'agro_cert_7_mod_2',
          content: `This module trains learners in the storage and preservation methods needed to maintain quality and prevent losses after harvest. It covers traditional storage structures—metal bins, gunny bags, underground pits—and modern facilities like **scientific warehouses, silos, and cold rooms**. 
          
Students learn the principles of temperature, humidity, ventilation, and sanitation and how these factors affect shelf life. **Cold chain systems** are explained in detail, including pre-cooling units, cold storage, reefer trucks, and ripening chambers. The module also introduces **Controlled Atmosphere Storage (CAS)** and Modified Atmosphere Packaging (MAP), describing how oxygen, carbon dioxide, and nitrogen levels can be manipulated to slow down ripening and decay. Learners understand how CA storage is especially useful for apples, pears, grapes, and high-value vegetables. Pest control, fumigation, hermetic storage, and integrated warehouse management practices are also discussed. By the end, students can evaluate storage options based on cost, crop type, volume, and market requirements to minimize losses and maintain consistent supply.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is a major principle of good storage?', options: ['High temperature and high humidity', 'Control of temperature, humidity, and ventilation', 'Keeping all produce in the open air', 'Using only traditional pits'], correctAnswer: 'Control of temperature, humidity, and ventilation' },
            { type: 'mcq', question: 'What is Controlled Atmosphere Storage (CAS)?', options: ['Storing produce in a very large room', 'A storage where gas levels like oxygen and CO2 are controlled', 'Storing produce outside', 'A type of packaging'], correctAnswer: 'A storage where gas levels like oxygen and CO2 are controlled' },
            { type: 'mcq', question: 'A "reefer truck" is a key component of:', options: ['Planting', 'Harvesting', 'The cold chain', 'Irrigation'], correctAnswer: 'The cold chain' },
            { type: 'mcq', question: 'For which products is Controlled Atmosphere Storage (CAS) particularly useful?', options: ['Grains like wheat and rice', 'Fruits like apples and pears', 'Sugarcane', 'Cotton'], correctAnswer: 'Fruits like apples and pears' },
            { type: 'mcq', question: 'What is a silo typically used for?', options: ['Storing fresh vegetables', 'Long-term storage of large quantities of grain', 'Ripening bananas', 'Pre-cooling fruits'], correctAnswer: 'Long-term storage of large quantities of grain' },
            // MSQs
            { type: 'msq', question: 'Modern storage facilities include: (Select all that apply)', options: ['Scientific warehouses', 'Silos', 'Open fields', 'Cold rooms'], correctAnswer: ['Scientific warehouses', 'Silos', 'Cold rooms'] },
            { type: 'msq', question: 'The cold chain system consists of which components? (Select all that apply)', options: ['Pre-cooling units', 'Cold storage', 'Reefer trucks', 'Heated warehouses'], correctAnswer: ['Pre-cooling units', 'Cold storage', 'Reefer trucks'] },
            { type: 'msq', question: 'Which factors are controlled in a good storage environment? (Select all that apply)', options: ['Temperature', 'Humidity', 'Sanitation', 'Sunlight exposure'], correctAnswer: ['Temperature', 'Humidity', 'Sanitation'] },
          ]
        },
        {
          id: 'a7m3',
          titleKey: 'agro_cert_7_mod_3',
          content: `This module highlights the importance of value addition through proper grading, packaging, and transportation. Learners study the grading standards used in India, including **AGMARK, FSSAI guidelines, APEDA export specifications**, and international grades for fruits, spices, and fresh produce. 
          
The module explains how grading improves uniformity, customer satisfaction, and pricing. **Packaging materials** such as corrugated boxes, mesh bags, crates, cling films, MAP bags, and biodegradable options are reviewed along with their advantages and suitability for different commodities. Students learn how to design packaging that protects produce from mechanical damage, moisture loss, and contamination. Transportation systems—road, rail, reefer trucks, container shipments—are explained with emphasis on maintaining the cold chain for perishables. The module also covers quality assurance practices, sampling, and documentation during transit. Case studies show how proper packaging and transport reduce losses by 20–40% in fruits and vegetables. By the end, learners understand how to maintain quality standards along the supply chain and deliver products safely to end markets.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is AGMARK?', options: ['A type of crop', 'A grading standard used in India', 'A packaging material', 'A transport company'], correctAnswer: 'A grading standard used in India' },
            { type: 'mcq', question: 'What is the primary purpose of grading produce?', options: ['To make it weigh more', 'To improve uniformity and pricing', 'To speed up spoilage', 'To mix different qualities together'], correctAnswer: 'To improve uniformity and pricing' },
            { type: 'mcq', question: 'Which packaging material is mentioned as a modern option for extending shelf life?', options: ['Gunny bags', 'Wooden crates', 'MAP (Modified Atmosphere Packaging) bags', 'Newspapers'], correctAnswer: 'MAP (Modified Atmosphere Packaging) bags' },
            { type: 'mcq', question: 'Maintaining the cold chain is most important for which type of produce?', options: ['Grains', 'Pulses', 'Perishables like fruits', 'Oilseeds'], correctAnswer: 'Perishables like fruits' },
            { type: 'mcq', question: 'According to the module, proper packaging and transport can reduce losses by how much?', options: ['0-5%', '5-10%', '10-15%', '20-40%'], correctAnswer: '20-40%' },
            // MSQs
            { type: 'msq', question: 'Grading standards mentioned in the module include: (Select all that apply)', options: ['AGMARK', 'FSSAI', 'APEDA', 'ISO 9001'], correctAnswer: ['AGMARK', 'FSSAI', 'APEDA'] },
            { type: 'msq', question: 'Good packaging should protect produce from what? (Select all that apply)', options: ['Mechanical damage', 'Moisture loss', 'Contamination', 'Sunlight for ripening'], correctAnswer: ['Mechanical damage', 'Moisture loss', 'Contamination'] },
            { type: 'msq', question: 'Transportation systems for agricultural produce include: (Select all that apply)', options: ['Road', 'Rail', 'Reefer trucks', 'Personal cars'], correctAnswer: ['Road', 'Rail', 'Reefer trucks'] },
          ]
        },
        {
          id: 'a7m4',
          titleKey: 'agro_cert_7_mod_4',
          content: `This final module explains how agricultural products move from farms to markets through efficient supply chains. Learners explore the structure of domestic agricultural supply chains—**mandis, APMC markets, private markets, processors, wholesalers, retailers, and e-commerce platforms**. 
          
The module discusses real-time logistics planning, route optimization, load management, and inventory control. Students study how to create **forward and backward linkages** that connect farmers to buyers, processors, retailers, and exporters. Marketing options such as contract farming, FPO aggregation, direct-to-consumer delivery, and institutional selling are described with practical examples. **Export management** introduces APEDA standards, documentation, residue regulations, packaging norms, international certifications, and logistics for exporting produce like spices, mangoes, grapes, and basmati rice. The module also highlights risk management tools—insurance, hedging, futures trading, and cold-chain integration. By the end, learners can design efficient supply chain models that minimize delays, reduce losses, and connect agricultural products to high-value markets.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is an APMC market?', options: ['A type of online store', 'A regulated wholesale market for agricultural produce', 'A farmer cooperative', 'A private retail chain'], correctAnswer: 'A regulated wholesale market for agricultural produce' },
            { type: 'mcq', question: 'What does creating "backward linkages" mean in a supply chain?', options: ['Connecting retailers back to wholesalers', 'Connecting processors or retailers directly back to farmers', 'Selling produce in reverse order', 'Exporting produce'], correctAnswer: 'Connecting processors or retailers directly back to farmers' },
            { type: 'mcq', question: 'Which organization\'s standards are important for exporting agricultural produce from India?', options: ['FSSAI', 'AGMARK', 'APEDA', 'Local Panchayat'], correctAnswer: 'APEDA' },
            { type: 'mcq', question: 'Contract farming is a marketing option that involves an agreement between:', options: ['A farmer and a buyer', 'Two farmers', 'A wholesaler and a retailer', 'An exporter and the government'], correctAnswer: 'A farmer and a buyer' },
            { type: 'mcq', question: 'Hedging and futures trading are examples of:', options: ['Planting techniques', 'Risk management tools', 'Packaging materials', 'Storage methods'], correctAnswer: 'Risk management tools' },
            // MSQs
            { type: 'msq', question: 'Domestic agricultural supply chains in India include: (Select all that apply)', options: ['Mandis / APMC markets', 'Processors', 'Retailers', 'The stock exchange'], correctAnswer: ['Mandis / APMC markets', 'Processors', 'Retailers'] },
            { type: 'msq', question: 'Marketing options for farmers include: (Select all that apply)', options: ['Contract farming', 'FPO aggregation', 'Direct-to-consumer delivery', 'Waiting for prices to fall'], correctAnswer: ['Contract farming', 'FPO aggregation', 'Direct-to-consumer delivery'] },
            { type: 'msq', question: 'Export management involves understanding which of the following? (Select all that apply)', options: ['International certifications', 'Residue regulations', 'Packaging norms for export', 'Local weather conditions'], correctAnswer: ['International certifications', 'Residue regulations', 'Packaging norms for export'] },
          ]
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'The removal of field heat from freshly harvested produce is called:', options: ['Grading', 'Sorting', 'Pre-cooling', 'Curing'], correctAnswer: 'Pre-cooling' },
        { type: 'mcq', question: 'A cold chain is a supply chain that is:', options: ['The shortest possible route', 'Temperature-controlled', 'Only for non-perishable goods', 'Operated only in winter'], correctAnswer: 'Temperature-controlled' },
        { type: 'mcq', question: 'AGMARK is a standard for:', options: ['Export quality', 'Packaging material', 'Grading of agricultural produce in India', 'Transportation vehicles'], correctAnswer: 'Grading of agricultural produce in India' },
        { type: 'mcq', question: 'Controlled Atmosphere Storage (CAS) works by manipulating the levels of:', options: ['Light and humidity', 'Oxygen, carbon dioxide, and nitrogen', 'Only temperature', 'Only humidity'], correctAnswer: 'Oxygen, carbon dioxide, and nitrogen' },
        { type: 'mcq', question: 'A "reefer truck" is a:', options: ['Truck for carrying grains', 'Refrigerated truck for transporting perishables', 'Truck that sells produce directly', 'A type of harvesting machine'], correctAnswer: 'Refrigerated truck for transporting perishables' },
        { type: 'mcq', question: 'The primary purpose of packaging is to:', options: ['Make the product look bigger', 'Protect the produce from damage and contamination', 'Add weight to the product', 'Speed up the ripening process'], correctAnswer: 'Protect the produce from damage and contamination' },
        { type: 'mcq', question: 'An APMC mandi is a type of:', options: ['Retail store', 'Wholesale market', 'Processing factory', 'Export house'], correctAnswer: 'Wholesale market' },
        { type: 'mcq', question: 'Which physiological process is a major cause of spoilage in harvested produce?', options: ['Photosynthesis', 'Respiration', 'Germination', 'Pollination'], correctAnswer: 'Respiration' },
        // MSQs
        { type: 'msq', question: 'What are the key components of a cold chain? (Select all that apply)', options: ['Cold storage', 'Reefer trucks', 'Pre-cooling units', 'Open-air markets'], correctAnswer: ['Cold storage', 'Reefer trucks', 'Pre-cooling units'] },
        { type: 'msq', question: 'Effective post-harvest management helps to: (Select all that apply)', options: ['Reduce wastage', 'Extend shelf life', 'Maintain quality', 'Increase spoilage'], correctAnswer: ['Reduce wastage', 'Extend shelf life', 'Maintain quality'] },
        { type: 'msq', question: 'What does export management for agricultural products involve? (Select all that apply)', options: ['Following APEDA standards', 'Meeting international packaging norms', 'Managing residue regulations', 'Selling only in local markets'], correctAnswer: ['Following APEDA standards', 'Meeting international packaging norms', 'Managing residue regulations'] },
        { type: 'msq', question: 'Which of the following are modern storage technologies? (Select all that apply)', options: ['Controlled Atmosphere Storage (CAS)', 'Modified Atmosphere Packaging (MAP)', 'Underground pits', 'Scientific warehouses'], correctAnswer: ['Controlled Atmosphere Storage (CAS)', 'Modified Atmosphere Packaging (MAP)', 'Scientific warehouses'] },
        { type: 'msq', question: 'The agricultural supply chain connects which entities? (Select all that apply)', options: ['Farmers', 'Processors', 'Retailers', 'Consumers'], correctAnswer: ['Farmers', 'Processors', 'Retailers', 'Consumers'] },
      ]
    }
  ],
  veterinarian: [
    // Certification 1: Veterinary Public Health (VPH)
    {
      id: 'vet_cert_1',
      titleKey: 'vet_cert_1',
      modules: [
        {
          id: 'v1m1',
          titleKey: 'vet_cert_1_mod_1',
          content: `This module introduces learners to the scope and importance of Veterinary Public Health (VPH), emphasizing the interconnectedness of human health, animal health, and the environment through the **One Health framework**. It begins by explaining how veterinarians play a key role in safeguarding public health by preventing diseases transmitted through animals, food, and the environment. 
          
Students study the history of VPH, global health initiatives, and how **WHO, FAO, and OIE** collaborate on disease control. The module covers zoonotic disease emergence, antimicrobial resistance, environmental contamination, food hygiene, and public awareness responsibilities. Real-world examples—from rabies control programs to handling livestock during outbreaks—illustrate how veterinarians protect communities. The module helps learners understand how VPH integrates epidemiology, food safety, sanitation, policy, and community health. By the end, students recognize the broad scope of VPH and develop a strong foundation for advanced topics such as disease surveillance, outbreak investigation, and food safety standards.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is the core idea of the "One Health" framework?', options: ['Focusing only on animal health', 'The interconnectedness of human, animal, and environmental health', 'The health of a single animal', 'A new type of veterinary hospital'], correctAnswer: 'The interconnectedness of human, animal, and environmental health' },
            { type: 'mcq', question: 'Which organization is NOT mentioned as collaborating on global disease control?', options: ['WHO', 'FAO', 'OIE', 'NASA'], correctAnswer: 'NASA' },
            { type: 'mcq', question: 'What is a zoonotic disease?', options: ['A disease only found in zoos', 'A disease that can be transmitted from animals to humans', 'A disease affecting only plants', 'A very rare disease'], correctAnswer: 'A disease that can be transmitted from animals to humans' },
            { type: 'mcq', question: 'Veterinary Public Health (VPH) integrates which of the following fields?', options: ['Only surgery', 'Only animal breeding', 'Epidemiology, food safety, and community health', 'Astrology and astronomy'], correctAnswer: 'Epidemiology, food safety, and community health' },
            { type: 'mcq', question: 'A real-world example of VPH in action is:', options: ['Dog grooming', 'Rabies control programs', 'Horse racing', 'Cattle breeding'], correctAnswer: 'Rabies control programs' },
            // MSQs
            { type: 'msq', question: 'VPH covers which of the following important topics? (Select all that apply)', options: ['Zoonotic disease emergence', 'Antimicrobial resistance', 'The best pet names', 'Food hygiene'], correctAnswer: ['Zoonotic disease emergence', 'Antimicrobial resistance', 'Food hygiene'] },
            { type: 'msq', question: 'According to the One Health concept, which three areas are interconnected? (Select all that apply)', options: ['Human health', 'Animal health', 'Environmental health', 'Financial health'], correctAnswer: ['Human health', 'Animal health', 'Environmental health'] },
            { type: 'msq', question: 'How do veterinarians safeguard public health? (Select all that apply)', options: ['By preventing diseases transmitted by animals', 'By ensuring food safety', 'By raising public awareness', 'By selling pet food'], correctAnswer: ['By preventing diseases transmitted by animals', 'By ensuring food safety', 'By raising public awareness'] },
          ]
        },
        {
          id: 'v1m2',
          titleKey: 'vet_cert_1_mod_2',
          content: `This module focuses on major zoonotic diseases and epidemiological methods used by veterinarians to detect, track, and control them. Learners explore bacterial, viral, parasitic, and fungal zoonoses including **brucellosis, leptospirosis, rabies, avian influenza, tuberculosis, and anthrax**. 
          
The module explains disease transmission routes—**direct contact, foodborne, vector-borne, and environmental**—and their risk factors in both rural and urban settings. Students are introduced to epidemiological principles such as incidence, prevalence, surveillance systems, sampling strategies, and data interpretation. Special emphasis is placed on **outbreak investigation techniques**: identifying index cases, mapping disease spread, interviewing affected communities, collecting specimens, and coordinating with public health authorities. Learners examine how veterinarians collaborate with hospitals, laboratories, and government agencies during outbreaks. Case studies highlight real-world events where rapid veterinary intervention prevented community-level crises. By the end, learners gain practical knowledge of disease detection, reporting systems, and rapid response protocols.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Which of the following is a viral zoonotic disease mentioned?', options: ['Brucellosis', 'Leptospirosis', 'Rabies', 'Anthrax'], correctAnswer: 'Rabies' },
            { type: 'mcq', question: 'How is a vector-borne disease transmitted?', options: ['Through contaminated food', 'Through direct contact with an infected animal', 'Through an insect like a tick or mosquito', 'Through the air'], correctAnswer: 'Through an insect like a tick or mosquito' },
            { type: 'mcq', question: 'What is the "index case" in an outbreak investigation?', options: ['The most severe case', 'The last case to be identified', 'The first case to be identified in the outbreak', 'The case with the least symptoms'], correctAnswer: 'The first case to be identified in the outbreak' },
            { type: 'mcq', question: 'What does "surveillance" in epidemiology mean?', options: ['Watching over a single sick animal', 'The ongoing, systematic collection and analysis of health data', 'A type of vaccine', 'The final report of an outbreak'], correctAnswer: 'The ongoing, systematic collection and analysis of health data' },
            { type: 'mcq', question: 'Brucellosis and tuberculosis are examples of what type of zoonoses?', options: ['Viral', 'Bacterial', 'Fungal', 'Parasitic'], correctAnswer: 'Bacterial' },
            // MSQs
            { type: 'msq', question: 'Which of these are zoonotic diseases covered in the module? (Select all that apply)', options: ['Rabies', 'Avian Influenza', 'The common cold', 'Brucellosis'], correctAnswer: ['Rabies', 'Avian Influenza', 'Brucellosis'] },
            { type: 'msq', question: 'Disease transmission routes include: (Select all that apply)', options: ['Direct contact', 'Foodborne', 'Vector-borne', 'Telepathic'], correctAnswer: ['Direct contact', 'Foodborne', 'Vector-borne'] },
            { type: 'msq', question: 'Outbreak investigation involves which of the following steps? (Select all that apply)', options: ['Mapping the disease spread', 'Collecting specimens', 'Coordinating with public health authorities', 'Ignoring the problem'], correctAnswer: ['Mapping the disease spread', 'Collecting specimens', 'Coordinating with public health authorities'] },
          ]
        },
        {
          id: 'v1m3',
          titleKey: 'vet_cert_1_mod_3',
          content: `This module teaches learners how veterinarians ensure safe food production from farm to fork. It begins with the principles of food safety, focusing on hazards like pathogens, toxins, chemical residues, and adulteration. Students study **meat hygiene practices**, including **ante-mortem and post-mortem inspection**, carcass grading, hygienic slaughter protocols, and identification of abnormalities. 
          
The module explains milk hygiene, pasteurization, quality testing, and prevention of contamination during collection and transport. Learners explore national and international regulatory guidelines—**FSSAI standards, Codex Alimentarius, HACCP systems, ISO 22000**, and export inspection protocols. Emphasis is placed on identifying critical control points in slaughterhouses, dairy plants, and food processing units. The module also covers waste disposal, sanitation, personal hygiene, and maintaining public confidence in animal-origin foods. By the end, learners understand how veterinarians protect consumers by ensuring food safety and regulatory compliance.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is "ante-mortem" inspection?', options: ['Inspection of the meat after slaughter', 'Inspection of the live animal before slaughter', 'Inspection of the slaughterhouse', 'Inspection of the final food product'], correctAnswer: 'Inspection of the live animal before slaughter' },
            { type: 'mcq', question: 'What is HACCP?', options: ['A type of animal disease', 'A system for managing food safety hazards', 'A brand of milk', 'A government agency'], correctAnswer: 'A system for managing food safety hazards' },
            { type: 'mcq', question: 'Which regulatory body sets food standards in India?', options: ['WHO', 'FDA', 'FSSAI', 'OIE'], correctAnswer: 'FSSAI' },
            { type: 'mcq', question: 'Pasteurization is a process used to improve the safety of:', options: ['Meat', 'Eggs', 'Milk', 'Vegetables'], correctAnswer: 'Milk' },
            { type: 'mcq', question: 'What is a "critical control point" in a food safety system?', options: ['The point where the food is sold', 'A step where control can be applied to prevent a food safety hazard', 'The entrance to the food processing plant', 'The final cooking temperature'], correctAnswer: 'A step where control can be applied to prevent a food safety hazard' },
            // MSQs
            { type: 'msq', question: 'Food safety hazards include which of the following? (Select all that apply)', options: ['Pathogens', 'Toxins', 'Good flavor', 'Chemical residues'], correctAnswer: ['Pathogens', 'Toxins', 'Chemical residues'] },
            { type: 'msq', question: 'Meat hygiene practices involve: (Select all that apply)', options: ['Ante-mortem inspection', 'Post-mortem inspection', 'Hygienic slaughter protocols', 'Selling meat without inspection'], correctAnswer: ['Ante-mortem inspection', 'Post-mortem inspection', 'Hygienic slaughter protocols'] },
            { type: 'msq', question: 'Which are regulatory guidelines or systems for food safety? (Select all that apply)', options: ['HACCP', 'ISO 22000', 'Codex Alimentarius', 'A recipe book'], correctAnswer: ['HACCP', 'ISO 22000', 'Codex Alimentarius'] },
          ]
        },
        {
          id: 'v1m4',
          titleKey: 'vet_cert_1_mod_4',
          content: `This module highlights the policy and community engagement responsibilities of veterinarians working in public health. It covers the design and implementation of **biosecurity measures** in farms, markets, and animal facilities to prevent disease introduction and spread. 
          
Students learn how to evaluate risks, develop biosecurity plans, and enforce protocols related to **quarantine, sanitation, vector control, and vaccination**. The module explains national disease control programs, government policies, livestock health schemes, and emergency preparedness strategies. Learners also study communication techniques for educating farmers, pet owners, and communities about disease prevention, hygiene, antimicrobial resistance, and responsible animal handling. Case studies demonstrate how effective awareness campaigns reduce disease incidence. The module concludes by emphasizing the leadership role veterinarians play in shaping public health policies, improving community safety, and building resilient health systems. By the end, learners are prepared to actively participate in policy implementation and community-level health programs.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is the main purpose of biosecurity measures?', options: ['To increase animal production', 'To make the farm look cleaner', 'To prevent the introduction and spread of disease', 'To get government subsidies'], correctAnswer: 'To prevent the introduction and spread of disease' },
            { type: 'mcq', question: 'Quarantine, in the context of animal health, means:', options: ['Treating sick animals', 'Isolating new or sick animals to prevent disease spread', 'A type of vaccination', 'Cleaning the farm'], correctAnswer: 'Isolating new or sick animals to prevent disease spread' },
            { type: 'mcq', question: 'Which of the following is a key part of a biosecurity plan?', options: ['Allowing visitors to walk anywhere', 'Sharing equipment between farms without cleaning', 'Controlled access and sanitation protocols', 'Using water from any source'], correctAnswer: 'Controlled access and sanitation protocols' },
            { type: 'mcq', question: 'Why is community education important for VPH?', options: ['It is not important', 'To blame the community for outbreaks', 'To reduce disease incidence through awareness and good practices', 'To sell more veterinary products'], correctAnswer: 'To reduce disease incidence through awareness and good practices' },
            { type: 'mcq', question: 'A veterinarian\'s role in public policy can include:', options: ['Ignoring all government rules', 'Helping to shape public health policies', 'Only treating individual animals', 'Working in isolation from other health professionals'], correctAnswer: 'Helping to shape public health policies' },
            // MSQs
            { type: 'msq', question: 'Biosecurity protocols can include which of the following? (Select all that apply)', options: ['Quarantine', 'Sanitation', 'Vector control', 'Allowing stray animals to roam freely'], correctAnswer: ['Quarantine', 'Sanitation', 'Vector control'] },
            { type: 'msq', question: 'Community education by veterinarians should cover topics like: (Select all that apply)', options: ['Disease prevention', 'Hygiene', 'Antimicrobial resistance', 'The latest movies'], correctAnswer: ['Disease prevention', 'Hygiene', 'Antimicrobial resistance'] },
            { type: 'msq', question: 'What are the responsibilities of a public health veterinarian? (Select all that apply)', options: ['Implementing biosecurity', 'Educating the community', 'Participating in policy implementation', 'Only working with pets'], correctAnswer: ['Implementing biosecurity', 'Educating the community', 'Participating in policy implementation'] },
          ]
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'The One Health framework recognizes the link between human health, animal health, and:', options: ['Economic health', 'Political health', 'Environmental health', 'Mental health'], correctAnswer: 'Environmental health' },
        { type: 'mcq', question: 'Rabies is an example of a disease that can be transmitted from animals to humans, which is known as a:', options: ['Zoonotic disease', 'Chronic disease', 'Genetic disorder', 'Bacterial infection'], correctAnswer: 'Zoonotic disease' },
        { type: 'mcq', question: 'The inspection of a live animal before it is slaughtered is called:', options: ['Post-mortem inspection', 'Ante-mortem inspection', 'Final inspection', 'Carcass grading'], correctAnswer: 'Ante-mortem inspection' },
        { type: 'mcq', question: 'A key strategy to prevent the introduction and spread of diseases on a farm is called:', options: ['High-density stocking', 'Biosecurity', 'Antibiotic overuse', 'Minimal cleaning'], correctAnswer: 'Biosecurity' },
        { type: 'mcq', question: 'What is the primary goal of an outbreak investigation?', options: ['To punish the owner of the first sick animal', 'To identify the cause, track the spread, and control the disease', 'To write a report for the media', 'To test new medicines'], correctAnswer: 'To identify the cause, track the spread, and control the disease' },
        { type: 'mcq', question: 'HACCP is a system designed to ensure:', options: ['Animal welfare', 'High milk production', 'Food safety', 'Farm profitability'], correctAnswer: 'Food safety' },
        { type: 'mcq', question: 'Which international body sets standards for animal health and zoonoses?', options: ['WHO', 'OIE (World Organisation for Animal Health)', 'FAO', 'UNICEF'], correctAnswer: 'OIE (World Organisation for Animal Health)' },
        { type: 'mcq', question: 'What is a common route of foodborne disease transmission?', options: ['Breathing contaminated air', 'Consuming contaminated food or water', 'An insect bite', 'Direct contact with a sick animal'], correctAnswer: 'Consuming contaminated food or water' },
        // MSQs
        { type: 'msq', question: 'Veterinary Public Health involves which of the following activities? (Select all that apply)', options: ['Zoonotic disease control', 'Food safety and hygiene', 'Shaping public health policy', 'Designing pet clothing'], correctAnswer: ['Zoonotic disease control', 'Food safety and hygiene', 'Shaping public health policy'] },
        { type: 'msq', question: 'Which of the following are examples of zoonotic diseases? (Select all that apply)', options: ['Brucellosis', 'Rabies', 'Avian Influenza', 'Diabetes'], correctAnswer: ['Brucellosis', 'Rabies', 'Avian Influenza'] },
        { type: 'msq', question: 'A farm biosecurity plan should include measures for: (Select all that apply)', options: ['Controlled entry for visitors and vehicles', 'Quarantine for new animals', 'Vector and pest control', 'Sharing needles between sick and healthy animals'], correctAnswer: ['Controlled entry for visitors and vehicles', 'Quarantine for new animals', 'Vector and pest control'] },
        { type: 'msq', question: 'Epidemiological studies look at which aspects of a disease? (Select all that apply)', options: ['Incidence (new cases)', 'Prevalence (total cases)', 'Transmission routes', 'The cost of treatment'], correctAnswer: ['Incidence (new cases)', 'Prevalence (total cases)', 'Transmission routes'] },
        { type: 'msq', question: 'What is the role of a veterinarian in ensuring food safety? (Select all that apply)', options: ['Conducting ante-mortem and post-mortem inspections', 'Ensuring hygienic slaughter protocols', 'Monitoring for chemical residues in meat and milk', 'Setting the retail price of meat'], correctAnswer: ['Conducting ante-mortem and post-mortem inspections', 'Ensuring hygienic slaughter protocols', 'Monitoring for chemical residues in meat and milk'] },
      ]
    },
    // Certification 2: Livestock Health & Nutrition Management
    {
      id: 'vet_cert_2',
      titleKey: 'vet_cert_2',
      modules: [
        {
          id: 'v2m1',
          titleKey: 'vet_cert_2_mod_1',
          content: `This module introduces the essential principles of livestock physiology and how they relate to health and productivity. Learners study the functioning of major body systems—**digestive, respiratory, circulatory, reproductive, and endocrine**—across cattle, buffalo, goats, sheep, and pigs. 
          
The module highlights early disease detection through **vital signs, behavioral changes, posture, feed intake, and body condition scoring**. Students examine common infectious and non-infectious diseases, vaccination schedules, deworming protocols, and routine health assessments. Preventive healthcare strategies, including clean housing, proper ventilation, hygiene, and stress management, are covered in detail. The module also explains the importance of biosecurity practices such as controlled access, sanitation, isolation, and vector control. Case studies from dairy and small-ruminant farms illustrate how simple preventive measures can reduce morbidity and economic losses. By the end, learners develop a strong understanding of livestock physiology and foundational disease prevention strategies essential for effective farm management.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Which of the following is a vital sign used for early disease detection?', options: ['The animal\'s name', 'Body temperature', 'The time of day', 'The breed of the animal'], correctAnswer: 'Body temperature' },
            { type: 'mcq', question: 'What is "body condition scoring" used to assess?', options: ['The animal\'s age', 'The animal\'s nutritional status and fat reserves', 'The animal\'s mood', 'The animal\'s breed purity'], correctAnswer: 'The animal\'s nutritional status and fat reserves' },
            { type: 'mcq', question: 'Which of these is a preventive healthcare strategy?', options: ['Waiting for an animal to get sick', 'Regular vaccination and deworming', 'Overcrowding animals', 'Providing unclean water'], correctAnswer: 'Regular vaccination and deworming' },
            { type: 'mcq', question: 'The digestive system is an example of a:', options: ['Vital sign', 'Body system', 'Disease', 'Vaccine'], correctAnswer: 'Body system' },
            { type: 'mcq', question: 'Biosecurity practices like controlled access help to:', options: ['Increase stress', 'Introduce diseases', 'Prevent the spread of diseases', 'Reduce feed intake'], correctAnswer: 'Prevent the spread of diseases' },
            // MSQs
            { type: 'msq', question: 'Early disease detection can be done by observing: (Select all that apply)', options: ['Changes in behavior', 'Feed intake', 'Vital signs like temperature', 'The color of the barn'], correctAnswer: ['Changes in behavior', 'Feed intake', 'Vital signs like temperature'] },
            { type: 'msq', question: 'Preventive healthcare strategies for livestock include: (Select all that apply)', options: ['Clean housing', 'Hygiene', 'Stress management', 'Sharing needles'], correctAnswer: ['Clean housing', 'Hygiene', 'Stress management'] },
            { type: 'msq', question: 'The major body systems studied in this module are: (Select all that apply)', options: ['Digestive', 'Respiratory', 'Skeletal', 'Reproductive'], correctAnswer: ['Digestive', 'Respiratory', 'Reproductive'] },
          ]
        },
        {
          id: 'v2m2',
          titleKey: 'vet_cert_2_mod_2',
          content: `This module focuses on the science of livestock nutrition and how balanced feeding affects growth, reproduction, immunity, and milk or meat production. Students begin by learning about the six major nutrient groups—**carbohydrates, proteins, fats, vitamins, minerals, and water**—and their physiological roles. They study feed classification into **roughages (green fodder, dry fodder), concentrates (grains, oilcakes)**, supplements, additives, and mineral mixtures. 
          
The module explains the unique digestive systems of ruminants and non-ruminants, including rumen function, microbial fermentation, volatile fatty acid production, and digestive efficiency. Learners explore how feed digestibility, nutrient density, palatability, and feed quality influence performance. Special emphasis is placed on understanding seasonal fodder variations and nutrient deficiencies common in Indian livestock systems. Students also learn to identify symptoms of nutritional disorders such as bloat, ketosis, milk fever, and mineral deficiencies. By the end, participants can differentiate feed types, understand digestive mechanisms, and evaluate the nutritional needs of various livestock species.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Which of the following is classified as a "roughage"?', options: ['Grains', 'Oilcakes', 'Green fodder', 'Mineral mixture'], correctAnswer: 'Green fodder' },
            { type: 'mcq', question: 'Grains and oilcakes are examples of what type of feed?', options: ['Roughages', 'Concentrates', 'Additives', 'Supplements'], correctAnswer: 'Concentrates' },
            { type: 'mcq', question: 'What is a key feature of a ruminant digestive system?', options: ['It has only one stomach compartment', 'It relies on microbial fermentation in the rumen', 'It cannot digest fiber', 'It is very simple'], correctAnswer: 'It relies on microbial fermentation in the rumen' },
            { type: 'mcq', question: 'Milk fever is an example of a:', options: ['Infectious disease', 'Nutritional disorder', 'Genetic condition', 'Behavioral problem'], correctAnswer: 'Nutritional disorder' },
            { type: 'mcq', question: 'Which of the six major nutrient groups is the most essential?', options: ['Vitamins', 'Proteins', 'Carbohydrates', 'Water'], correctAnswer: 'Water' },
            // MSQs
            { type: 'msq', question: 'The six major nutrient groups are: (Select all that apply)', options: ['Proteins', 'Carbohydrates', 'Fibers', 'Water'], correctAnswer: ['Proteins', 'Carbohydrates', 'Water'] },
            { type: 'msq', question: 'Feed can be classified into which categories? (Select all that apply)', options: ['Roughages', 'Concentrates', 'Supplements', 'Plastics'], correctAnswer: ['Roughages', 'Concentrates', 'Supplements'] },
            { type: 'msq', question: 'Symptoms of nutritional disorders mentioned include: (Select all that apply)', options: ['Bloat', 'Ketosis', 'A healthy appetite', 'Milk fever'], correctAnswer: ['Bloat', 'Ketosis', 'Milk fever'] },
          ]
        },
        {
          id: 'v2m3',
          titleKey: 'vet_cert_2_mod_3',
          content: `This module trains learners in practical feed formulation and ration balancing techniques essential for improving livestock productivity. Students are introduced to the principles of ration formulation, including **dry matter intake (DMI), total digestible nutrients (TDN), and crude protein (CP)**. They learn how to design balanced rations for calves, heifers, lactating cows, dry cows, goats, and sheep based on age, weight, production stage, and breed characteristics. 
          
The module explains the use of ration-balancing software, nutrient calculators, and field-level feed testing. Participants study **silage and hay-making methods** essential for year-round fodder availability. Best practices in feeding frequency, water availability, body condition scoring, and mineral supplementation are discussed. Practical examples show how scientific feeding reduces costs while improving milk yield, growth rates, and reproductive efficiency. By the end, learners gain the skills to formulate cost-effective diets and implement feeding strategies tailored to specific farm conditions.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What does DMI stand for in ration formulation?', options: ['Daily Mineral Intake', 'Dry Matter Intake', 'Dairy Milk Index', 'Direct Mash Ingredient'], correctAnswer: 'Dry Matter Intake' },
            { type: 'mcq', question: 'Silage and hay-making are methods for:', options: ['Conserving fodder for year-round use', 'A type of vaccination', 'Treating sick animals', 'Housing animals'], correctAnswer: 'Conserving fodder for year-round use' },
            { type: 'mcq', question: 'When formulating a ration, which factor is important to consider?', options: ['The animal\'s name', 'The color of the feed', 'The animal\'s age, weight, and production stage', 'The weather on a specific day'], correctAnswer: 'The animal\'s age, weight, and production stage' },
            { type: 'mcq', question: 'What is a primary benefit of scientific feeding?', options: ['It increases feed costs', 'It reduces costs and improves milk yield/growth', 'It is more complicated with no benefits', 'It causes nutritional disorders'], correctAnswer: 'It reduces costs and improves milk yield/growth' },
            { type: 'mcq', question: 'TDN is a measure of what in a feed?', options: ['Total Dryness Number', 'Total Digestible Nutrients', 'Typical Daily Nutrition', 'Toxic Daily Nutrient'], correctAnswer: 'Total Digestible Nutrients' },
            // MSQs
            { type: 'msq', question: 'The principles of ration formulation include calculating for: (Select all that apply)', options: ['Dry Matter Intake (DMI)', 'Total Digestible Nutrients (TDN)', 'Crude Protein (CP)', 'The prettiest color'], correctAnswer: ['Dry Matter Intake (DMI)', 'Total Digestible Nutrients (TDN)', 'Crude Protein (CP)'] },
            { type: 'msq', question: 'A balanced ration should be designed based on the animal\'s: (Select all that apply)', options: ['Age', 'Weight', 'Production stage', 'Favorite food'], correctAnswer: ['Age', 'Weight', 'Production stage'] },
            { type: 'msq', question: 'Best practices in feeding management include: (Select all that apply)', options: ['Consistent feeding frequency', 'Constant availability of clean water', 'Regular body condition scoring', 'Feeding only once a week'], correctAnswer: ['Consistent feeding frequency', 'Constant availability of clean water', 'Regular body condition scoring'] },
          ]
        },
        {
          id: 'v2m4',
          titleKey: 'vet_cert_2_mod_4',
          content: `This module integrates nutrition and health principles into a comprehensive herd management strategy. Learners begin with herd health planning, including **vaccination calendars, disease monitoring, and record-keeping systems** for milk yield, reproduction, and health events. 
          
The module covers **breeding management, heat detection techniques, calving care, housing design, flooring, bedding, ventilation, and hygiene practices**. Students learn how nutrition, genetics, environment, and management interact to influence productivity. The module introduces tools such as milk analysis, growth monitoring charts, and software for farm performance tracking. Strategies for improving overall farm profitability—reducing feed waste, optimizing calving intervals, improving reproductive efficiency, and reducing disease outbreaks—are highlighted. Case studies showcase successful dairy and small-ruminant farms that improved productivity through holistic herd management. By the end, learners understand how integrating nutrition, health care, and farm management enhances animal welfare, increases production, and ensures sustainable farm operations.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'A vaccination calendar is part of a:', options: ['Feeding plan', 'Herd health plan', 'Breeding plan', 'Financial plan'], correctAnswer: 'Herd health plan' },
            { type: 'mcq', question: 'Which of the following is a key aspect of breeding management?', options: ['Feed formulation', 'Heat detection', 'Vaccination', 'Housing design'], correctAnswer: 'Heat detection' },
            { type: 'mcq', question: 'Why is record-keeping important in herd management?', options: ['It is a waste of time', 'It helps track performance and make data-driven decisions', 'The government requires it for all pets', 'It helps in naming animals'], correctAnswer: 'It helps track performance and make data-driven decisions' },
            { type: 'mcq', question: 'Optimizing calving intervals is a strategy to improve:', options: ['Animal appearance', 'Farm profitability', 'Feed quality', 'Housing'], correctAnswer: 'Farm profitability' },
            { type: 'mcq', question: 'Holistic herd management integrates which aspects?', options: ['Only nutrition', 'Only health care', 'Nutrition, health care, and farm management', 'Only breeding'], correctAnswer: 'Nutrition, health care, and farm management' },
            // MSQs
            { type: 'msq', question: 'A herd health plan includes: (Select all that apply)', options: ['Vaccination calendars', 'Disease monitoring', 'Record-keeping', 'Ignoring sick animals'], correctAnswer: ['Vaccination calendars', 'Disease monitoring', 'Record-keeping'] },
            { type: 'msq', question: 'Good farm management practices covered in the module are: (Select all that apply)', options: ['Proper housing design', 'Hygiene practices', 'Good ventilation', 'Overcrowding'], correctAnswer: ['Proper housing design', 'Hygiene practices', 'Good ventilation'] },
            { type: 'msq', question: 'Overall farm profitability can be improved by: (Select all that apply)', options: ['Reducing feed waste', 'Improving reproductive efficiency', 'Reducing disease outbreaks', 'Increasing treatment costs'], correctAnswer: ['Reducing feed waste', 'Improving reproductive efficiency', 'Reducing disease outbreaks'] },
          ]
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'Observing an animal\'s vital signs is important for:', options: ['Assessing its market value', 'Early disease detection', 'Formulating its diet', 'Deciding on a name'], correctAnswer: 'Early disease detection' },
        { type: 'mcq', question: 'Green fodder and hay are classified as what type of feed?', options: ['Concentrates', 'Supplements', 'Roughages', 'Additives'], correctAnswer: 'Roughages' },
        { type: 'mcq', question: 'What is the primary goal of formulating a balanced ration?', options: ['To feed the animal as much as possible', 'To meet the animal\'s specific nutrient requirements for its production stage', 'To use the cheapest feed available', 'To make the feed taste good'], correctAnswer: 'To meet the animal\'s specific nutrient requirements for its production stage' },
        { type: 'mcq', question: 'A comprehensive herd health plan should always include a:', options: ['Marketing strategy', 'Vaccination calendar', 'List of potential buyers', 'Daily weather report'], correctAnswer: 'Vaccination calendar' },
        { type: 'mcq', question: 'What does "Body Condition Scoring" primarily assess?', options: ['An animal\'s fat reserves and nutritional status', 'An animal\'s height', 'An animal\'s skin condition', 'An animal\'s age'], correctAnswer: 'An animal\'s fat reserves and nutritional status' },
        { type: 'mcq', question: 'Bloat and Ketosis are examples of:', options: ['Infectious diseases', 'Reproductive problems', 'Nutritional disorders', 'Genetic defects'], correctAnswer: 'Nutritional disorders' },
        { type: 'mcq', question: 'What is the main advantage of making silage?', options: ['It increases the protein content of fodder', 'It is a method to preserve green fodder for year-round use', 'It is a type of concentrate feed', 'It is only for small animals'], correctAnswer: 'It is a method to preserve green fodder for year-round use' },
        { type: 'mcq', question: 'Good record-keeping on a farm is essential for:', options: ['Making informed, data-driven management decisions', 'Complying with local traditions', 'A hobby for the farmer', 'Increasing feed costs'], correctAnswer: 'Making informed, data-driven management decisions' },
        // MSQs
        { type: 'msq', question: 'Which of the following are key indicators of an animal\'s health? (Select all that apply)', options: ['Normal feed and water intake', 'Alert behavior', 'Normal posture', 'A dirty and unkempt coat'], correctAnswer: ['Normal feed and water intake', 'Alert behavior', 'Normal posture'] },
        { type: 'msq', question: 'A balanced livestock diet must contain which of the following? (Select all that apply)', options: ['Protein', 'Energy (Carbohydrates/Fats)', 'Vitamins and Minerals', 'Plastic waste'], correctAnswer: ['Protein', 'Energy (Carbohydrates/Fats)', 'Vitamins and Minerals'] },
        { type: 'msq', question: 'Effective farm management involves which of these practices? (Select all that apply)', options: ['Good housing and ventilation', 'Regular hygiene and sanitation', 'A planned breeding program', 'Mixing sick and healthy animals together'], correctAnswer: ['Good housing and ventilation', 'Regular hygiene and sanitation', 'A planned breeding program'] },
        { type: 'msq', question: 'The principles of ration formulation take into account the animal\'s: (Select all that apply)', options: ['Age', 'Body weight', 'Lactation or pregnancy status', 'Favorite color'], correctAnswer: ['Age', 'Body weight', 'Lactation or pregnancy status'] },
        { type: 'msq', question: 'Which actions contribute to a good preventive healthcare strategy on a farm? (Select all that apply)', options: ['Implementing a biosecurity plan', 'Following a regular deworming schedule', 'Providing clean drinking water', 'Waiting for a disease outbreak to happen before acting'], correctAnswer: ['Implementing a biosecurity plan', 'Following a regular deworming schedule', 'Providing clean drinking water'] },
      ]
    },
    // Certification 3: Dairy Cattle Management
    {
      id: 'vet_cert_3',
      titleKey: 'vet_cert_3',
      modules: [
        {
          id: 'v3m1',
          titleKey: 'vet_cert_3_mod_1',
          content: `This module introduces learners to the fundamentals of dairy farming, focusing on breeds, housing systems, and farm layout. Students begin by studying major dairy breeds—such as **Holstein Friesian, Jersey, Gir, Sahiwal, Murrah, and Mehsana**—understanding their milk yield potential, adaptability, disease resistance, and feed requirements. 
          
They learn how to select animals based on **udder conformation, body condition, temperament, lactation stage, and pedigree**. The module explains farm setup essentials, including site selection, drainage, ventilation, flooring types, trough design, lighting, and space requirements for calves, heifers, and lactating cows. Learners explore **loose housing, tie-stall, and free-stall systems** suitable for Indian climates. Hygiene practices such as manure management, footbath systems, and milking area cleanliness are highlighted. By the end, participants understand how proper breed selection and scientific housing design directly influence milk production, animal comfort, and farm profitability.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Which of the following is a well-known exotic dairy breed with high milk yield?', options: ['Gir', 'Sahiwal', 'Holstein Friesian', 'Murrah'], correctAnswer: 'Holstein Friesian' },
            { type: 'mcq', question: 'When selecting a dairy animal, what does "udder conformation" refer to?', options: ['The animal\'s body weight', 'The shape, size, and health of the udder', 'The animal\'s age', 'The animal\'s pedigree'], correctAnswer: 'The shape, size, and health of the udder' },
            { type: 'mcq', question: 'Which of the following is a type of housing system for dairy cattle?', options: ['High-rise system', 'Underground system', 'Loose housing system', 'Aquatic system'], correctAnswer: 'Loose housing system' },
            { type: 'mcq', question: 'Good farm design should prioritize:', options: ['Animal comfort and hygiene', 'The farmer\'s convenience only', 'Using the cheapest materials available', 'A nice view'], correctAnswer: 'Animal comfort and hygiene' },
            { type: 'mcq', question: 'The Murrah is a famous breed of:', options: ['Cow', 'Goat', 'Sheep', 'Buffalo'], correctAnswer: 'Buffalo' },
            // MSQs
            { type: 'msq', question: 'Major dairy breeds discussed in the module include: (Select all that apply)', options: ['Holstein Friesian', 'Jersey', 'Gir', 'German Shepherd'], correctAnswer: ['Holstein Friesian', 'Jersey', 'Gir'] },
            { type: 'msq', question: 'When selecting a dairy animal, which factors should be considered? (Select all that apply)', options: ['Body condition', 'Temperament', 'Lactation stage', 'The animal\'s favorite food'], correctAnswer: ['Body condition', 'Temperament', 'Lactation stage'] },
            { type: 'msq', question: 'Key elements of a good farm setup are: (Select all that apply)', options: ['Proper drainage', 'Good ventilation', 'Appropriate flooring', 'No access to water'], correctAnswer: ['Proper drainage', 'Good ventilation', 'Appropriate flooring'] },
          ]
        },
        {
          id: 'v3m2',
          titleKey: 'vet_cert_3_mod_2',
          content: `This module focuses on feeding and milking practices essential for maximizing dairy herd productivity. Learners study nutrient requirements during different stages—**early lactation, mid-lactation, late lactation, and dry periods**. The module explains balanced ration formulation using green fodder, dry fodder, concentrates, and mineral mixtures. Students explore **TMR (Total Mixed Ration)** and fodder conservation through silage and hay. 
          
The milking management section explains **machine milking, hygiene protocols, teat dipping, and mastitis prevention**. Learners study the lactation curve and strategies to optimize peak yield through nutrition and stress control. Emphasis is placed on **dry period management** and transition diets to prevent metabolic disorders like milk fever and ketosis. Case studies show how efficient feed and milking practices improve milk quality, fat content, and overall herd performance. By the end, students can design feeding and milking plans tailored to farm size and breed type.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is TMR in dairy nutrition?', options: ['Tomorrow\'s Milk Ration', 'Total Mixed Ration', 'Top Milk Rating', 'Typical Mineral Requirement'], correctAnswer: 'Total Mixed Ration' },
            { type: 'mcq', question: 'Teat dipping after milking is a key practice for:', options: ['Increasing milk yield', 'Preventing mastitis', 'Calming the cow', 'Improving milk taste'], correctAnswer: 'Preventing mastitis' },
            { type: 'mcq', question: 'The "dry period" is the stage when a cow is:', options: ['Producing the most milk', 'Not being milked, before calving', 'A young calf', 'Eating only dry fodder'], correctAnswer: 'Not being milked, before calving' },
            { type: 'mcq', question: 'Milk fever and ketosis are examples of:', options: ['Infectious diseases', 'Metabolic disorders', 'Genetic defects', 'Behavioral issues'], correctAnswer: 'Metabolic disorders' },
            { type: 'mcq', question: 'Why are the nutrient requirements of a cow in early lactation different from a cow in the dry period?', options: ['They are not different', 'High milk production requires much more energy and protein', 'Dry cows need more nutrients', 'Lactating cows eat less'], correctAnswer: 'High milk production requires much more energy and protein' },
            // MSQs
            { type: 'msq', question: 'Different stages of the lactation cycle with unique nutrient needs include: (Select all that apply)', options: ['Early lactation', 'Dry period', 'Mid-lactation', 'Calfhood'], correctAnswer: ['Early lactation', 'Dry period', 'Mid-lactation'] },
            { type: 'msq', question: 'Good milking management includes which practices? (Select all that apply)', options: ['Hygienic protocols', 'Mastitis prevention', 'Teat dipping', 'Using dirty equipment'], correctAnswer: ['Hygienic protocols', 'Mastitis prevention', 'Teat dipping'] },
            { type: 'msq', question: 'Proper management of the dry period helps to prevent which conditions? (Select all that apply)', options: ['Milk fever', 'High milk yield', 'Ketosis', 'A healthy calf'], correctAnswer: ['Milk fever', 'Ketosis'] },
          ]
        },
        {
          id: 'v3m3',
          titleKey: 'vet_cert_3_mod_3',
          content: `This module teaches learners how to manage dairy reproduction and maintain a continuous cycle of productive animals. It begins with **heat detection techniques** such as visual signs, pedometers, and tail painting. Students learn about **artificial insemination (AI)**, semen quality, timing of insemination, pregnancy diagnosis, and dry cow management. 
          
The module covers gestation management, calving preparation, and post-calving care to reduce complications. **Calf management** focuses on colostrum feeding, navel disinfection, weaning strategies, and disease prevention. Learners explore challenges like repeat breeding, anestrus, and infertility, and strategies to improve conception rates through nutrition and stress reduction. The module also emphasizes **herd replacement planning**, identifying productive cows, culling unproductive animals, and selecting heifers with high genetic potential. By the end, students understand how reproductive efficiency and calf management contribute to long-term dairy herd sustainability and profitability.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Which of the following is a visual sign of heat in a cow?', options: ['Sleeping', 'Mounting other cows', 'Eating slowly', 'Lying down'], correctAnswer: 'Mounting other cows' },
            { type: 'mcq', question: 'What is the most critical aspect of calf management immediately after birth?', options: ['Giving it grain', 'Ensuring it receives colostrum', 'Weaning it immediately', 'Washing it with cold water'], correctAnswer: 'Ensuring it receives colostrum' },
            { type: 'mcq', question: 'What is AI in the context of dairy reproduction?', options: ['Animal Intelligence', 'Agricultural Investment', 'Artificial Insemination', 'Animal Identification'], correctAnswer: 'Artificial Insemination' },
            { type: 'mcq', question: '"Culling" in herd management refers to:', options: ['Selecting the best animals for breeding', 'Removing unproductive animals from the herd', 'A type of disease', 'The calving process'], correctAnswer: 'Removing unproductive animals from the herd' },
            { type: 'mcq', question: 'Repeat breeding and anestrus are examples of:', options: ['High productivity', 'Reproductive challenges', 'Normal behavior', 'Signs of good health'], correctAnswer: 'Reproductive challenges' },
            // MSQs
            { type: 'msq', question: 'Heat detection techniques include: (Select all that apply)', options: ['Observing visual signs like mounting', 'Using pedometers', 'Tail painting', 'Checking the milk flavor'], correctAnswer: ['Observing visual signs like mounting', 'Using pedometers', 'Tail painting'] },
            { type: 'msq', question: 'Effective calf management involves which practices? (Select all that apply)', options: ['Proper colostrum feeding', 'Navel disinfection', 'Disease prevention', 'Ignoring the calf for the first week'], correctAnswer: ['Proper colostrum feeding', 'Navel disinfection', 'Disease prevention'] },
            { type: 'msq', question: 'Herd replacement planning involves: (Select all that apply)', options: ['Identifying productive cows', 'Culling unproductive animals', 'Selecting genetically superior heifers', 'Keeping all animals regardless of performance'], correctAnswer: ['Identifying productive cows', 'Culling unproductive animals', 'Selecting genetically superior heifers'] },
          ]
        },
        {
          id: 'v3m4',
          titleKey: 'vet_cert_3_mod_4',
          content: `This final module integrates health care, data management, and business planning for dairy operations. Learners study routine disease prevention strategies for **mastitis, FMD, HS, BQ, brucellosis, and parasitic infections**. They explore vaccination schedules, deworming, hoof trimming, and herd health monitoring tools. 
          
The module emphasizes the importance of **accurate record-keeping**—milk yield, breeding events, health treatments, expenses, and feed inventories—to support data-driven decisions. Students learn basic financial planning, cost analysis, milk pricing, labor management, and milk marketing through **cooperatives, dairy plants, and direct-to-consumer models**. The module also covers quality testing, chilling, and storage for maintaining milk hygiene. Learners examine case studies of successful dairy farms and FPO-led dairy enterprises that improved profits through scientific management. By the end, participants are confident in managing dairy farms using a combination of health care, productivity tracking, and business strategies.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'FMD, HS, and BQ are examples of:', options: ['Nutritional supplements', 'Diseases for which vaccines are available', 'Dairy breeds', 'Types of feed'], correctAnswer: 'Diseases for which vaccines are available' },
            { type: 'mcq', question: 'Why is accurate record-keeping crucial for a dairy farm?', options: ['It is a traditional custom', 'To support data-driven decisions and track profitability', 'It is only for large farms', 'It has no real benefit'], correctAnswer: 'To support data-driven decisions and track profitability' },
            { type: 'mcq', question: 'Which of the following is a milk marketing channel?', options: ['The grain market', 'Dairy cooperatives', 'The stock market', 'The local government office'], correctAnswer: 'Dairy cooperatives' },
            { type: 'mcq', question: 'Hoof trimming is an important practice for preventing what?', options: ['Mastitis', 'Lameness', 'Respiratory disease', 'Metabolic disorders'], correctAnswer: 'Lameness' },
            { type: 'mcq', question: 'Which factor is key to maintaining milk hygiene after milking?', options: ['Immediate chilling and proper storage', 'Leaving it in the sun', 'Mixing it with water', 'Adding sugar'], correctAnswer: 'Immediate chilling and proper storage' },
            // MSQs
            { type: 'msq', question: 'Routine disease prevention on a dairy farm includes: (Select all that apply)', options: ['Vaccination schedules', 'Regular deworming', 'Hoof trimming', 'Ignoring minor injuries'], correctAnswer: ['Vaccination schedules', 'Regular deworming', 'Hoof trimming'] },
            { type: 'msq', question: 'What types of records should a dairy farm maintain? (Select all that apply)', options: ['Milk yield', 'Breeding events', 'Health treatments', 'The farmer\'s favorite songs'], correctAnswer: ['Milk yield', 'Breeding events', 'Health treatments'] },
            { type: 'msq', question: 'Successful dairy business management involves: (Select all that apply)', options: ['Financial planning', 'Labor management', 'Effective milk marketing', 'Focusing only on sick animals'], correctAnswer: ['Financial planning', 'Labor management', 'Effective milk marketing'] },
          ]
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'Which of these is an indigenous Indian dairy breed known for its heat tolerance?', options: ['Holstein Friesian', 'Jersey', 'Gir', 'Angus'], correctAnswer: 'Gir' },
        { type: 'mcq', question: 'A Total Mixed Ration (TMR) is a feeding strategy that:', options: ['Provides only green fodder', 'Mixes all feed ingredients together to provide a balanced diet in every bite', 'Is only for calves', 'Is fed only during the dry period'], correctAnswer: 'Mixes all feed ingredients together to provide a balanced diet in every bite' },
        { type: 'mcq', question: 'What is the single most important feed for a newborn calf?', options: ['Milk replacer', 'Water', 'Grain', 'Colostrum'], correctAnswer: 'Colostrum' },
        { type: 'mcq', question: 'The primary goal of teat dipping after milking is to prevent:', options: ['Milk fever', 'Mastitis', 'Lameness', 'Bloat'], correctAnswer: 'Mastitis' },
        { type: 'mcq', question: 'Artificial Insemination (AI) is a technique used for:', options: ['Disease treatment', 'Feed analysis', 'Breeding and genetic improvement', 'Housing design'], correctAnswer: 'Breeding and genetic improvement' },
        { type: 'mcq', question: 'The "dry period" in a dairy cow\'s lactation cycle is crucial for:', options: ['Maximizing current milk production', 'Allowing the udder to rest and regenerate for the next lactation', 'The cow to gain weight rapidly', 'Treating respiratory diseases'], correctAnswer: 'Allowing the udder to rest and regenerate for the next lactation' },
        { type: 'mcq', question: '"Culling" is the process of:', options: ['Vaccinating animals', 'Removing unproductive animals from the herd', 'Trimming hooves', 'Selling milk'], correctAnswer: 'Removing unproductive animals from the herd' },
        { type: 'mcq', question: 'A key component of a successful dairy business is:', options: ['High feed costs', 'Poor record-keeping', 'Accurate financial planning and record-keeping', 'Low milk production'], correctAnswer: 'Accurate financial planning and record-keeping' },
        // MSQs
        { type: 'msq', question: 'When selecting a good dairy cow, a farmer should look for: (Select all that apply)', options: ['Good udder conformation', 'Correct body condition', 'A healthy pedigree', 'A nervous temperament'], correctAnswer: ['Good udder conformation', 'Correct body condition', 'A healthy pedigree'] },
        { type: 'msq', question: 'Effective dairy farm management includes: (Select all that apply)', options: ['A planned vaccination program', 'Hygienic housing and milking practices', 'A sound reproductive management plan', 'Using the same needle for multiple cows'], correctAnswer: ['A planned vaccination program', 'Hygienic housing and milking practices', 'A sound reproductive management plan'] },
        { type: 'msq', question: 'Which of the following are common metabolic disorders in dairy cattle? (Select all that apply)', options: ['Milk fever', 'Mastitis', 'Ketosis', 'Foot and Mouth Disease'], correctAnswer: ['Milk fever', 'Ketosis'] },
        { type: 'msq', question: 'Reproductive management in a dairy herd involves: (Select all that apply)', options: ['Accurate heat detection', 'Proper timing of Artificial Insemination', 'Pregnancy diagnosis', 'Ignoring cows that don\'t get pregnant'], correctAnswer: ['Accurate heat detection', 'Proper timing of Artificial Insemination', 'Pregnancy diagnosis'] },
        { type: 'msq', question: 'Important records to keep on a dairy farm include: (Select all that apply)', options: ['Milk production records', 'Breeding and calving dates', 'Health treatment records', 'The daily weather'], correctAnswer: ['Milk production records', 'Breeding and calving dates', 'Health treatment records'] },
      ]
    },
    // Certification 4: Poultry Health & Biosecurity
    {
      id: 'vet_cert_4',
      titleKey: 'vet_cert_4',
      modules: [
        {
          id: 'v4m1',
          titleKey: 'vet_cert_4_mod_1',
          content: `This module introduces learners to the fundamentals of poultry anatomy, physiology, and the production systems used in commercial farming. Students study the differences between **broilers, layers, and backyard birds**. Key physiological aspects—**growth rate, metabolism, feed conversion ratio (FCR), and egg formation**—are explained to help learners understand productivity drivers. 
          
The module also covers scientific poultry housing, including **deep-litter and cage systems**. Learners explore ventilation, temperature regulation, lighting schedules, stocking density, and litter management to ensure optimal bird comfort and disease control. Environmental challenges such as heat stress, ammonia buildup, and wet litter issues are discussed along with practical solutions. The module emphasizes how housing design influences health, growth, mortality, and farm profitability. By the end, learners understand the foundations of poultry management and environmental control required for disease-free and productive flocks.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is the primary difference between a broiler and a layer chicken?', options: ['Broilers are for meat, layers are for eggs', 'Broilers are for eggs, layers are for meat', 'They are the same', 'Broilers are a type of backyard bird'], correctAnswer: 'Broilers are for meat, layers are for eggs' },
            { type: 'mcq', question: 'What does FCR stand for in poultry production?', options: ['Fast Chicken Rate', 'Feed Conversion Ratio', 'Farm Cost Ratio', 'Final Chick Requirement'], correctAnswer: 'Feed Conversion Ratio' },
            { type: 'mcq', question: 'A deep-litter system is a type of:', options: ['Feeding system', 'Housing system', 'Vaccination method', 'Breed of chicken'], correctAnswer: 'Housing system' },
            { type: 'mcq', question: 'High levels of ammonia in a poultry house can cause:', options: ['Faster growth', 'Better egg quality', 'Respiratory problems', 'Stronger bones'], correctAnswer: 'Respiratory problems' },
            { type: 'mcq', question: 'What is a major environmental challenge in poultry farming?', options: ['Cold stress', 'Heat stress', 'Low light', 'Too much space'], correctAnswer: 'Heat stress' },
            // MSQs
            { type: 'msq', question: 'Key physiological aspects of poultry that drive productivity include: (Select all that apply)', options: ['Growth rate', 'Feed Conversion Ratio (FCR)', 'Egg formation', 'Feather color'], correctAnswer: ['Growth rate', 'Feed Conversion Ratio (FCR)', 'Egg formation'] },
            { type: 'msq', question: 'Scientific poultry housing involves managing which factors? (Select all that apply)', options: ['Ventilation', 'Temperature', 'Lighting schedules', 'The farmer\'s daily schedule'], correctAnswer: ['Ventilation', 'Temperature', 'Lighting schedules'] },
            { type: 'msq', question: 'Common issues related to poor litter management are: (Select all that apply)', options: ['Ammonia buildup', 'Wet litter', 'Disease outbreaks', 'Higher egg production'], correctAnswer: ['Ammonia buildup', 'Wet litter', 'Disease outbreaks'] },
          ]
        },
        {
          id: 'v4m2',
          titleKey: 'vet_cert_4_mod_2',
          content: `This module focuses on the nutritional needs of poultry and how feed formulation impacts growth, immunity, and egg production. Students study the components of balanced poultry feed—**energy sources, proteins, amino acids (lysine, methionine), vitamins, minerals, and calcium-phosphorus balance**. 
          
The module explains feeding systems for broilers and layers, including **starter, grower, finisher, pre-lay, and layer rations**. Learners understand how FCR, feed particle size, pellet quality, and water management affect performance. The module highlights the role of **gut health** in preventing disease and improving nutrient absorption. Students also learn about common nutritional disorders such as rickets, fatty liver syndrome, and cage-layer fatigue, along with prevention strategies. Case studies demonstrate how innovative feeding practices—phase feeding, precision nutrition, and use of natural additives—improve productivity while reducing feed costs. By the end, learners can formulate and manage feeding programs tailored to flock type, age, and farm goals.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Lysine and methionine are examples of essential:', options: ['Minerals', 'Vitamins', 'Amino acids', 'Energy sources'], correctAnswer: 'Amino acids' },
            { type: 'mcq', question: 'A "starter" ration is designed for:', options: ['Old birds', 'Laying hens', 'Young chicks', 'Broilers just before sale'], correctAnswer: 'Young chicks' },
            { type: 'mcq', question: 'What is cage-layer fatigue related to?', options: ['A viral disease', 'A nutritional disorder, often a calcium deficiency', 'Overcrowding', 'Poor ventilation'], correctAnswer: 'A nutritional disorder, often a calcium deficiency' },
            { type: 'mcq', question: 'Why is gut health important in poultry?', options: ['It affects feather color', 'It is crucial for preventing disease and improving nutrient absorption', 'It has no impact on the bird', 'It only matters for broilers'], correctAnswer: 'It is crucial for preventing disease and improving nutrient absorption' },
            { type: 'mcq', question: '"Phase feeding" refers to:', options: ['Feeding birds only at night', 'Changing the feed formulation as the birds age', 'Mixing different feeds together', 'A method of feeding backyard birds'], correctAnswer: 'Changing the feed formulation as the birds age' },
            // MSQs
            { type: 'msq', question: 'A balanced poultry feed must contain which components? (Select all that apply)', options: ['Energy sources', 'Proteins', 'Vitamins and Minerals', 'Plastic pellets'], correctAnswer: ['Energy sources', 'Proteins', 'Vitamins and Minerals'] },
            { type: 'msq', question: 'Different types of poultry rations include: (Select all that apply)', options: ['Starter', 'Grower', 'Layer', 'Water'], correctAnswer: ['Starter', 'Grower', 'Layer'] },
            { type: 'msq', question: 'Good nutrition management in poultry affects: (Select all that apply)', options: ['Growth', 'Immunity', 'Egg production', 'The color of the coop'], correctAnswer: ['Growth', 'Immunity', 'Egg production'] },
          ]
        },
        {
          id: 'v4m3',
          titleKey: 'vet_cert_4_mod_3',
          content: `This module provides in-depth knowledge of major poultry diseases and effective health management strategies. Students explore viral diseases such as **Newcastle disease (Ranikhet), Infectious Bursal Disease (IBD), and Marek’s**. They study bacterial infections like **fowl cholera, E. coli, and CRD (Chronic Respiratory Disease)**. 
          
The module covers clinical signs, disease transmission, necropsy findings, and laboratory diagnostic tools. Learners gain hands-on understanding of **vaccination protocols** for broilers and layers, including administration methods (eye drops, drinking water, injection, spray). Proper **vaccine handling, cold chain maintenance**, and timing are emphasized to ensure effectiveness. The module teaches early disease detection, flock monitoring, mortality pattern analysis, and prompt response measures. Real-world examples illustrate how timely vaccination and biosecurity prevent large-scale outbreaks and economic losses. By the end, learners are equipped to identify, prevent, and manage poultry diseases effectively.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Newcastle Disease is also known as:', options: ['IBD', 'Marek\'s', 'Ranikhet', 'Fowl Cholera'], correctAnswer: 'Ranikhet' },
            { type: 'mcq', question: 'What is CRD?', options: ['A type of feed', 'A viral disease', 'Chronic Respiratory Disease, a bacterial infection', 'A vaccination method'], correctAnswer: 'Chronic Respiratory Disease, a bacterial infection' },
            { type: 'mcq', question: 'What is meant by "cold chain maintenance" for vaccines?', options: ['Administering the vaccine when it is cold outside', 'Keeping the vaccine at the correct low temperature from production to administration', 'A chain used to hold birds during vaccination', 'A new disease'], correctAnswer: 'Keeping the vaccine at the correct low temperature from production to administration' },
            { type: 'mcq', question: 'Administering a vaccine through drinking water is a common method for:', options: ['Individual birds', 'Large flocks', 'Only sick birds', 'Broilers only'], correctAnswer: 'Large flocks' },
            { type: 'mcq', question: 'A "necropsy" is:', options: ['A blood test', 'A vaccination', 'A physical examination of a live bird', 'A post-mortem examination of a dead bird to determine the cause of death'], correctAnswer: 'A post-mortem examination of a dead bird to determine the cause of death' },
            // MSQs
            { type: 'msq', question: 'Which of the following are major viral diseases in poultry? (Select all that apply)', options: ['Newcastle Disease', 'Infectious Bursal Disease (IBD)', 'Fowl Cholera', 'Marek\'s Disease'], correctAnswer: ['Newcastle Disease', 'Infectious Bursal Disease (IBD)', 'Marek\'s Disease'] },
            { type: 'msq', question: 'Vaccines can be administered to poultry via which methods? (Select all that apply)', options: ['Eye drops', 'Injection', 'Drinking water', 'Mixing with feed'], correctAnswer: ['Eye drops', 'Injection', 'Drinking water'] },
            { type: 'msq', question: 'Effective poultry health management involves: (Select all that apply)', options: ['Following vaccination protocols', 'Early disease detection', 'Proper vaccine handling', 'Ignoring mortality'], correctAnswer: ['Following vaccination protocols', 'Early disease detection', 'Proper vaccine handling'] },
          ]
        },
        {
          id: 'v4m4',
          titleKey: 'vet_cert_4_mod_4',
          content: `This final module focuses on the most critical component of poultry farming—**biosecurity**. Students learn how to design and implement biosecurity plans that protect farms from pathogens. Topics include **controlled entry, visitor logs, dedicated clothing, footbaths, equipment sanitation, and vehicle disinfection**. 
          
The module explains **zoning (clean and dirty areas)**, quarantine procedures, rodent control, litter management, and water sanitation. Learners study how pathogens spread through contaminated feed, water, equipment, air, or personnel. The module includes outbreak investigation steps, emergency culling procedures, disposal of carcasses, and disinfection protocols. Practical case studies highlight biosecurity lapses that caused major disease outbreaks and the corrective measures taken. Students also explore farm audits, documentation, and government guidelines for disease reporting. By the end, participants are able to design strong biosecurity strategies that minimize disease risk, protect flock health, and ensure long-term farm sustainability.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is the most critical component of poultry farming for disease prevention?', options: ['Nutrition', 'Biosecurity', 'Genetics', 'Marketing'], correctAnswer: 'Biosecurity' },
            { type: 'mcq', question: 'A footbath at the entrance of a poultry shed is an example of a:', options: ['Feeding station', 'Housing system', 'Biosecurity measure', 'Treatment method'], correctAnswer: 'Biosecurity measure' },
            { type: 'mcq', question: '"Zoning" on a farm refers to:', options: ['Dividing the farm into clean and dirty areas', 'A type of feed', 'A government regulation', 'A method of selling chickens'], correctAnswer: 'Dividing the farm into clean and dirty areas' },
            { type: 'mcq', question: 'How can pathogens spread to a poultry farm?', options: ['Only through sick birds', 'Through contaminated feed, water, and equipment', 'Only through the air', 'It is not possible for them to spread'], correctAnswer: 'Through contaminated feed, water, and equipment' },
            { type: 'mcq', question: 'What is a key reason for having a visitor log on a farm?', options: ['To be friendly', 'To track who has been on the farm, as people can carry diseases', 'For marketing purposes', 'To count the number of visitors per day'], correctAnswer: 'To track who has been on the farm, as people can carry diseases' },
            // MSQs
            { type: 'msq', question: 'A good biosecurity plan includes which of the following? (Select all that apply)', options: ['Controlled entry', 'Footbaths', 'Vehicle disinfection', 'Allowing pets to roam freely in the sheds'], correctAnswer: ['Controlled entry', 'Footbaths', 'Vehicle disinfection'] },
            { type: 'msq', question: 'Which of the following are important for preventing disease spread? (Select all that apply)', options: ['Quarantine procedures for new birds', 'Rodent control', 'Water sanitation', 'Sharing equipment with neighboring farms without cleaning'], correctAnswer: ['Quarantine procedures for new birds', 'Rodent control', 'Water sanitation'] },
            { type: 'msq', question: 'In case of a disease outbreak, biosecurity protocols include: (Select all that apply)', options: ['Proper disposal of carcasses', 'Thorough disinfection', 'Reporting to authorities', 'Selling the sick birds quickly'], correctAnswer: ['Proper disposal of carcasses', 'Thorough disinfection', 'Reporting to authorities'] },
          ]
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'A chicken raised primarily for meat production is called a:', options: ['Layer', 'Broiler', 'Pullet', 'Backyard bird'], correctAnswer: 'Broiler' },
        { type: 'mcq', question: 'A low Feed Conversion Ratio (FCR) indicates:', options: ['The bird is sick', 'The bird is inefficient at converting feed to meat/eggs', 'The bird is very efficient at converting feed to meat/eggs', 'The feed is of poor quality'], correctAnswer: 'The bird is very efficient at converting feed to meat/eggs' },
        { type: 'mcq', question: 'Ranikhet (Newcastle Disease) is a major _______ disease in poultry.', options: ['Bacterial', 'Fungal', 'Nutritional', 'Viral'], correctAnswer: 'Viral' },
        { type: 'mcq', question: 'What is the most fundamental and critical measure for preventing disease outbreaks in a poultry farm?', options: ['High-quality feed', 'A strict biosecurity plan', 'Good genetics', 'Daily vaccination'], correctAnswer: 'A strict biosecurity plan' },
        { type: 'mcq', question: 'A "starter" feed is specially formulated for:', options: ['Laying hens', 'Old roosters', 'Newly hatched chicks', 'Birds ready for market'], correctAnswer: 'Newly hatched chicks' },
        { type: 'mcq', question: 'What does maintaining a "cold chain" refer to in poultry health?', options: ['Keeping the poultry shed cool', 'Keeping vaccines at the correct, consistent low temperature', 'A type of respiratory disease', 'A method of watering birds'], correctAnswer: 'Keeping vaccines at the correct, consistent low temperature' },
        { type: 'mcq', question: 'High ammonia levels in a poultry shed are often a result of:', options: ['Good ventilation', 'Poor litter management', 'Low stocking density', 'Using the correct feed'], correctAnswer: 'Poor litter management' },
        { type: 'mcq', question: 'Dividing a farm into "clean" and "dirty" zones is a biosecurity practice known as:', options: ['Quarantine', 'Vaccination', 'Zoning', 'Disinfection'], correctAnswer: 'Zoning' },
        // MSQs
        { type: 'msq', question: 'A comprehensive biosecurity plan for a poultry farm should include: (Select all that apply)', options: ['Footbaths at all entrances', 'A visitor log', 'Rodent control program', 'Allowing stray dogs and cats in the sheds'], correctAnswer: ['Footbaths at all entrances', 'A visitor log', 'Rodent control program'] },
        { type: 'msq', question: 'Which of the following are important considerations for a scientific poultry housing system? (Select all that apply)', options: ['Proper ventilation', 'Correct stocking density', 'Temperature regulation', 'Using mud flooring'], correctAnswer: ['Proper ventilation', 'Correct stocking density', 'Temperature regulation'] },
        { type: 'msq', question: 'Which of the following are major viral diseases affecting poultry? (Select all that apply)', options: ['Marek\'s Disease', 'Fowl Cholera', 'Infectious Bursal Disease (IBD)', 'E. coli infection'], correctAnswer: ['Marek\'s Disease', 'Infectious Bursal Disease (IBD)'] },
        { type: 'msq', question: 'A balanced poultry ration provides the correct levels of: (Select all that apply)', options: ['Energy', 'Protein and amino acids', 'Vitamins and minerals', 'Antibiotics'], correctAnswer: ['Energy', 'Protein and amino acids', 'Vitamins and minerals'] },
        { type: 'msq', question: 'How can poultry vaccines be administered? (Select all that apply)', options: ['Via eye drops', 'Through drinking water', 'By injection', 'By mixing with daily feed'], correctAnswer: ['Via eye drops', 'Through drinking water', 'By injection'] },
      ]
    },
    // Certification 5: AI Technician
    {
      id: 'vet_cert_5',
      titleKey: 'vet_cert_5',
      modules: [
        {
          id: 'v5m1',
          titleKey: 'vet_cert_5_mod_1',
          content: `This module introduces learners to the reproductive systems of cattle and buffaloes, providing a scientific foundation for artificial insemination. Students study the anatomy of the **uterus, ovaries, oviducts, cervix, and vagina**. 
          
The module explains the **estrous cycle phases**—proestrus, estrus, metestrus, and diestrus—and hormonal influences. **Heat detection** is given special importance, with learners studying visual signs (bellowing, mounting, restlessness), secondary indicators (swollen vulva, mucus discharge), and tools such as pedometers and tail chalk. Students learn the optimal timing for insemination based on **AM-PM rules** and behavioral observation. Common reproductive abnormalities such as anestrus, silent heat, cystic ovaries, and repeat breeding are discussed. By the end, learners understand the biological principles behind reproduction and develop strong heat detection skills essential for successful AI.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Which organ is NOT part of the female bovine reproductive tract?', options: ['Uterus', 'Ovary', 'Cervix', 'Testes'], correctAnswer: 'Testes' },
            { type: 'mcq', question: 'The phase of the estrous cycle when the female is receptive to mating (standing heat) is called:', options: ['Proestrus', 'Estrus', 'Metestrus', 'Diestrus'], correctAnswer: 'Estrus' },
            { type: 'mcq', question: 'Which of the following is a primary visual sign of heat in cattle?', options: ['Lying down quietly', 'Standing to be mounted by other cows', 'Eating hay', 'Drinking water'], correctAnswer: 'Standing to be mounted by other cows' },
            { type: 'mcq', question: 'What is the AM-PM rule in AI?', options: ['A rule for feeding animals', 'A guideline for the best time to inseminate based on when heat was observed', 'A rule for when to clean the barn', 'A type of government regulation'], correctAnswer: 'A guideline for the best time to inseminate based on when heat was observed' },
            { type: 'mcq', question: 'Anestrus is a condition where the animal:', options: ['Is in constant heat', 'Does not show signs of heat/cycling', 'Is pregnant', 'Has just given birth'], correctAnswer: 'Does not show signs of heat/cycling' },
            // MSQs
            { type: 'msq', question: 'The estrous cycle in cattle includes which phases? (Select all that apply)', options: ['Estrus', 'Metestrus', 'Lactation', 'Diestrus'], correctAnswer: ['Estrus', 'Metestrus', 'Diestrus'] },
            { type: 'msq', question: 'Tools and methods for heat detection include: (Select all that apply)', options: ['Visual observation of behavior', 'Tail chalk', 'Pedometers', 'A thermometer'], correctAnswer: ['Visual observation of behavior', 'Tail chalk', 'Pedometers'] },
            { type: 'msq', question: 'Common reproductive abnormalities discussed are: (Select all that apply)', options: ['Silent heat', 'Cystic ovaries', 'Repeat breeding', 'High milk yield'], correctAnswer: ['Silent heat', 'Cystic ovaries', 'Repeat breeding'] },
          ]
        },
        {
          id: 'v5m2',
          titleKey: 'vet_cert_5_mod_2',
          content: `This module provides in-depth training on semen technology used in AI programs. Learners begin with semen collection methods—**artificial vagina (AV) technique** and electro-ejaculation. The module explains semen evaluation parameters such as **motility, morphology, and concentration** using microscopes. 
          
Students explore semen processing steps including dilution with extenders, antibiotic addition, cooling, glycerolization, and **cryopreservation**. Detailed instruction is provided on straw filling, sealing, printing, and storage in **liquid nitrogen tanks at –196°C**. Emphasis is placed on cold chain maintenance to ensure sperm viability. Learners are trained on safe handling of LN₂ containers, retrieval of semen straws, and precautions to avoid thermal shock. Contamination control, hygiene standards, and equipment sterilization are also covered. By the end, learners understand how semen is produced, stored, and prepared for artificial insemination, ensuring high conception rates.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is the most common method for semen collection from trained bulls?', options: ['Electro-ejaculation', 'Artificial Vagina (AV) technique', 'Manual massage', 'Surgical extraction'], correctAnswer: 'Artificial Vagina (AV) technique' },
            { type: 'mcq', question: 'What does "motility" refer to in semen evaluation?', options: ['The shape of the sperm', 'The number of sperm', 'The percentage of sperm that are moving progressively', 'The color of the semen'], correctAnswer: 'The percentage of sperm that are moving progressively' },
            { type: 'mcq', question: 'At what temperature are semen straws stored in liquid nitrogen tanks?', options: ['0°C', '-20°C', '-70°C', '-196°C'], correctAnswer: '-196°C' },
            { type: 'mcq', question: 'What is cryopreservation?', options: ['A method of semen collection', 'The process of preserving biological material at very low temperatures', 'A type of semen extender', 'A cleaning technique'], correctAnswer: 'The process of preserving biological material at very low temperatures' },
            { type: 'mcq', question: 'What is the purpose of an "extender" in semen processing?', options: ['To evaluate motility', 'To dilute the semen and provide nutrients to the sperm', 'To freeze the semen instantly', 'To clean the collection equipment'], correctAnswer: 'To dilute the semen and provide nutrients to the sperm' },
            // MSQs
            { type: 'msq', question: 'Semen evaluation parameters include: (Select all that apply)', options: ['Motility', 'Morphology', 'Concentration', 'Temperature'], correctAnswer: ['Motility', 'Morphology', 'Concentration'] },
            { type: 'msq', question: 'The process of preserving semen for AI involves: (Select all that apply)', options: ['Dilution', 'Cooling', 'Cryopreservation in liquid nitrogen', 'Heating'], correctAnswer: ['Dilution', 'Cooling', 'Cryopreservation in liquid nitrogen'] },
            { type: 'msq', question: 'Safe handling of frozen semen requires: (Select all that apply)', options: ['Maintaining the cold chain', 'Avoiding thermal shock to straws', 'Using proper safety gear with liquid nitrogen', 'Thawing and refreezing straws multiple times'], correctAnswer: ['Maintaining the cold chain', 'Avoiding thermal shock to straws', 'Using proper safety gear with liquid nitrogen'] },
          ]
        },
        {
          id: 'v5m3',
          titleKey: 'vet_cert_5_mod_3',
          content: `This module focuses on developing hands-on AI skills through simulation and field-level practice. Learners study the **recto-vaginal insemination technique**, which involves guiding the insemination gun through the cervix while manipulating reproductive organs per rectum. 
          
The module explains step-by-step procedures—**thawing semen straws, loading the AI gun, maintaining hygiene, restraining animals, and proper deposition of semen at the uterine body**. Students practice identifying cervix rings, positioning the gun accurately, and minimizing stress to animals. Equipment training covers AI guns, sheaths, straw cutters, and thawing units. Learners also study insemination timing, common errors (cervical misplacement, semen leakage), and troubleshooting low conception rates. Real-life case scenarios are used to teach problem-solving, including insemination in difficult animals, postpartum cows, and heifers. By the end, students gain confidence in performing safe, hygienic, and effective AI procedures.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is the standard technique for AI in cattle taught in this module?', options: ['Vaginal deposition', 'Surgical insemination', 'Recto-vaginal insemination', 'Intramuscular injection'], correctAnswer: 'Recto-vaginal insemination' },
            { type: 'mcq', question: 'Where should the semen be deposited for the highest conception rate?', options: ['In the vagina', 'In the middle of the cervix', 'In the uterine body, just past the cervix', 'In the rectum'], correctAnswer: 'In the uterine body, just past the cervix' },
            { type: 'mcq', question: 'What is a critical first step before loading the AI gun?', options: ['Cleaning the cow\'s back', 'Properly thawing the semen straw at the correct temperature and time', 'Preparing the bill for the farmer', 'Checking the animal\'s weight'], correctAnswer: 'Properly thawing the semen straw at the correct temperature and time' },
            { type: 'mcq', question: 'What is the purpose of manipulating the cervix per rectum during AI?', options: ['To calm the animal', 'To guide the AI gun through the cervical rings into the uterus', 'To check for pregnancy', 'To massage the animal'], correctAnswer: 'To guide the AI gun through the cervical rings into the uterus' },
            { type: 'mcq', question: 'Semen leakage after insemination is often a sign of:', options: ['A successful procedure', 'A common error, like improper gun placement', 'High fertility', 'A healthy animal'], correctAnswer: 'A common error, like improper gun placement' },
            // MSQs
            { type: 'msq', question: 'The step-by-step AI procedure includes: (Select all that apply)', options: ['Properly thawing the straw', 'Loading the AI gun hygienically', 'Depositing semen in the uterine body', 'Washing the entire animal'], correctAnswer: ['Properly thawing the straw', 'Loading the AI gun hygienically', 'Depositing semen in the uterine body'] },
            { type: 'msq', question: 'Equipment used for artificial insemination includes: (Select all that apply)', options: ['AI gun', 'Sheaths', 'Straw cutters', 'A microscope'], correctAnswer: ['AI gun', 'Sheaths', 'Straw cutters'] },
            { type: 'msq', question: 'To perform a successful AI, the technician must be skilled in: (Select all that apply)', options: ['Identifying the cervix rings', 'Positioning the gun accurately', 'Maintaining hygiene', 'Predicting the weather'], correctAnswer: ['Identifying the cervix rings', 'Positioning the gun accurately', 'Maintaining hygiene'] },
          ]
        },
        {
          id: 'v5m4',
          titleKey: 'vet_cert_5_mod_4',
          content: `This module integrates AI operations with herd management, pregnancy confirmation, and advisory services. Students learn methods of **pregnancy diagnosis**—**per rectal palpation, ultrasonography, and non-return rate analysis**. The module explains the importance of early pregnancy detection for planning calving and feeding. 
          
Learners study **reproductive record-keeping**, including heat cycles, insemination dates, bull identification, semen batch details, and calving intervals. Strong emphasis is placed on **communicating effectively with farmers**—educating them about heat detection, animal nutrition, postpartum care, and calf management. Students also learn field-level challenges such as handling aggressive animals, maintaining hygiene in remote areas, and coordinating with veterinarians. The module concludes with professional ethics, animal welfare guidelines, and safety protocols during AI practice. By the end, learners are prepared to deliver AI services confidently and help farmers improve reproductive efficiency.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Which method is NOT a form of pregnancy diagnosis in cattle?', options: ['Per rectal palpation', 'Ultrasonography', 'Observing appetite', 'Non-return rate analysis'], correctAnswer: 'Observing appetite' },
            { type: 'mcq', question: 'What is a "calving interval"?', options: ['The time between two calvings for a single cow', 'The time it takes for a calf to be born', 'The distance between calving pens', 'A type of record book'], correctAnswer: 'The time between two calvings for a single cow' },
            { type: 'mcq', question: 'Effective communication with farmers by an AI technician should include:', options: ['Only using technical terms', 'Education on heat detection and postpartum care', 'Never discussing nutrition', 'Only talking about the cost'], correctAnswer: 'Education on heat detection and postpartum care' },
            { type: 'mcq', question: 'Per rectal palpation is a skill used for:', options: ['Administering medicine', 'Checking feed quality', 'Pregnancy diagnosis and manipulating reproductive organs', 'Measuring body temperature'], correctAnswer: 'Pregnancy diagnosis and manipulating reproductive organs' },
            { type: 'mcq', question: 'Why is early pregnancy detection important?', options: ['It has no importance', 'For better planning of calving and feeding management', 'To sell the cow immediately', 'To change the cow\'s name'], correctAnswer: 'For better planning of calving and feeding management' },
            // MSQs
            { type: 'msq', question: 'What information should be included in reproductive record-keeping? (Select all that apply)', options: ['Insemination dates', 'Bull identification/semen batch', 'The weather on the day of AI', 'Calving intervals'], correctAnswer: ['Insemination dates', 'Bull identification/semen batch', 'Calving intervals'] },
            { type: 'msq', question: 'Field-level challenges for an AI technician can include: (Select all that apply)', options: ['Handling aggressive animals', 'Maintaining hygiene in remote areas', 'Farmers not detecting heat correctly', 'Having too much equipment'], correctAnswer: ['Handling aggressive animals', 'Maintaining hygiene in remote areas', 'Farmers not detecting heat correctly'] },
            { type: 'msq', question: 'Professional ethics for an AI technician involves: (Select all that apply)', options: ['Following animal welfare guidelines', 'Maintaining safety protocols', 'Using the same sheath for multiple cows to save money', 'Communicating honestly with farmers'], correctAnswer: ['Following animal welfare guidelines', 'Maintaining safety protocols', 'Communicating honestly with farmers'] },
          ]
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'The stage of the estrous cycle where a cow will stand to be mounted is called:', options: ['Proestrus', 'Estrus', 'Metestrus', 'Anestrus'], correctAnswer: 'Estrus' },
        { type: 'mcq', question: 'For optimal results, frozen semen straws should be thawed at:', options: ['Room temperature for 5 minutes', '35-37°C for at least 30 seconds', 'In the technician\'s pocket', 'In cold water'], correctAnswer: '35-37°C for at least 30 seconds' },
        { type: 'mcq', question: 'What is the correct site for semen deposition during AI in cattle?', options: ['The vagina', 'The middle of the cervix', 'The uterine body', 'The ovaries'], correctAnswer: 'The uterine body' },
        { type: 'mcq', question: 'Which is NOT a reliable sign of heat in cattle?', options: ['Mounting other cows', 'Clear mucus discharge from the vulva', 'Swishing her tail', 'Standing to be mounted'], correctAnswer: 'Swishing her tail' },
        { type: 'mcq', question: 'Cryopreservation of semen involves storing it in:', options: ['A regular freezer', 'A refrigerator', 'Liquid nitrogen', 'A cool, dry place'], correctAnswer: 'Liquid nitrogen' },
        { type: 'mcq', question: 'Per rectal palpation can be used for:', options: ['Only AI', 'Only pregnancy diagnosis', 'Both AI and pregnancy diagnosis', 'Neither AI nor pregnancy diagnosis'], correctAnswer: 'Both AI and pregnancy diagnosis' },
        { type: 'mcq', question: 'The AM-PM rule is a guideline for:', options: ['Feeding times', 'Milking times', 'The timing of artificial insemination', 'When to let cows out to pasture'], correctAnswer: 'The timing of artificial insemination' },
        { type: 'mcq', question: 'What is a major component of semen extenders?', options: ['Antibiotics and nutrients', 'Only water', 'Hormones', 'Salt'], correctAnswer: 'Antibiotics and nutrients' },
        // MSQs
        { type: 'msq', question: 'What are the key parameters checked during semen evaluation? (Select all that apply)', options: ['Sperm motility', 'Sperm morphology', 'Sperm concentration', 'Semen color'], correctAnswer: ['Sperm motility', 'Sperm morphology', 'Sperm concentration'] },
        { type: 'msq', question: 'Successful artificial insemination requires: (Select all that apply)', options: ['Accurate heat detection', 'Correct insemination technique', 'High-quality semen', 'The cow to be perfectly clean'], correctAnswer: ['Accurate heat detection', 'Correct insemination technique', 'High-quality semen'] },
        { type: 'msq', question: 'Which of these are methods for pregnancy diagnosis in cattle? (Select all that apply)', options: ['Per rectal palpation', 'Ultrasonography', 'Observing for a return to heat (non-return rate)', 'Checking the milk production'], correctAnswer: ['Per rectal palpation', 'Ultrasonography', 'Observing for a return to heat (non-return rate)'] },
        { type: 'msq', question: 'What information is crucial for reproductive record-keeping? (Select all that apply)', options: ['Date of heat', 'Date of insemination', 'Bull ID used', 'Cow\'s favorite pasture'], correctAnswer: ['Date of heat', 'Date of insemination', 'Bull ID used'] },
        { type: 'msq', question: 'Common reasons for low conception rates after AI include: (Select all that apply)', options: ['Incorrect timing of insemination', 'Poor semen handling', 'Poor insemination technique', 'The cow being too friendly'], correctAnswer: ['Incorrect timing of insemination', 'Poor semen handling', 'Poor insemination technique'] },
      ]
    },
    // Certification 6: Veterinary Diagnostics
    {
      id: 'vet_cert_6',
      titleKey: 'vet_cert_6',
      modules: [
        {
          id: 'v6m1',
          titleKey: 'vet_cert_6_mod_1',
          content: `This module introduces the principles of clinical diagnosis, emphasizing a systematic approach to identifying disease. Learners study how to take a detailed **clinical history**—including signalment, herd history, diet, and environment. 
          
The module provides in-depth training on **physical examination**: observing demeanor, posture, gait, body condition, and vital signs (temperature, pulse, respiration). Students learn region-specific examination of the head, neck, thorax, abdomen, and limbs. The module explains how auscultation, palpation, percussion, and inspection help identify abnormalities. Learners are also introduced to differential diagnosis, problem-oriented medical records (POMR), and the importance of a logical diagnostic workflow. By the end, participants understand how a thorough history and physical exam form the foundation of an accurate diagnosis.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What does "signalment" in a clinical history refer to?', options: ['The animal\'s vital signs', 'The owner\'s name and address', 'The animal\'s species, breed, age, and sex', 'The primary complaint'], correctAnswer: 'The animal\'s species, breed, age, and sex' },
            { type: 'mcq', question: 'Auscultation is the process of:', options: ['Tapping on the body to assess density', 'Feeling the body with the hands', 'Listening to sounds from the heart, lungs, or other organs', 'Visually inspecting the animal'], correctAnswer: 'Listening to sounds from the heart, lungs, or other organs' },
            { type: 'mcq', question: 'What is a "differential diagnosis"?', options: ['The final, confirmed diagnosis', 'A list of possible diseases that could be causing the symptoms', 'A diagnosis that is different from the owner\'s opinion', 'A type of blood test'], correctAnswer: 'A list of possible diseases that could be causing the symptoms' },
            { type: 'mcq', question: 'The "P" in POMR (Problem-Oriented Medical Record) stands for:', options: ['Patient', 'Problem', 'Procedure', 'Prescription'], correctAnswer: 'Problem' },
            { type: 'mcq', question: 'Which of these is considered a vital sign?', options: ['Coat color', 'Body condition score', 'Respiration rate', 'Breed'], correctAnswer: 'Respiration rate' },
            // MSQs
            { type: 'msq', question: 'A thorough physical examination includes: (Select all that apply)', options: ['Observing demeanor and posture', 'Checking vital signs', 'Palpation of the abdomen', 'Asking the owner about payment'], correctAnswer: ['Observing demeanor and posture', 'Checking vital signs', 'Palpation of the abdomen'] },
            { type: 'msq', question: 'Taking a good clinical history involves asking about: (Select all that apply)', options: ['Diet', 'Environment', 'Herd history', 'The animal\'s favorite toy'], correctAnswer: ['Diet', 'Environment', 'Herd history'] },
            { type: 'msq', question: 'The four main techniques of physical examination are: (Select all that apply)', options: ['Inspection', 'Palpation', 'Auscultation', 'Insemination'], correctAnswer: ['Inspection', 'Palpation', 'Auscultation'] },
          ]
        },
        {
          id: 'v6m2',
          titleKey: 'vet_cert_6_mod_2',
          content: `This module covers the collection, handling, and interpretation of laboratory samples. Learners study **hematology**, including how to interpret a **Complete Blood Count (CBC)** to identify anemia, infection, or inflammation. 
          
**Biochemistry profiles** are explained, focusing on liver enzymes, kidney function tests (BUN, creatinine), and electrolytes. The module also details **urinalysis** (physical, chemical, microscopic) and **fecal examination** for detecting parasites. Students learn practical skills like blood smear preparation, staining techniques, and basic cytology. The importance of proper sample labeling, storage, and transport is emphasized to ensure accurate results. By the end, learners can confidently select appropriate lab tests and interpret the results to support their clinical findings.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What does a Complete Blood Count (CBC) primarily analyze?', options: ['Urine', 'Blood cells (red, white, platelets)', 'Feces', 'Tissue samples'], correctAnswer: 'Blood cells (red, white, platelets)' },
            { type: 'mcq', question: 'BUN and creatinine levels in a biochemistry profile are key indicators of:', options: ['Liver function', 'Heart health', 'Kidney function', 'Blood sugar'], correctAnswer: 'Kidney function' },
            { type: 'mcq', question: 'A fecal examination is most commonly used to detect:', options: ['Viruses', 'Bacteria', 'Internal parasites', 'Nutritional deficiencies'], correctAnswer: 'Internal parasites' },
            { type: 'mcq', question: 'What is cytology?', options: ['The study of blood', 'The study of cells under a microscope', 'The study of urine', 'The study of parasites'], correctAnswer: 'The study of cells under a microscope' },
            { type: 'mcq', question: 'A high white blood cell count in a CBC often suggests:', options: ['Anemia', 'Dehydration', 'An infection or inflammation', 'A healthy animal'], correctAnswer: 'An infection or inflammation' },
            // MSQs
            { type: 'msq', question: 'A biochemistry profile can provide information about which organs? (Select all that apply)', options: ['Liver', 'Kidneys', 'Bones', 'Pancreas (via glucose/amylase)'], correctAnswer: ['Liver', 'Kidneys', 'Pancreas (via glucose/amylase)'] },
            { type: 'msq', question: 'A standard urinalysis involves which components? (Select all that apply)', options: ['Physical examination (color, clarity)', 'Chemical analysis (dipstick)', 'Microscopic examination of sediment', 'A taste test'], correctAnswer: ['Physical examination (color, clarity)', 'Chemical analysis (dipstick)', 'Microscopic examination of sediment'] },
            { type: 'msq', question: 'Proper sample handling is critical and includes: (Select all that apply)', options: ['Accurate labeling', 'Correct storage temperature', 'Using the right collection tube/container', 'Leaving the sample in the sun'], correctAnswer: ['Accurate labeling', 'Correct storage temperature', 'Using the right collection tube/container'] },
          ]
        },
        {
          id: 'v6m3',
          titleKey: 'vet_cert_6_mod_3',
          content: `This module introduces the principles and applications of diagnostic imaging in veterinary medicine. It begins with **radiography (X-rays)**, covering radiation safety, patient positioning, and the concepts of radiodensity. Learners study how to interpret radiographs to identify **fractures, foreign bodies, organ size changes, and fluid accumulation**. 
          
The module then moves to **ultrasonography**, explaining how sound waves are used to visualize soft tissues in real-time. Students learn the basics of probe selection, image orientation, and identifying normal versus abnormal organ structures. Common applications such as pregnancy diagnosis, evaluating abdominal organs, and guided sample collection are discussed. The module briefly touches upon advanced imaging like CT and MRI. By the end, learners understand when to use different imaging modalities and can interpret basic findings.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'Which imaging technique is best for visualizing bones and identifying fractures?', options: ['Ultrasonography', 'Radiography (X-ray)', 'MRI', 'CT Scan'], correctAnswer: 'Radiography (X-ray)' },
            { type: 'mcq', question: 'What is a key principle of radiation safety in radiography?', options: ['Standing as close as possible to the beam', 'Using protective gear like lead aprons', 'Taking as many X-rays as possible', 'Holding the animal with bare hands'], correctAnswer: 'Using protective gear like lead aprons' },
            { type: 'mcq', question: 'Ultrasonography is most useful for examining:', options: ['Bones', 'Lungs', 'Soft tissues and organs', 'Teeth'], correctAnswer: 'Soft tissues and organs' },
            { type: 'mcq', question: 'Which is a common application of ultrasound in large animal practice?', options: ['Diagnosing a broken leg', 'Pregnancy diagnosis', 'Checking for skin parasites', 'Measuring body temperature'], correctAnswer: 'Pregnancy diagnosis' },
            { type: 'mcq', question: 'A metallic foreign body in the stomach would appear what color on a standard radiograph?', options: ['Black', 'Grey', 'Bright white (radiopaque)', 'Invisible'], correctAnswer: 'Bright white (radiopaque)' },
            // MSQs
            { type: 'msq', question: 'Radiographs can be used to identify which of the following? (Select all that apply)', options: ['Fractures', 'Changes in organ size', 'Foreign bodies', 'A viral infection'], correctAnswer: ['Fractures', 'Changes in organ size', 'Foreign bodies'] },
            { type: 'msq', question: 'Ultrasonography has which advantages? (Select all that apply)', options: ['It uses no ionizing radiation', 'It provides real-time images', 'It is excellent for viewing soft tissues', 'It is the best method for diagnosing lung disease'], correctAnswer: ['It uses no ionizing radiation', 'It provides real-time images', 'It is excellent for viewing soft tissues'] },
            { type: 'msq', question: 'Proper radiographic technique involves: (Select all that apply)', options: ['Correct patient positioning', 'Using the appropriate exposure settings', 'Radiation safety measures', 'Using the oldest equipment available'], correctAnswer: ['Correct patient positioning', 'Using the appropriate exposure settings', 'Radiation safety measures'] },
          ]
        },
        {
          id: 'v6m4',
          titleKey: 'vet_cert_6_mod_4',
          content: `This final module teaches how to integrate all diagnostic information to arrive at a diagnosis and create a treatment plan. It emphasizes **critical thinking** and the process of narrowing down a list of differential diagnoses using test results. Learners study how to communicate diagnostic findings effectively to clients, explaining complex information in simple terms. 
          
The module covers the basics of **therapeutic planning**, including choosing appropriate medications, calculating dosages, and selecting supportive care. Students also learn the importance of writing clear, accurate, and legally sound **medical records and reports**. The module concludes with a discussion on when to refer a case to a specialist and the ethics of diagnostic testing. By the end, learners can formulate a coherent diagnostic and therapeutic plan from initial presentation to final outcome.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'After performing tests, what is the next logical step in the diagnostic process?', options: ['Start a random treatment', 'Integrate all findings to narrow down the differential diagnoses', 'Tell the owner there is no hope', 'Repeat all the tests'], correctAnswer: 'Integrate all findings to narrow down the differential diagnoses' },
            { type: 'mcq', question: 'When communicating with a client, it is best to:', options: ['Use as much technical jargon as possible', 'Explain findings in simple, understandable terms', 'Only talk about the cost', 'Avoid giving a diagnosis'], correctAnswer: 'Explain findings in simple, understandable terms' },
            { type: 'mcq', question: 'What is a crucial part of therapeutic planning?', options: ['Choosing the most expensive medication', 'Calculating the correct dosage', 'Guessing the duration of treatment', 'Using expired drugs'], correctAnswer: 'Calculating the correct dosage' },
            { type: 'mcq', question: 'Why are accurate medical records important?', options: ['They are not important', 'For legal documentation and continuity of care', 'Only for billing purposes', 'To practice handwriting'], correctAnswer: 'For legal documentation and continuity of care' },
            { type: 'mcq', question: 'When should a veterinarian consider referring a case?', options: ['Never, they should handle everything themselves', 'When the case requires specialized equipment or expertise they do not have', 'Only for non-paying clients', 'For every simple case'], correctAnswer: 'When the case requires specialized equipment or expertise they do not have' },
            // MSQs
            { type: 'msq', question: 'A good treatment plan should include: (Select all that apply)', options: ['The chosen medication', 'The correct dosage and frequency', 'Supportive care recommendations', 'A guarantee of success'], correctAnswer: ['The chosen medication', 'The correct dosage and frequency', 'Supportive care recommendations'] },
            { type: 'msq', question: 'The final steps of the diagnostic process involve: (Select all that apply)', options: ['Interpreting all test results', 'Formulating a final diagnosis', 'Creating a treatment plan', 'Ignoring the physical exam findings'], correctAnswer: ['Interpreting all test results', 'Formulating a final diagnosis', 'Creating a treatment plan'] },
            { type: 'msq', question: 'Well-written medical records are important for: (Select all that apply)', options: ['Legal protection', 'Ensuring other vets can understand the case history', 'Tracking the patient\'s progress', 'Impressing the client with long words'], correctAnswer: ['Legal protection', 'Ensuring other vets can understand the case history', 'Tracking the patient\'s progress'] },
          ]
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'The first step in any diagnostic workup is:', options: ['Taking an X-ray', 'Running a blood test', 'Taking a thorough clinical history and performing a physical exam', 'Administering antibiotics'], correctAnswer: 'Taking a thorough clinical history and performing a physical exam' },
        { type: 'mcq', question: 'A Complete Blood Count (CBC) is used to evaluate:', options: ['Kidney function', 'Liver enzymes', 'Blood cells', 'Urine concentration'], correctAnswer: 'Blood cells' },
        { type: 'mcq', question: 'Which imaging modality uses sound waves to create an image?', options: ['Radiography (X-ray)', 'CT Scan', 'MRI', 'Ultrasonography'], correctAnswer: 'Ultrasonography' },
        { type: 'mcq', question: 'A list of possible causes for a set of clinical signs is called:', options: ['A treatment plan', 'A final diagnosis', 'A differential diagnosis', 'A prognosis'], correctAnswer: 'A differential diagnosis' },
        { type: 'mcq', question: 'Auscultation is the technique of:', options: ['Feeling with hands', 'Tapping on the body', 'Listening with a stethoscope', 'Visual observation'], correctAnswer: 'Listening with a stethoscope' },
        { type: 'mcq', question: 'Which test is most useful for detecting internal parasites like roundworms?', options: ['Urinalysis', 'CBC', 'Biochemistry profile', 'Fecal examination'], correctAnswer: 'Fecal examination' },
        { type: 'mcq', question: 'The term "radiopaque" on an X-ray means the object is:', options: ['Easily penetrated by X-rays and appears black', 'Difficult to penetrate by X-rays and appears white', 'Invisible on the X-ray', 'Blurry'], correctAnswer: 'Difficult to penetrate by X-rays and appears white' },
        { type: 'mcq', question: 'When is it appropriate to refer a case to a specialist?', options: ['Only when the client requests it', 'When the case is beyond your expertise or equipment capabilities', 'For all surgical cases', 'Never'], correctAnswer: 'When the case is beyond your expertise or equipment capabilities' },
        // MSQs
        { type: 'msq', question: 'A standard physical examination includes the assessment of: (Select all that apply)', options: ['Vital signs (temp, pulse, respiration)', 'Body condition score', 'Gait and posture', 'The owner\'s financial status'], correctAnswer: ['Vital signs (temp, pulse, respiration)', 'Body condition score', 'Gait and posture'] },
        { type: 'msq', question: 'Which of these are important components of a good medical record? (Select all that apply)', options: ['Patient signalment', 'Clinical findings', 'Treatment administered', 'The veterinarian\'s personal opinions about the client'], correctAnswer: ['Patient signalment', 'Clinical findings', 'Treatment administered'] },
        { type: 'msq', question: 'Diagnostic imaging can be used for: (Select all that apply)', options: ['Diagnosing fractures', 'Performing pregnancy checks', 'Evaluating heart size and shape', 'Measuring blood sugar'], correctAnswer: ['Diagnosing fractures', 'Performing pregnancy checks', 'Evaluating heart size and shape'] },
        { type: 'msq', question: 'A laboratory request form should always include: (Select all that apply)', options: ['Patient identification', 'Sample type and collection time', 'A brief clinical history', 'The expected result'], correctAnswer: ['Patient identification', 'Sample type and collection time', 'A brief clinical history'] },
        { type: 'msq', question: 'Interpreting diagnostic results requires considering: (Select all that apply)', options: ['The clinical history', 'The physical exam findings', 'The reference ranges for that species', 'The cost of the test'], correctAnswer: ['The clinical history', 'The physical exam findings', 'The reference ranges for that species'] },
      ]
    },
    // Certification 7: Clinic Management
    {
      id: 'vet_cert_7',
      titleKey: 'vet_cert_7',
      modules: [
        {
          id: 'v7m1',
          titleKey: 'vet_cert_7_mod_1',
          content: `This module focuses on the principles of designing and managing an efficient veterinary clinic or hospital. Learners study **clinic layout planning**, including reception areas, consultation rooms, pharmacies, laboratories, surgical suites, and recovery wards. 
          
The module explains how to optimize workflow, ensure patient safety, and maintain a sterile environment. Topics include equipment selection, maintenance schedules, biosecurity protocols, and waste management. Students explore the importance of creating a client-friendly atmosphere and managing patient flow to reduce waiting times. By the end, learners can design a functional clinic layout that meets regulatory standards and enhances service delivery.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is a key consideration when planning a clinic layout?', options: ['Making it as small as possible', 'Optimizing workflow and patient safety', 'Using the brightest colors', 'Having only one room for everything'], correctAnswer: 'Optimizing workflow and patient safety' },
            { type: 'mcq', question: 'Which of these is a distinct area in a well-designed veterinary hospital?', options: ['The parking lot', 'A surgical suite', 'The front door', 'The roof'], correctAnswer: 'A surgical suite' },
            { type: 'mcq', question: 'Why is a separate recovery ward important?', options: ['To provide a quiet, monitored space for post-operative patients', 'It is a storage room', 'It is where clients wait', 'It is not important'], correctAnswer: 'To provide a quiet, monitored space for post-operative patients' },
            { type: 'mcq', question: 'Effective waste management in a clinic is crucial for:', options: ['Saving money', 'Biosecurity and public health', 'Aesthetics only', 'Attracting more clients'], correctAnswer: 'Biosecurity and public health' },
            { type: 'mcq', question: 'Good patient flow management helps to:', options: ['Increase waiting times', 'Reduce waiting times and improve client experience', 'Confuse clients', 'Make the clinic look busy'], correctAnswer: 'Reduce waiting times and improve client experience' },
            // MSQs
            { type: 'msq', question: 'A functional clinic layout plan includes which areas? (Select all that apply)', options: ['Consultation rooms', 'Pharmacy', 'Surgical suite', 'A playground'], correctAnswer: ['Consultation rooms', 'Pharmacy', 'Surgical suite'] },
            { type: 'msq', question: 'Good hospital management involves: (Select all that apply)', options: ['Regular equipment maintenance', 'Strict biosecurity protocols', 'Proper waste management', 'Using equipment until it breaks'], correctAnswer: ['Regular equipment maintenance', 'Strict biosecurity protocols', 'Proper waste management'] },
            { type: 'msq', question: 'What are the benefits of an optimized clinic workflow? (Select all that apply)', options: ['Increased efficiency', 'Enhanced patient safety', 'Improved staff satisfaction', 'Longer working hours'], correctAnswer: ['Increased efficiency', 'Enhanced patient safety', 'Improved staff satisfaction'] },
          ]
        },
        {
          id: 'v7m2',
          titleKey: 'vet_cert_7_mod_2',
          content: `This module covers the critical task of managing a veterinary pharmacy and its inventory. Learners study **inventory management techniques** like setting reorder points and using the FIFO (First-In, First-Out) principle to avoid expired drugs. The module explains the proper **storage of pharmaceuticals**, including temperature control, cold chain management for vaccines, and secure storage for controlled substances.
          
Students learn about dispensing medications, creating clear labels, explaining instructions to clients, and documenting all transactions. The module also covers sourcing from reputable suppliers, managing stock levels to balance availability with cost, and using software for inventory tracking. By the end, learners can manage a veterinary pharmacy efficiently, ensuring drug safety, efficacy, and regulatory compliance.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is the FIFO principle in inventory management?', options: ['Find It Fast Outside', 'First-In, First-Out', 'Fast-In, Fast-Out', 'For Internal Feline Orders'], correctAnswer: 'First-In, First-Out' },
            { type: 'mcq', question: 'Why is "cold chain management" important for vaccines?', options: ['It makes them cheaper', 'It ensures they remain effective by being kept at the correct temperature', 'It is a brand name', 'It helps in organizing them alphabetically'], correctAnswer: 'It ensures they remain effective by being kept at the correct temperature' },
            { type: 'mcq', question: 'What is a "reorder point"?', options: ['The time of day to place an order', 'The stock level at which a new order should be placed', 'The name of the supplier', 'A point on a map'], correctAnswer: 'The stock level at which a new order should be placed' },
            { type: 'mcq', question: 'Controlled substances require what kind of storage?', options: ['On an open shelf', 'Mixed with other drugs', 'Secure, locked storage with a detailed logbook', 'In the refrigerator'], correctAnswer: 'Secure, locked storage with a detailed logbook' },
            { type: 'mcq', question: 'A clear prescription label should always include:', options: ['The price of the drug', 'The patient\'s name, drug name, and clear dosage instructions', 'The vet\'s favorite color', 'A funny joke'], correctAnswer: 'The patient\'s name, drug name, and clear dosage instructions' },
            // MSQs
            { type: 'msq', question: 'Effective inventory management helps to: (Select all that apply)', options: ['Prevent drug expiry', 'Ensure medications are available when needed', 'Reduce financial waste', 'Increase the amount of expired stock'], correctAnswer: ['Prevent drug expiry', 'Ensure medications are available when needed', 'Reduce financial waste'] },
            { type: 'msq', question: 'Proper storage of pharmaceuticals involves: (Select all that apply)', options: ['Maintaining correct temperatures', 'Protecting from direct sunlight', 'Keeping them in a secure location', 'Storing all drugs in one big box'], correctAnswer: ['Maintaining correct temperatures', 'Protecting from direct sunlight', 'Keeping them in a secure location'] },
            { type: 'msq', question: 'When dispensing medication, a veterinarian must: (Select all that apply)', options: ['Create a clear label', 'Explain the instructions to the client', 'Document the transaction in the patient\'s record', 'Give the client a random amount'], correctAnswer: ['Create a clear label', 'Explain the instructions to the client', 'Document the transaction in the patient\'s record'] },
          ]
        },
        {
          id: 'v7m3',
          titleKey: 'vet_cert_7_mod_3',
          content: `This module focuses on the "soft skills" that are essential for a successful veterinary practice. Learners study the principles of **effective client communication**, including active listening, showing empathy, and building trust. The module covers how to take a good history, explain complex medical conditions in simple terms, and present treatment options clearly. 
          
Students learn strategies for handling **difficult conversations**, such as discussing costs, delivering bad news, and managing client complaints. The module also covers appointment scheduling, front-desk management, and creating a positive clinic experience from start to finish. The importance of follow-up calls and reminders in building client loyalty is also highlighted. By the end, learners will have the tools to provide excellent customer service, which leads to better patient care and a stronger business.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'What is "active listening" in a client consultation?', options: ['Thinking about what to say next while the client is talking', 'Paying full attention to the client and showing you understand', 'Interrupting the client frequently', 'Looking at your phone'], correctAnswer: 'Paying full attention to the client and showing you understand' },
            { type: 'mcq', question: 'When explaining a diagnosis, it is best to:', options: ['Use highly technical medical terms', 'Use simple language, analogies, and diagrams', 'Avoid giving a clear explanation', 'Rush through the explanation'], correctAnswer: 'Use simple language, analogies, and diagrams' },
            { type: 'mcq', question: 'When discussing treatment costs with a client, it is important to be:', options: ['Vague and unclear', 'Transparent and provide an estimate upfront', 'Apologetic about the cost', 'Dismissive of their concerns'], correctAnswer: 'Transparent and provide an estimate upfront' },
            { type: 'mcq', question: 'A key component of building client loyalty is:', options: ['Never contacting them after their visit', 'Effective communication and follow-up care', 'Offering the lowest prices', 'Having a fancy waiting room'], correctAnswer: 'Effective communication and follow-up care' },
            { type: 'mcq', question: 'Empathy in a veterinary context means:', options: ['Feeling sorry for the client', 'Understanding and sharing the feelings of the client', 'Being detached and clinical', 'Agreeing with everything the client says'], correctAnswer: 'Understanding and sharing the feelings of the client' },
            // MSQs
            { type: 'msq', question: 'Effective client communication involves which skills? (Select all that apply)', options: ['Active listening', 'Showing empathy', 'Explaining things clearly', 'Using confusing jargon'], correctAnswer: ['Active listening', 'Showing empathy', 'Explaining things clearly'] },
            { type: 'msq', question: 'Strategies for handling difficult conversations include: (Select all that apply)', options: ['Choosing a private, quiet space', 'Remaining calm and professional', 'Being prepared with all the facts', 'Arguing with the client'], correctAnswer: ['Choosing a private, quiet space', 'Remaining calm and professional', 'Being prepared with all the facts'] },
            { type: 'msq', question: 'A positive clinic experience is created by: (Select all that apply)', options: ['A welcoming and clean reception area', 'Friendly and helpful staff', 'Clear communication about waiting times', 'A long and confusing check-in process'], correctAnswer: ['A welcoming and clean reception area', 'Friendly and helpful staff', 'Clear communication about waiting times'] },
          ]
        },
        {
          id: 'v7m4',
          titleKey: 'vet_cert_7_mod_4',
          content: `This final module covers the business and legal aspects of running a veterinary practice. Learners are introduced to basic **financial management**, including setting service fees, billing, processing payments, and managing accounts receivable. The module explains how to read simple financial reports like a **Profit & Loss (P&L) statement**.
          
Students learn about **staff management**, including hiring, training, scheduling, and creating a positive team culture. The critical importance of **medical record-keeping** for legal protection and continuity of care is emphasized. The module also covers legal and ethical responsibilities, such as obtaining informed consent, maintaining patient confidentiality, and adhering to veterinary practice laws. By the end, learners will understand the key administrative duties required to run a compliant, profitable, and ethical veterinary clinic.`,
          test: [
            // MCQs
            { type: 'mcq', question: 'A Profit & Loss (P&L) statement summarizes a clinic\'s:', options: ['Inventory levels', 'Revenues and expenses over a period', 'Appointment schedule', 'Medical records'], correctAnswer: 'Revenues and expenses over a period' },
            { type: 'mcq', question: 'What is "informed consent" in a veterinary context?', options: ['The animal agrees to the treatment', 'The owner gives permission for a procedure after understanding the risks, benefits, and costs', 'The vet decides on the treatment without discussion', 'A form that is signed after the procedure'], correctAnswer: 'The owner gives permission for a procedure after understanding the risks, benefits, and costs' },
            { type: 'mcq', question: 'Why are detailed medical records legally important?', options: ['They are not legally important', 'They provide a legal document of the patient\'s care', 'They are only for billing', 'They are for the vet\'s personal use only'], correctAnswer: 'They provide a legal document of the patient\'s care' },
            { type: 'mcq', question: '"Accounts receivable" refers to:', options: ['Money the clinic owes to suppliers', 'The clinic\'s total profit', 'Money owed to the clinic by clients', 'The value of the clinic\'s equipment'], correctAnswer: 'Money owed to the clinic by clients' },
            { type: 'mcq', question: 'Good staff management is important for:', options: ['Creating a stressful work environment', 'High employee turnover', 'Providing consistent, high-quality patient care', 'Making the clinic less profitable'], correctAnswer: 'Providing consistent, high-quality patient care' },
            // MSQs
            { type: 'msq', question: 'Basic financial management for a clinic includes: (Select all that apply)', options: ['Setting fees for services', 'Billing clients correctly', 'Managing payments', 'Ignoring expenses'], correctAnswer: ['Setting fees for services', 'Billing clients correctly', 'Managing payments'] },
            { type: 'msq', question: 'Legal and ethical responsibilities for a veterinarian include: (Select all that apply)', options: ['Obtaining informed consent from clients', 'Maintaining patient confidentiality', 'Adhering to practice laws', 'Sharing client information publicly'], correctAnswer: ['Obtaining informed consent from clients', 'Maintaining patient confidentiality', 'Adhering to practice laws'] },
            { type: 'msq', question: 'Good medical records should be: (Select all that apply)', options: ['Legible and clear', 'Written in a timely manner', 'Detailed and accurate', 'Scribbled on a piece of scrap paper'], correctAnswer: ['Legible and clear', 'Written in a timely manner', 'Detailed and accurate'] },
          ]
        }
      ],
      finalExam: [
        // MCQs
        { type: 'mcq', question: 'Optimizing a clinic\'s workflow is a key part of:', options: ['Marketing', 'Client communication', 'Hospital setup and design', 'Pharmacy management'], correctAnswer: 'Hospital setup and design' },
        { type: 'mcq', question: 'The FIFO principle is used in inventory management to ensure:', options: ['The most expensive drugs are used first', 'The drugs that will expire soonest are used first', 'The newest drugs are used first', 'Drugs are used in a random order'], correctAnswer: 'The drugs that will expire soonest are used first' },
        { type: 'mcq', question: 'Which of the following is a critical "soft skill" for a veterinarian?', options: ['Surgical skill', 'Knowledge of pharmacology', 'Empathetic client communication', 'Ability to run lab tests'], correctAnswer: 'Empathetic client communication' },
        { type: 'mcq', question: 'A Profit & Loss (P&L) statement is a:', options: ['Medical record', 'Consent form', 'Financial report', 'Inventory log'], correctAnswer: 'Financial report' },
        { type: 'mcq', question: 'Why is a separate surgical suite important in a clinic design?', options: ['It provides a good view', 'It is a quiet place for staff to take breaks', 'To maintain a sterile environment for surgery', 'It is used for storing equipment'], correctAnswer: 'To maintain a sterile environment for surgery' },
        { type: 'mcq', question: 'Secure, locked storage and a detailed logbook are required for:', options: ['All medications', 'Vaccines', 'Controlled substances', 'Cleaning supplies'], correctAnswer: 'Controlled substances' },
        { type: 'mcq', question: 'Discussing treatment options, risks, and costs before a procedure is part of:', options: ['Billing', 'Inventory management', 'Obtaining informed consent', 'Writing medical records'], correctAnswer: 'Obtaining informed consent' },
        { type: 'mcq', question: 'Managing "accounts receivable" involves:', options: ['Paying clinic bills', 'Tracking and collecting payments owed by clients', 'Ordering new inventory', 'Scheduling staff'], correctAnswer: 'Tracking and collecting payments owed by clients' },
        // MSQs
        { type: 'msq', question: 'A well-managed veterinary practice requires attention to: (Select all that apply)', options: ['Clinic workflow and design', 'Inventory and pharmacy management', 'Client communication', 'The vet\'s personal hobbies'], correctAnswer: ['Clinic workflow and design', 'Inventory and pharmacy management', 'Client communication'] },
        { type: 'msq', question: 'Legal and ethical obligations in veterinary medicine include: (Select all that apply)', options: ['Maintaining accurate medical records', 'Patient confidentiality', 'Obtaining informed consent', 'Guaranteeing a cure for every patient'], correctAnswer: ['Maintaining accurate medical records', 'Patient confidentiality', 'Obtaining informed consent'] },
        { type: 'msq', question: 'Which elements are crucial for a positive client experience? (Select all that apply)', options: ['A clean and welcoming environment', 'Clear and empathetic communication from staff', 'Transparent billing', 'Long waiting times'], correctAnswer: ['A clean and welcoming environment', 'Clear and empathetic communication from staff', 'Transparent billing'] },
        { type: 'msq', question: 'Proper management of a veterinary pharmacy includes: (Select all that apply)', options: ['Maintaining a cold chain for vaccines', 'Using the FIFO method', 'Securely storing controlled drugs', 'Using expired medications to save money'], correctAnswer: ['Maintaining a cold chain for vaccines', 'Using the FIFO method', 'Securely storing controlled drugs'] },
        { type: 'msq', question: 'The administrative side of running a clinic involves: (Select all that apply)', options: ['Financial management', 'Staff scheduling and training', 'Maintaining legal compliance', 'Only treating animals'], correctAnswer: ['Financial management', 'Staff scheduling and training', 'Maintaining legal compliance'] },
      ]
    }
  ],
};