import * as z from 'zod'

export const requesterSchema = z.object({
    first_name: z.string().min(1, 'Введите имя'),
    last_name: z.string().min(1, 'Введите фамилию'),
    email: z.string().min(1, 'Введите e-mail').email('Неверный e-mail'),
    phone: z
        .string()
        .optional()
        .transform((value) => {
            // normalization
            return value?.replaceAll(/[^+0-9]/g, '').replace(/^8/, '+7')
        })
        .refine((value) => {
            // it is optional
            if (value === undefined || value.trim().length === 0) return true

            if (value.length !== 12) return false

            return /^\+7/.test(value)
        }, 'Неверный номер телефона')
        .transform((value) => {
            // map empty string to undefined
            if (value?.trim().length === 0) return undefined

            return value
        }),
})

export type RequesterSchema = z.infer<typeof requesterSchema>

export const ticketSchema = z.object({
    type: z.string({ required_error: 'Выберите тип билета' }),
    first_name: z.string().min(1, 'Введите имя'),
    last_name: z.string().min(1, 'Введите фамилию'),
    email: z.string().min(1, 'Введите e-mail').email('Неверный e-mail'),
})

export type TicketSchema = z.infer<typeof ticketSchema>

export const ticketsSchema = z.object({
    items: z
        .array(ticketSchema)
        .min(1, 'Добавить как минимум одного участника'),
})

export type TicketsSchema = z.infer<typeof ticketsSchema>

export const paymentSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('invoice'),
        legal_name: z.string().min(1, 'Введите название компании'),
        inn: z.string().min(1, 'Введите ИНН'),
    }),
    z.object({
        type: z.literal('free'),
    }),
    z.object({
        type: z.literal('card'),
    }),
])

export type PaymentSchema = z.infer<typeof paymentSchema>
