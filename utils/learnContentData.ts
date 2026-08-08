
export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface TopicDetail {
    intro: {
        why: string;
        how: string;
        example: string;
    };
    quiz: QuizQuestion[];
}

export const learnContentData: Record<string, TopicDetail> = {
    // CROPS
    soil: {
        intro: {
            why: "Soil is like the stomach of your farm. If the soil is healthy, your plants will grow strong and resist diseases naturally, saving you money on expensive medicines.",
            how: "By adding organic matter like compost and rotating your crops, you keep the soil 'alive' with tiny helpful bugs that feed your plants for free.",
            example: "Farmers who stop burning residue and start composting often see a 20% increase in wheat yield within two seasons."
        },
        quiz: [
            { question: "What is often called the 'foundation' of a productive farm?", options: ["Cheap seeds", "Healthy soil", "Expensive tractors", "Night watering"], correctAnswer: "Healthy soil" },
            { question: "How does adding compost help your plants?", options: ["It kills all insects", "It feeds the soil with organic matter", "It makes the soil harder", "It changes the plant color"], correctAnswer: "It feeds the soil with organic matter" },
            { question: "Which practice helps enrich soil nutrients naturally?", options: ["Burning crop residue", "Growing only one crop forever", "Crop rotation", "Using extra chemicals"], correctAnswer: "Crop rotation" }
        ]
    },
    pest: {
        intro: {
            why: "Pests can destroy a whole season's hard work in days. Integrated management helps you stop them before they spread without hurting your soil or your family's health.",
            how: "Use 'friendly' bugs and natural sprays like Neem oil first. Only use strong chemicals as a last resort to keep your costs low and your food safe.",
            example: "Setting up simple yellow sticky traps can reduce aphid populations by 40% without using a single drop of pesticide."
        },
        quiz: [
            { question: "What is the best 'first line of defense' against pests?", options: ["Heavy chemical spray", "Field sanitation and cleaning", "Ignoring the field", "Buying a new tractor"], correctAnswer: "Field sanitation and cleaning" },
            { question: "What is Neem oil used for in organic farming?", options: ["As a fertilizer", "To clean tools", "As a natural pest repellent", "To make seeds grow faster"], correctAnswer: "As a natural pest repellent" },
            { question: "Why should we encourage 'ladybugs' on our farm?", options: ["They look pretty", "They eat harmful pests like aphids", "They help with irrigation", "They make the soil softer"], correctAnswer: "They eat harmful pests like aphids" }
        ]
    },
    water: {
        intro: {
            why: "Water is precious. Giving too much can rot the roots, and too little can starve the plant. Smart watering keeps the plant happy and saves your electricity and water bill.",
            how: "Watering early in the morning or using drip pipes ensures the water goes straight to the roots where it's needed, not evaporating in the hot sun.",
            example: "Switching from flood irrigation to drip can save up to 50% water while increasing your vegetable size by 15%."
        },
        quiz: [
            { question: "When is the best time to water your crops?", options: ["At noon when it's hot", "Early morning or late evening", "Only during rain", "Whenever you are free"], correctAnswer: "Early morning or late evening" },
            { question: "Which method is most efficient for saving water?", options: ["Flood irrigation", "Canal overflow", "Drip irrigation", "Hand buckets"], correctAnswer: "Drip irrigation" },
            { question: "What happens if you give too much water to your plants?", options: ["They grow 10 times faster", "The roots might rot", "The soil becomes very dry", "Pests will run away"], correctAnswer: "The roots might rot" }
        ]
    },
    harvest: {
        intro: {
            why: "The last step is the most important. If you harvest too early or store it poorly, you lose the high price you worked 4 months for.",
            how: "Learning the right signs of ripeness and using clean, dry storage keeps your produce fresh so you can sell it when the market price is highest.",
            example: "Farmers using hermetic (air-tight) bags lose only 1% of grain to insects, compared to 15% in normal jute bags."
        },
        quiz: [
            { question: "What preserves the quality of your crop after cutting?", options: ["Leaving it in the sun", "Proper drying and cool storage", "Washing it with salt water", "Selling it immediately even if wet"], correctAnswer: "Proper drying and cool storage" },
            { question: "Why is timing important for harvesting?", options: ["To beat the neighbors", "To ensure maximum weight and quality", "To follow the moon cycle", "It is not important"], correctAnswer: "To ensure maximum weight and quality" },
            { question: "What type of storage prevents grain-eating bugs best?", options: ["Open wooden boxes", "Damp corners", "Air-tight (hermetic) bags", "Floor piles"], correctAnswer: "Air-tight (hermetic) bags" }
        ]
    },
    // ANIMALS
    nutrition: {
        intro: {
            why: "Just like humans, cows and goats need a balanced diet to give more milk and stay healthy. Good food is the best medicine for your livestock.",
            how: "Mixing green fodder with dry fodder and adding a small amount of mineral salt ensures your animals get all the energy they need for high milk production.",
            example: "Adding just 50g of mineral mixture daily can increase a cow's milk yield by 0.5 to 1 liter per day."
        },
        quiz: [
            { question: "What is essential for high milk production in cows?", options: ["Only dry grass", "A balanced diet with minerals", "Loud music", "Less water"], correctAnswer: "A balanced diet with minerals" },
            { question: "What does 'fodder' mean?", options: ["Animal bedding", "Food for livestock", "A type of medicine", "The animal's shed"], correctAnswer: "Food for livestock" },
            { question: "Why should we give mineral salt to goats?", options: ["To make them thirsty", "To improve their immunity and growth", "To make their coat change color", "It has no benefit"], correctAnswer: "To improve their immunity and growth" }
        ]
    },
    breeding: {
        intro: {
            why: "Good breeding ensures that the next generation of your animals is better than the current one—giving more milk, growing faster, and resisting local diseases.",
            how: "By selecting the best bulls or using high-quality Artificial Insemination (AI), you can improve your herd's genetics without buying expensive new animals.",
            example: "A calf born from high-quality AI can produce up to 30% more milk than its mother when it grows up."
        },
        quiz: [
            { question: "What is a benefit of good breeding?", options: ["Smaller animals", "Higher milk yield in next generation", "Cheaper feed", "Animals get sick more"], correctAnswer: "Higher milk yield in next generation" },
            { question: "What does 'AI' stand for in livestock?", options: ["Artificial Intelligence", "Artificial Insemination", "Animal Inspection", "Auto Irrigation"], correctAnswer: "Artificial Insemination" },
            { question: "Which animal should you choose for breeding?", options: ["The weakest one", "The one that gives the most milk", "The smallest one", "The oldest one"], correctAnswer: "The one that gives the most milk" }
        ]
    },
    disease: {
        intro: {
            why: "A sick animal is a loss for the farmer. Most diseases can be stopped with simple vaccines and cleanliness before they even start.",
            how: "Keeping the shed dry and following a vaccination calendar with your local vet are the two easiest ways to keep your animals profitable and safe.",
            example: "Vaccinating for Foot and Mouth Disease (FMD) costs very little but saves you from losing thousands in treatment and lost milk."
        },
        quiz: [
            { question: "What is the cheapest way to handle animal diseases?", options: ["Buying expensive medicines later", "Vaccination and prevention", "Selling the animal immediately", "Ignoring the signs"], correctAnswer: "Vaccination and prevention" },
            { question: "Why is a dry floor important in a cow shed?", options: ["To save water", "To prevent hoof rot and infections", "To keep the cows warm", "For better lighting"], correctAnswer: "To prevent hoof rot and infections" },
            { question: "What should you do if an animal stops eating?", options: ["Give it more food", "Check for fever and call a vet", "Wait for 3 days", "Change its name"], correctAnswer: "Check for fever and call a vet" }
        ]
    },
    shelter: {
        intro: {
            why: "Your animals spend most of their time in the shed. If they are comfortable, cool, and have clean air, they will produce more and stay healthy.",
            how: "Good ventilation (air flow) and enough space for each animal to lie down comfortably are essential. A happy animal is a productive animal.",
            example: "Cows kept in well-ventilated sheds produce 10% more milk during summer compared to those in crowded, hot sheds."
        },
        quiz: [
            { question: "What is most important in a livestock shed?", options: ["Expensive paint", "Good air flow (ventilation)", "Tight closed doors", "Concrete walls with no windows"], correctAnswer: "Good air flow (ventilation)" },
            { question: "How does comfort affect a dairy cow?", options: ["It has no effect", "Comfortable cows produce more milk", "They eat less if comfortable", "They grow slower"], correctAnswer: "Comfortable cows produce more milk" },
            { question: "What is the benefit of a clean bedding area?", options: ["Looks good for guests", "Reduces udder infections (mastitis)", "Saves money on straw", "Helps the animal sleep longer"], correctAnswer: "Reduces udder infections (mastitis)" }
        ]
    }
};
