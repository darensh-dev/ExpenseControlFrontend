import { z } from "zod";

export const monthlyBudgetSchema = z.object({
  month: z
    .date({ invalid_type_error: "El mes es requerido", required_error: "El mes es requerido" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Mes inválido",
    }),
  expenseTypeId: z
    .number({
      invalid_type_error: "Debe seleccionar un tipo de gasto",
      required_error: "Debe seleccionar un tipo de gasto",
    })
    .min(1, "Tipo de gasto inválido"),
  amount: z
    .number({ invalid_type_error: "El monto es requerido", required_error: "El monto es requerido" })
    .min(1, "El monto debe ser mayor a 0"),
});
