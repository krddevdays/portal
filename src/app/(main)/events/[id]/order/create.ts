'use server'

import {
    paymentSchema,
    requesterSchema,
    TicketSchema,
    ticketsSchema,
} from './schemas.ts'
import { z } from 'zod'
import { headers } from 'next/headers'
import { getEvent } from '@/api/events.ts'
import { EventTicketsType, getTickets, qticketsApi } from '@/api/qtickets.ts'
import { notFound } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'

const createOrderSchema = z.object({
    requester: requesterSchema,
    tickets: ticketsSchema,
    payment: paymentSchema,
})

type CreateOrderSchema = z.infer<typeof createOrderSchema>

export async function createOrder(
    eventId: string,
    data: CreateOrderSchema
): Promise<{
    id: number
    paymentUrl: string
    reservedTo: string
    price: number
    currency: string
}> {
    return Sentry.withServerActionInstrumentation(
        'createOrder',
        {
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            const event = await getEvent(eventId)

            if (!event || !event.qtickets_id) {
                // TODO
                notFound()
            }

            const tickets = await getTickets(event.qtickets_id)

            if (!tickets || !tickets.is_active) {
                // TODO
                notFound()
            }

            const order = createOrderSchema.safeParse(data)

            if (!order.success) {
                // TODO
                notFound()
            }

            const payment = tickets.payments.find(
                (payment) => payment.type === order.data.payment.type
            )

            if (!payment) {
                // TODO
                notFound()
            }

            const seatsInfo = tickets.types.reduce<
                Record<string, EventTicketsType>
            >((seats, type) => {
                if (!seats[type.id]) {
                    seats[type.id] = type
                }

                return seats
            }, {})

            const selectedSeatsByType = order.data.tickets.items.reduce<
                Record<string, TicketSchema[]>
            >((seats, ticket) => {
                if (!seats[ticket.type]) {
                    seats[ticket.type] = []
                }

                seats[ticket.type].push(ticket)

                return seats
            }, {})

            for (const ticket of order.data.tickets.items) {
                const seat = seatsInfo[ticket.type]

                if (!seat || seat.disabled) {
                    // TODO
                    notFound()
                }

                if (
                    seat.free_quantity < selectedSeatsByType[ticket.type].length
                ) {
                    // TODO
                    notFound()
                }
            }

            const requestBody = {
                data: {
                    client: {
                        email: order.data.requester.email,
                        details: {
                            name: order.data.requester.first_name,
                            surname: order.data.requester.last_name,
                            phone: order.data.requester.phone,
                        },
                    },
                    site: {
                        host: headers().get('host'),
                    },
                    payment_id: payment.id,
                    payment_type_id:
                        payment.type === 'card' ? 'card' : undefined,
                    fields:
                        order.data.payment.type === 'invoice'
                            ? {
                                  inn: order.data.payment.inn,
                                  legal_name: order.data.payment.legal_name,
                              }
                            : undefined,
                    event_id: event.qtickets_id,
                    currency_id: tickets.currency_id,
                    baskets: order.data.tickets.items.map((ticket) => ({
                        show_id: tickets.show_id,
                        seat_id: ticket.type,
                        client_email: ticket.email,
                        client_name: ticket.first_name,
                        client_surname: ticket.last_name,
                    })),
                },
            }

            try {
                const result = await qticketsApi
                    .post(requestBody, '/orders')
                    .json<{
                        data: {
                            id: number
                            payment_url: string
                            reserved_to: string
                            price: number
                            currency_id: string
                        }
                    }>()

                return {
                    id: result.data.id,
                    paymentUrl: result.data.payment_url,
                    reservedTo: result.data.reserved_to,
                    price: result.data.price,
                    currency: result.data.currency_id,
                }
            } catch (e) {
                throw new Error('Неизвестная ошибка', { cause: e })
            }
        }
    )
}
