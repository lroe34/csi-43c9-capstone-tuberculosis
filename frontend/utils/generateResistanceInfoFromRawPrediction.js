import { drugMapping } from "@/utils/predictionMapping";

export default function generateResistanceInfoFromRawPrediction(
  predictionInput,
  predictionType
) {
  let rawPredictionArray = [];

  if (!predictionInput) {
    // This should only happen if the person isnt resistant to anything
    console.warn("No prediction input provided.");
    return "Not susceptible to tested drugs.";
  }

  if (Array.isArray(predictionInput)) {
    rawPredictionArray = predictionInput;
  } else if (typeof predictionInput === "object") {
    const extracted = predictionInput.raw_prediction;
    if (Array.isArray(extracted)) {
      if (extracted.length > 0 && Array.isArray(extracted[0])) {
        rawPredictionArray = extracted[0];
      } else {
        rawPredictionArray = extracted;
      }
    }
  } else {
    console.error(
      "Invalid prediction input format. Expected an array or object."
    );
    return "Invalid prediction input format.";
  }

  console.log("Raw prediction array:", rawPredictionArray);

  const drugKeys = Object.keys(drugMapping);
  const resistantDrugs = [];

  if (predictionType === "multi") {
    console.log("raw prediction array in multi", rawPredictionArray);
    if (
      drugKeys.length >= 2 &&
      drugMapping[drugKeys[0]] &&
      drugMapping[drugKeys[1]]
    ) {
      resistantDrugs.push(drugMapping[drugKeys[0]]);
      resistantDrugs.push(drugMapping[drugKeys[1]]);
    } else {
      console.warn("Could not find mappings for the first two default drugs.");
    }

    for (let i = 0; i < rawPredictionArray.length; i++) {
      const flag = rawPredictionArray[i];
      const drugKeyIndex = i + 2;
      if (drugKeyIndex < drugKeys.length) {
        const drugKey = drugKeys[drugKeyIndex];
        if (flag === 1 && drugMapping[drugKey]) {
          if (!resistantDrugs.includes(drugMapping[drugKey])) {
            resistantDrugs.push(drugMapping[drugKey]);
          }
        } else if (flag === 1) {
          console.warn(`Drug mapping not found for key: ${drugKey}`);
        }
      } else {
        console.warn(`Drug key index ${drugKeyIndex} out of bounds.`);
      }
    }
  } else if (predictionType === "poly") {
    console.log("raw prediction array in poly", rawPredictionArray);
    let addedFirstDrug = false;
    if (rawPredictionArray[0] === 1 && drugMapping[drugKeys[1]]) {
      resistantDrugs.push(drugMapping[drugKeys[1]]);
      addedFirstDrug = true;
    } else if (rawPredictionArray[0] === 0 && drugMapping[drugKeys[0]]) {
      resistantDrugs.push(drugMapping[drugKeys[0]]);
      addedFirstDrug = true;
    } else {
      console.warn(
        "Invalid flag or missing mapping for index 0/1 in poly mode."
      );
    }

    for (let i = 1; i < rawPredictionArray.length; i++) {
      const flag = rawPredictionArray[i];
      const drugKeyIndex = i + 1;
      if (drugKeyIndex < drugKeys.length) {
        const drugKey = drugKeys[drugKeyIndex];
        const drugName = drugMapping[drugKey];
        if (flag === 1 && drugName) {
          const isFirstOrSecondDrug =
            drugKey === drugKeys[0] || drugKey === drugKeys[1];
          if (
            !isFirstOrSecondDrug ||
            !addedFirstDrug ||
            !resistantDrugs.includes(drugName)
          ) {
            if (!resistantDrugs.includes(drugName)) {
              resistantDrugs.push(drugName);
            }
          }
        } else if (flag === 1) {
          console.warn(`Drug mapping not found for key: ${drugKey}`);
        }
      } else {
        console.warn(`Drug key index ${drugKeyIndex} out of bounds.`);
      }
    }
  }

  if (resistantDrugs.length > 0) {
    return "Drugs you are resistant to: " + resistantDrugs.join(", ");
  } else {
    return "Resistance pattern identified, but specific drug mappings are unavailable or none apply based on flags.";
  }
}
