import { defineStore } from "pinia";
export const useComboBoxStore = defineStore("ComboBox", {
  state: () => ({
    listCity: [],
    loadCity: false,

    listDepartment: [],
    loadDepartment: false,

    listCountry: [],
    loadCountry: false,

    listSex: [],
    loadSex: false,

    listBloodType: [],
    loadBloodType: false,

    listMaritalStatus: [],
    loadMaritalStatus: false,

    listDocumentType: [],
    loadDocumentType: false,

    listLanguaje: [],
    loadLanguaje: false,

    listJob: [],
    loadJob: false,

    listExperienceLevel: [],
    loadExperienceLevel: false,

    listArl: [],
    loadArl: false,

    listEps: [],
    loadEps: false,

    listAfp: [],
    loadAfp: false,

    listCajaCompensacion: [],
    loadCajaCompensacion: false,

    loadTypeJournalWork: false,
    listTypeJournalWork: [],

    loadAcademicLevel: false,
    listAcademicLevel: [],

    loadSpecialty: false,
    listSpecialty: [],

    loadSpecialty: true,
    listSpecialty: [],

    loadAcademicProgram: false,
    listAcademicProgram: [],

    loadInstitution: false,
    listInstitution: [],

    loadInstitutionBranche: false,
    listInstitutionBranche: [],

    loadFormationState: false,
    listFormationState: [],

    listBoolOptions: [
      { option: "SI", value: 1, val_bool: true },
      { option: "NO", value: 0, val_bool: false },
    ],

    // listContactMethod: [],
    // loadContactMethod: false,

    // listContactState: [],
    // loadContactState: false,

    // listContactReason: [],
    // loadContactReason: false,
  }),
});
