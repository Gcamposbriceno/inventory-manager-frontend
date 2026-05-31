import { z } from 'zod';

export const pantryCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Ingresa un nombre para la despensa')
    .max(20, 'El nombre no puede superar 20 caracteres'),
});

export type PantryCreateData = z.infer<typeof pantryCreateSchema>;

const positiveNumStr = z
  .string()
  .min(1, 'Ingresa un valor')
  .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Debe ser mayor a 0');

export const addPantryTypeSchema = z
  .object({ rop: positiveNumStr, desired_stock: positiveNumStr })
  .refine((d) => parseFloat(d.desired_stock) > parseFloat(d.rop), {
    message: 'Debe ser mayor al mínimo',
    path: ['desired_stock'],
  });

export type AddPantryTypeFormData = z.infer<typeof addPantryTypeSchema>;

export const pantryJoinSchema = z.object({
  code: z
    .string()
    .min(1, 'Ingresa el código de la despensa')
    .max(8, 'El código no puede superar 8 caracteres'),
});

export type PantryJoinData = z.infer<typeof pantryJoinSchema>;
