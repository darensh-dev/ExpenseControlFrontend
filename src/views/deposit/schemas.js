import { z } from "zod";

export const depositSchema = z.object({
  date: z
    .date({ invalid_type_error: "la Fecha es requerida", required_error: "la Fecha es requerida" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Fecha inválida",
    }),
  monetaryFundId: z.number({
    invalid_type_error: "Debe seleccionar fondo monetario",
    required_error: "Debe seleccionar fondo monetario",
  }),
  description: z.string().optional(),
  amount: z
    .number({ invalid_type_error: "El monto es requerido", required_error: "El monto es requerido" })
    .min(1, "El monto debe ser mayor a 0"),
});
