export default function convertManualDataToFeatures(manualData) {
  const features = [];

  for (const key in manualData) {
    if (manualData.hasOwnProperty(key)) {
      const value = manualData[key];
      const parsed = parseFloat(value);
      features.push(isNaN(parsed) ? value : parsed);
    }
  }

  return features;
}
