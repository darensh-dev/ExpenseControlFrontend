import { z } from "zod";

export const detailSchema = z.object({
  expenseTypeId: z
    .number({ invalid_type_error: "Tipo de gasto requerido", required_error: "Tipo de gasto requerido" })
    .min(1, "Tipo de gasto inválido"),
  amount: z
    .number({ invalid_type_error: "El monto es requerido", required_error: "El monto es requerido" })
    .min(1, "El monto debe ser mayor a 0"),
});

export const movementSchema = z
  .object({
    monetaryFundId: z
      .number({ invalid_type_error: "El fondo es requerido", required_error: "El fondo es requerido" })
      .min(1, "Fondo inválido"),
    date: z
      .date({ invalid_type_error: "La fecha es requerida", required_error: "La fecha es requerida" })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Fecha inválida",
      }),
    merchantName: z
      .string({ invalid_type_error: "El proveedor es requerido", required_error: "El proveedor es requerido" })
      .min(1, "Debe ingresar un proveedor"),
    documentTypeId: z
      .number({
        invalid_type_error: "Debe seleccionar tipo de documento",
        required_error: "Debe seleccionar tipo de documento",
      })
      .min(1),
    otherDocumentTypeText: z.string().optional(),
    notes: z.string().optional(),
    details: z.array(detailSchema).min(1, "Debe agregar al menos un detalle"),
  })
  .superRefine((data, ctx) => {
    if (data.documentTypeId === 3 && (!data.otherDocumentTypeText || data.otherDocumentTypeText.trim() === "")) {
      ctx.addIssue({
        path: ["otherDocumentTypeText"],
        code: z.ZodIssueCode.custom,
        message: "Debe especificar el tipo de documento si selecciona 'Otro'",
      });
    }
  });
