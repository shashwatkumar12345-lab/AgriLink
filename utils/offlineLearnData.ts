interface OfflineLearnContent {
  keywords: string[];
  response: {
    brief: string;
    detailed: string;
  };
}

export const offlineLearnData: {
  [mode in 'crops' | 'animals']: {
    [topicId: string]: OfflineLearnContent[];
  }
} = {
  crops: {
    soil: [
      {
        keywords: ['soil', 'health', 'loamy', 'sandy', 'clay', 'silt', 'peat', 'general', 'overview'],
        response: {
          brief: 'Healthy soil is the foundation of productive farming. Start by improving soil structure through regular addition of organic matter like compost, farmyard manure, and green manure.',
          detailed: 'Maintain proper pH levels by testing soil annually and adding lime or gypsum when needed. Encourage beneficial microbes through minimal tillage and crop rotation. Avoid chemical overuse, which can degrade soil fertility. Use cover crops to prevent erosion, fix nitrogen, and conserve moisture. Mulching helps regulate temperature and reduce weed growth. Ensure proper drainage to prevent waterlogging. Integrate legumes into cropping systems to naturally enrich soil nutrients. Good soil health ensures sustainable yields.'
        }
      },
    ],
    pest: [
      {
        keywords: ['pest', 'control', 'aphid', 'mite', 'ipm', 'general', 'overview'],
        response: {
          brief: 'Effective pest control requires integrated management instead of relying solely on chemicals. Start with field sanitation—remove plant debris and weeds that host pests.',
          detailed: 'Use resistant varieties whenever possible. Monitor fields regularly for early pest signs and use pheromone traps or sticky traps for detection. Encourage natural enemies like ladybugs and parasitoid wasps by planting flowering strips. Apply biological controls like neem oil, Bt, or botanical extracts. Use chemical pesticides only when pest levels cross the economic threshold, and rotate chemicals to prevent resistance. Maintain proper crop spacing and avoid excessive nitrogen, which attracts pests. Combine cultural, biological, and mechanical methods.'
        }
      },
    ],
    water: [
       {
        keywords: ['water', 'watering', 'irrigation', 'general', 'overview'],
        response: {
          brief: 'Water plants based on their growth stage, soil type, and climate. Deep but infrequent irrigation encourages strong root systems.',
          detailed: 'Water early in the morning to reduce evaporation and disease risk. Use drip irrigation for efficient water delivery and to avoid wetting leaves. Mulch around plants to retain moisture and reduce watering frequency. Avoid overwatering, which leads to root diseases and nutrient leaching. In sandy soil, water more frequently; in clay soil, water slowly to avoid runoff. Check moisture by pressing soil—if the top 2–3 cm is dry, watering is needed. Adjust irrigation during rainy seasons and drought.'
        }
      },
    ],
    harvest: [
       {
        keywords: ['harvest', 'harvesting', 'general', 'overview'],
        response: {
          brief: 'Timely harvesting preserves quality and maximizes market value. Harvest crops at their optimal maturity stage—too early reduces yield, too late affects texture and taste.',
          detailed: 'Handle produce gently to avoid bruising and maintain shelf life. Use clean, sharp tools and sanitize regularly to prevent disease spread. Harvest during cool hours, preferably early morning, to retain freshness. Sort produce immediately to remove damaged items. Store harvested crops in shaded, ventilated areas before packing. Follow specific harvesting indicators like color change, firmness, grain moisture percentage, or aroma depending on the crop. Proper harvesting ensures better storage, transport, and market prices.'
        }
      },
    ],
  },
  animals: {
    nutrition: [
      {
        keywords: ['nutrition', 'feed', 'general', 'overview'],
        response: {
          brief: 'Proper livestock nutrition supports strong growth and high yields. Analyze feed and forage quality to identify nutrient needs and provide supplements accordingly.',
          detailed: 'Provide balanced energy, protein, vitamins, and minerals like zinc, boron, and magnesium. Use organic sources such as high-quality silage and fodder to enhance digestive health. Split feed doses to improve uptake and reduce waste. Ensure feed is provided in clean troughs. Watch for deficiency symptoms—weight loss, poor coat, or low energy—and correct quickly. Rotate pastures to prevent nutrient depletion and maintain forage quality. Good nutrition enhances animal immunity, productivity, and the quality of milk or meat.'
        }
      },
    ],
    breeding: [
      {
        keywords: ['breeding', 'general', 'overview'],
        response: {
          brief: 'Breeding improves crop and livestock traits for better yield, quality, and resilience. Select parent lines with desirable characteristics such as disease resistance, high productivity, or climate tolerance.',
          detailed: 'Use traditional methods like mass selection, crossbreeding, or line breeding depending on the objective. Modern tools like marker-assisted selection help identify superior traits early. Maintain genetic diversity by avoiding excessive inbreeding. Record performance data to track improvement over generations. Evaluate progeny in different conditions to ensure stability. For livestock, focus on traits like growth rate, milk yield, fertility, or temperament. Effective breeding strengthens long-term productivity and sustainability.'
        }
      },
    ],
    disease: [
        {
          keywords: ['disease', 'prevention', 'health', 'biosecurity', 'general', 'overview'],
          response: {
            brief: 'Disease prevention starts with acquiring healthy animals and practicing proper farm hygiene. Practice pasture rotation to break disease cycles and avoid overgrazing.',
            detailed: 'Maintain recommended stocking density to improve air circulation and reduce stress-related diseases. Use resilient breeds and certified healthy stock. Isolate or cull infected animals immediately. Disinfect tools and equipment regularly. Improve herd health through good nutrition and microbial supplements that suppress pathogens. Avoid contaminated water sources and ensure proper drainage in shelters. Monitor herds frequently for early symptoms and act quickly with biological or veterinary-prescribed controls when necessary. Balanced nutrition boosts animal immunity and reduces disease susceptibility. Prevention is more effective than cure.'
          }
        },
    ],
    shelter: [
       {
        keywords: ['shelter', 'housing', 'general', 'overview'],
        response: {
          brief: 'Shelter management ensures livestock health, comfort, and productivity. Provide clean, well-ventilated housing that protects animals from extreme weather.',
          detailed: 'Maintain dry flooring with proper drainage to prevent hoof problems and infections. Ensure adequate space per animal to avoid stress and aggression. Clean shelters daily and disinfect regularly to reduce disease risk. Provide comfortable bedding and keep feeding and watering areas hygienic. Ensure good lighting and maintain suitable temperature and humidity levels. Install proper fencing and predator protection. Regularly check for structural damages and repair promptly. Good shelter management improves animal welfare, performance, and farm efficiency.'
        }
      },
    ]
  }
};