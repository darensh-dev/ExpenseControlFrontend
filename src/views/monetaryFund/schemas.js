import { z } from "zod";

export const monetaryFundSchema = z.object({
  name: z
    .string({ invalid_type_error: "El nombre es requerido", required_error: "El nombre es requerido" })
    .min(1, "El nombre debe tener minimo un caracter")
    .nonempty("El nombre no puede estar vacío."),
  initialBalance: z
    .number({
      invalid_type_error: "El balance debe ser un número",
      required_error: "El balance es requerido",
    })
    .min(1, "El balance debe ser mayor a 0"),
  fundTypeId: z
    .number({
      invalid_type_error: "Debe seleccionar un tipo de fondo",
      required_error: "Debe seleccionar un tipo de fondo",
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Debe seleccionar un tipo de fondo",
    }),
});
