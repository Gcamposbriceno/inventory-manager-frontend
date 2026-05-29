import { z } from 'zod';

export const pantryJoinSchema = z.object({
  code: z
    .string()
    .min(1, 'Ingresa el código de la despensa')
    .max(8, 'El código no puede superar 8 caracteres'),
});

export type PantryJoinData = z.infer<typeof pantryJoinSchema>;
