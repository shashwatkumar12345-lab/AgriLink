// Mock sentiment data organized by country and app mode.
// This allows the Pulse dashboard to be country-specific.

interface SentimentRegionData {
  region: string;
  [key: string]: any; // Allows for different metrics like appSatisfaction, vetSupport etc.
}

interface SentimentData {
  [country: string]: {
    crops: SentimentRegionData[];
    animals: SentimentRegionData[];
  };
}

export const sentimentData: SentimentData = {
  "India": {
    crops: [
      { region: 'Punjab', appSatisfaction: 85, aiAdviceSatisfaction: 81 },
      { region: 'Maharashtra', appSatisfaction: 88, aiAdviceSatisfaction: 85 },
      { region: 'Rajasthan', appSatisfaction: 78, aiAdviceSatisfaction: 72 },
      { region: 'Uttar Pradesh', appSatisfaction: 75, aiAdviceSatisfaction: 70 },
      { region: 'West Bengal', appSatisfaction: 82, aiAdviceSatisfaction: 79 },
    ],
    animals: [
      { region: 'Punjab', feedQuality: 88, vetSupport: 82 },
      { region: 'Rajasthan', feedQuality: 70, vetSupport: 65 },
      { region: 'Gujarat', feedQuality: 90, vetSupport: 85 },
      { region: 'Uttar Pradesh', feedQuality: 76, vetSupport: 70 },
      { region: 'Andhra Pradesh', feedQuality: 81, vetSupport: 75 },
    ],
  },
  "United States": {
    crops: [
      { region: 'California', appSatisfaction: 92, aiAdviceSatisfaction: 88 },
      { region: 'Iowa', appSatisfaction: 89, aiAdviceSatisfaction: 86 },
      { region: 'Texas', appSatisfaction: 85, aiAdviceSatisfaction: 80 },
      { region: 'Florida', appSatisfaction: 87, aiAdviceSatisfaction: 84 },
      { region: 'Nebraska', appSatisfaction: 90, aiAdviceSatisfaction: 87 },
    ],
    animals: [
      { region: 'Texas', feedQuality: 94, vetSupport: 88 },
      { region: 'California', feedQuality: 91, vetSupport: 90 },
      { region: 'Iowa', feedQuality: 88, vetSupport: 82 },
      { region: 'Wisconsin', feedQuality: 92, vetSupport: 89 },
      { region: 'Nebraska', feedQuality: 90, vetSupport: 85 },
    ],
  },
  "Canada": {
    crops: [
      { region: 'Ontario', appSatisfaction: 88, aiAdviceSatisfaction: 85 },
      { region: 'Quebec', appSatisfaction: 86, aiAdviceSatisfaction: 82 },
      { region: 'Saskatchewan', appSatisfaction: 91, aiAdviceSatisfaction: 89 },
      { region: 'Alberta', appSatisfaction: 90, aiAdviceSatisfaction: 88 },
    ],
    animals: [
      { region: 'Alberta', feedQuality: 95, vetSupport: 92 },
      { region: 'Ontario', feedQuality: 90, vetSupport: 88 },
      { region: 'Quebec', feedQuality: 88, vetSupport: 85 },
    ],
  },
  "Global Fallback": {
    crops: [
        { region: 'California, US', appSatisfaction: 92, aiAdviceSatisfaction: 88 },
        { region: 'Punjab, IN', appSatisfaction: 85, aiAdviceSatisfaction: 81 },
        { region: 'Ontario, CA', appSatisfaction: 88, aiAdviceSatisfaction: 85 },
        { region: 'São Paulo, BR', appSatisfaction: 75, aiAdviceSatisfaction: 70 },
        { region: 'Lagos, NG', appSatisfaction: 65, aiAdviceSatisfaction: 60 },
        { region: 'Victoria, AU', appSatisfaction: 90, aiAdviceSatisfaction: 86 },
    ],
    animals: [
        { region: 'Texas, US', feedQuality: 90, vetSupport: 85 },
        { region: 'Rajasthan, IN', feedQuality: 70, vetSupport: 65 },
        { region: 'Alberta, CA', feedQuality: 92, vetSupport: 88 },
        { region: 'Mato Grosso, BR', feedQuality: 80, vetSupport: 72 },
        { region: 'Kano, NG', feedQuality: 68, vetSupport: 55 },
        { region: 'Queensland, AU', feedQuality: 88, vetSupport: 80 },
    ],
  },
};
