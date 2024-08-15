'use server'

import { paymentSchema, requesterSchema, ticketsSchema } from './schemas.ts'
import { z } from 'zod'
import { headers } from 'next/headers'
import { getEvent } from '@/api/events.ts'
import {
    getTickets,
    qticketsApi,
    SeatNotAvailableError,
    ShowNotPayedLimitError,
} from '@/api/qtickets.ts'
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
): Promise<
    | {
          status: 'success'
          id: number
          paymentUrl: string
          reservedTo: string
          price: number
          currency: string
      }
    | {
          status: 'error'
          code: 'not_payed_limit'
          payment_url: string
          cancel_url: string
      }
    | {
          status: 'error'
          code: 'seat_not_available'
      }
> {
    return Sentry.withServerActionInstrumentation(
        'createOrder',
        {
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            const event = await getEvent(eventId)

            if (!event || !event.qtickets_id) {
                notFound()
            }

            const tickets = await getTickets(event.qtickets_id)

            if (!tickets) {
                notFound()
            }

            const order = createOrderSchema.safeParse(data)

            if (!order.success) {
                // TODO: add client handling
                throw new Error('Invalid order data')
            }

            const payment = tickets.payments.find(
                (payment) => payment.type === order.data.payment.type
            )

            if (!payment) {
                // TODO: add client handling
                throw new Error('Payment method not found')
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
                    status: 'success' as const,
                    id: result.data.id,
                    paymentUrl: result.data.payment_url,
                    reservedTo: result.data.reserved_to,
                    price: result.data.price,
                    currency: result.data.currency_id,
                }
            } catch (e) {
                if (e instanceof ShowNotPayedLimitError) {
                    return {
                        status: 'error' as const,
                        code: 'not_payed_limit' as const,
                        payment_url: e.payment_url,
                        cancel_url: e.cancel_url,
                    }
                } else if (e instanceof SeatNotAvailableError) {
                    return {
                        status: 'error' as const,
                        code: 'seat_not_available' as const,
                    }
                }

                throw e
            }
        }
    )
}
