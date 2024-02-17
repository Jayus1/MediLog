import {z} from 'zod';

const UserSchema = z.object({
    member_id: z.number(),
    correo: z.string().email(),
    contrasena: z.string().min(6).max(16),
    tipo: z.string(),
    plan: z.string(),
    metodo_pago: z.string(),
    fecha_expiracion: z.date(),
    cvv: z.string().max(4),
});

type User = z.infer<typeof UserSchema>;