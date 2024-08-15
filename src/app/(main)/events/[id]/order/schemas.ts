import * as z from 'zod'
import { clearPhone, validatePhone } from '@/lib/phone-mask.ts'

export const requesterSchema = z.object({
    first_name: z.string().min(1, 'Введите имя'),
    last_name: z.string().min(1, 'Введите фамилию'),
    email: z.string().min(1, 'Введите e-mail').email('Неверный e-mail'),
    phone: z
        .string()
        .optional()
        .transform((value) => {
            // normalization
            return value ? clearPhone(value) : value
        })
        .refine((value) => {
            // it is optional
            if (value === undefined || value.trim().length === 0) return true

            return validatePhone(value)
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
        .min(1, 'Добавить как минимум одного участника')
        .superRefine((items, ctx) => {
            items.forEach((item, index) => {
                const email = item.email
                if (!email) return

                const otherEmails = items
                    .filter((otherItem, otherIndex) => otherIndex !== index)
                    .map((otherItem) => otherItem.email)

                if (otherEmails.includes(email)) {
                    ctx.addIssue({
                        path: [index, 'email'],
                        message:
                            'У каждого участника должна быть уникальная почта',
                        code: 'custom',
                    })
                }
            })
        }),
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
