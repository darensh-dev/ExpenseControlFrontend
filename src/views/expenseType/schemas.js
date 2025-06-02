import { z } from "zod";

export const expenseTypeSchema = z.object({
  name: z
    .string({ invalid_type_error: "El nombre es requerido", required_error: "El nombre es requerido" })
    .min(1, "El nombre debe tener minimo un caracter")
    .nonempty("El nombre no puede estar vacío."),
  description: z
    .string({ invalid_type_error: "La descripcion es requerida", required_error: "La descripcion es requerida" })
    .min(1, "La descripcion debe tener minimo un caracter")
    .nonempty("La descripcion no puede estar vacío."),
});
