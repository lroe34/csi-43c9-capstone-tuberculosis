export const requiredColumns = [
  "Gender", // first
  "Age", // first
  "Residence time", // first
  "No. families", // first
  "Tb in family", // first
  "Tb in neighbor", // first
  "Tb contact", // first
  "Cough >=2 weeks",  // first
  "Cough <2 weeks", // first
  "Emptysis", // first
  "Fever", // first
  "Thoracalgia", // first
  "Sympomless", // first
  "Have similar sym before", // first
  "X-ray checking", // first
  "Sputum specimen", // first
  "Tb diagnosed", // first
  "Clinical record checked", // first
  "Anti-tb drug time", // first
  "Patient final type decided", // first
  "Subserotype type", // first
];

export const fileToManualMapping = {
  Gender: "gender",
  Age: "age",
  "Residence time": "residenceTime",
  "No. families": "noFamilies",
  "Tb in family": "tbInFamily",
  "Tb in neighbor": "tbInNeighbor",
  "Tb contact": "tbContact",
  "Cough >=2 weeks": "coughTwoWeeks",
  "Cough <2 weeks": "coughLessThan2Weeks",
  Emptysis: "emptysis",
  Fever: "fever",
  Thoracalgia: "thoracalgia",
  Sympomless: "symptomless",
  "Have similar sym before": "similarSymBefore",
  "X-ray checking": "xrayChecking",
  "Sputum specimen": "sputumSpecimen",
  "Tb diagnosed": "tbDiagnosed",
  "Clinical record checked": "clinicalRecordChecked",
  "Anti-tb drug time": "antiTbDrugTime",
  "Patient final type decided": "patientFinalTypeDecided",
  "Subserotype type": "subserotypeType",
};

export const singleRequiredColumns = [
  "noFamilies",
  "residenceTime",
  "coughLessThan2Weeks",
  "age",
  "xrayChecking",
  "similarSymBefore",
  "coughTwoWeeks",
  "tbDiagnosed",
  "antiTbDrugTime",
  "tbInNeighbor",
  "clinicalRecordChecked",,
  "patientFinalTypeDecided",
  "sputumSpecimen",
  "fever",
  "gender",
  "thoracalgia",
];

export const manualToSchemaMapping = Object.entries(fileToManualMapping).reduce(
  (acc, [schemaKey, manualKey]) => {
    acc[manualKey] = schemaKey;
    return acc;
  },
  {}
);
