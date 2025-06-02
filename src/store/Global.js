import { defineStore } from "pinia";
import { getSessionInfo } from "@/composables/useUtils";
import { toRaw } from "vue";

export const useGlobalStore = defineStore("Global", {
  state: () => ({
    _du: { role_code: "-1", company_type: -1 },
    dataStaff: [],
    employee: null,
    loadingDataStaff: false,
    previewPdf: {
      url: null,
      show: false,
    },
    defaultExperience: [
      {
        CompanyName: "Emeprsa #1",
        Position: "Cargo en la empresa",
        JobFunctions: "Descripcion de las tareas en el cargo",
        BoosName: "Nombre del jefe",
        CellPhone: "829-728-0923",
        StartDate: "fecha inicio",
        EndDate: "fecha fin",
        yearExp: 3,
      },
      {
        CompanyName: "Emeprsa #2",
        Position: "Cargo en la empresa",
        JobFunctions: "Descripcion de las tareas en el cargo",
        BoosName: "Nombre del jefe",
        CellPhone: "829-728-0923",
        StartDate: "fecha inicio",
        EndDate: "fecha fin",
        yearExp: 3,
      },
    ],
    defaultCertifications: [
      {
        Institution: "Entidad Certificadora",
        NameCertify: "Certificacion",
        StartDate: "1995-01-01",
        EndDate: "1998-12-01",
        PathFile: null,
      },
      {
        Institution: "Entidad Certificadora",
        NameCertify: "Certificacion",
        StartDate: "1995-01-01",
        EndDate: "1998-12-01",
        PathFile: null,
      },
    ],
    ObjEmployee: {
      AboutMe: null,
      AbvDocType: null,
      Address: null,
      BirthDate: null,
      CellPhone: null,
      CellPhone2: null,
      DateCreate: null,
      DateEnd: null,
      DateStart: null,
      FullName: null,
      Email: null,
      ExperienceLevelName: null,
      IdAfpstaff: null,
      IdArlStaff: null,
      IdBloodType: null,
      IdBoxStaff: null,
      IdCard: null,
      IdCity: null,
      CityName: null,
      IdDocumentType: null,
      IdEpsstaff: null,
      IdEst: null,
      IdExperienceLevel: null,
      HomeTownName: null,
      IdHomeTown: null,
      IdJob: null,
      IdMaritalStatus: null,
      IdSex: null,
      IdStaff: null,
      IdStaffState: null,
      LastName: null,
      Name: null,
      PhotoProfile: null,
      QtyChildren: null,
      JsonCertification: [],
      JsonExperience: [],
      JsonLanguaje: [],
      HomeTown: null,
      City: null,
      Job: null,
      Languaje: null,
    },
  }),
  getters: {
    supervisor() {
      return this._du.role_code == "1003" || this._du.role_code == "1004";
    },
    isAdmin() {
      return this._du.role_code == "1001";
    },
    isEmployee() {
      return this._du.role_code == "1005";
    },
    isEu() {
      return this._du.company_type === 3;
    },
    isEst() {
      return this._du.company_type === 2;
    },
  },
  actions: {
    resetStaff() {
      this.dataStaff = [];
      this.employee = null;
      this.loadingDataStaff = false;
    },
    showModalPdf(url) {
      this.previewPdf.url = url;
      this.previewPdf.show = true;
    },
    closeModalPdf() {
      this.previewPdf.url = null;
      this.previewPdf.show = false;
    },
    resetFilterApplied() {
      const keysToKeep = ["DateIni", "DateEnd"];
      for (let key in this.filterApplied) {
        if (!keysToKeep.includes(key)) {
          delete this.filterApplied[key];
        }
      }
    },
    AddFilterApplied(key, value) {
      this.filterApplied[key] = value;
    },
    updateEmployee({ IdCard = "", key = "", data = null, all = false } = {}) {
      const localEmp = this.dataStaff.find((emp) => emp.IdCard === IdCard);
      if (localEmp) {
        this.employee = toRaw(localEmp);
        if (all) {
          const { HomeTownName, IdHomeTown, CityName, IdCity, JobName, IdJob } =
            data;
          Object.assign(localEmp, {
            ...data,
            HomeTown: {
              city_name: HomeTownName,
              city_id: IdHomeTown,
            },
            City: {
              city_name: CityName,
              city_id: IdCity,
            },
            Job: {
              JobName: JobName,
              IdJob: IdJob,
            },
          });
        } else {
          localEmp[key] = data;
        }
      }
    },
  },
});

const global = useGlobalStore();
global._du = getSessionInfo("dataUser");
