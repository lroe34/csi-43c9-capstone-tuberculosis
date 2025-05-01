import { singleRequiredColumns } from "@/utils/columnMappings";

export default function createSingleResistanceData(manualData) {
  const data = typeof manualData === 'object' && manualData !== null ? manualData : {};
  const filteredObject = {};

  singleRequiredColumns.forEach(camelCaseKey => {
    if (data.hasOwnProperty(camelCaseKey)) {
      filteredObject[camelCaseKey] = data[camelCaseKey];
    } 
  });
  console.log("Filtered data object:", filteredObject);
  return filteredObject;
}