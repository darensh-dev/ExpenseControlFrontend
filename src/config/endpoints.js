const apiV1Prefix = "/api/v1";

const apiV1 = {
  login: `${apiV1Prefix}/auth/login`,
  signup: `${apiV1Prefix}/auth/signup`,
  deposit: `${apiV1Prefix}/deposit`,
  expense: `${apiV1Prefix}/expense`,
  documentTypes: `${apiV1Prefix}/document-types`,
  expenseTypes: `${apiV1Prefix}/expense-types`,
  fundTypes: `${apiV1Prefix}/fund-types`,
  monetaryFund: `${apiV1Prefix}/monetary-fund`,
  budget: `${apiV1Prefix}/budget`,
  chartBudgetExecution: `${apiV1Prefix}/budget-execution`,
  movements: `${apiV1Prefix}/movements`,
};

export { apiV1 };
