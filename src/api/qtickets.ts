import 'server-only'
import qs from 'qs'
import wretch from 'wretch'
import QueryStringAddon from 'wretch/addons/queryString'
import { dedupe } from 'wretch/middlewares/dedupe'

const externalApi = wretch('https://qtickets.ru/api/rest/v1')
    .middlewares([dedupe()])
    .addon(QueryStringAddon)
    .auth(`Bearer ${process.env.QTICKETS_TOKEN}`)
    .catcherFallback((e) => {
        throw new Error('Неизвестная ошибка', { cause: e })
    })

export { externalApi as qticketsApi }

export type EventTicketPayment = {
    id: number
    type: 'card' | 'invoice' | 'free'
    name: string
    agree_url: string
}

type EventTicketsPriceModifier =
    | {
          value: string
          type: 'sales_count'
          sales_count: number
      }
    | {
          value: string
          type: 'date'
          active_from: string
          active_to: string
      }

export type EventTicketsType = {
    id: string
    disabled: boolean
    free_quantity: number
    name: string
    price: {
        current_value: string
        default_value: string
        modifiers: Array<EventTicketsPriceModifier>
    }
}

type EventTicketsResponse = {
    show_id: number
    is_active: boolean
    sale_start_date: string | null
    sale_finish_date: string
    currency_id: string
    payments: Array<EventTicketPayment>
    types: Array<EventTicketsType>
}

type QticketsPriceModifier =
    | {
          value: string
          type: 'sales_count'
          sales_count_value: number
      }
    | {
          value: string
          type: 'date'
          active_from: string
          active_to: string
      }

type QticketsPrice = {
    id: number
    default_price: number
    // "color_theme": "1",
    modifiers: Array<QticketsPriceModifier>
}

type QticketsShow = {
    id: number
    is_active: number
    sale_start_date: string | null
    sale_finish_date: string
    open_date: string
    start_date: string
    finish_date: string
    scheme_properties: {
        /*        "admin": {
                    "zones": {
                        "vhodnoj-bilet": {
                            "opened": "1",
                            "was_opened": "1",
                            "rows": {
                                "1": {
                                    "was_opened": "1"
                                }
                            }
                        }
                    }
                },*/
        zones: Record<
            string,
            {
                disabled: string
                // "spread": {
                //     "enabled": ""
                // },
                price_id: string
                // "rows": [
                //     ""
                // ]
            }
        >
        // "seats": {
        //     "vhodnoj-bilet-1;1": {
        //         "hot": "",
        //         "show_free_quantity": "",
        //         "max_quantity": "150"
        //     }
        // }
    }
    prices: Array<QticketsPrice>
    min_price: QticketsPrice
    max_price: QticketsPrice
    created_at: string
    updated_at: string
    deleted_at: string | null
}

type QticketsPayment = {
    id: number
    is_active: boolean
    name: string
    handler: string
    agree_url: string
}

type QticketsEvent = {
    data: {
        is_active: number
        currency_id: string
        shows: Array<QticketsShow>
        payments: Array<QticketsPayment>
    }
}

type QticketsShowSeats = {
    data: Record<
        string,
        {
            zone_id: string
            name: string
            // 'description': '',
            seats: Record<
                string,
                {
                    seat_id: string
                    admission: boolean
                    name: string
                    // 'row': '1',
                    // 'place': '1',
                    free_quantity: number
                    disabled: boolean
                    price: number
                }
            >
        }
    >
}

export async function getTickets(
    id: number
): Promise<EventTicketsResponse | null> {
    const qticketsEvent = await externalApi
        .get(`/events/${id}`)
        .notFound(() => null)
        .json<QticketsEvent | null>()

    if (!qticketsEvent) {
        return null
    }

    const qticketsShow = qticketsEvent.data.shows[0]

    const qticketsSeats = await externalApi
        .query(
            qs.stringify({
                select: [
                    'seat_id',
                    'admission',
                    'row',
                    'place',
                    'name',
                    'free_quantity',
                    'price',
                    'disabled',
                ],
            })
        )
        .get(`/shows/${qticketsShow.id}/seats`)
        .json<QticketsShowSeats>()

    return {
        show_id: qticketsShow.id,
        is_active:
            Boolean(qticketsEvent.data.is_active) &&
            Boolean(qticketsShow.is_active) &&
            (!qticketsShow.sale_start_date ||
                new Date() > new Date(qticketsShow.sale_start_date)) &&
            new Date() < new Date(qticketsShow.sale_finish_date),
        sale_start_date: qticketsShow.sale_start_date,
        sale_finish_date: qticketsShow.sale_finish_date,
        currency_id: qticketsEvent.data.currency_id,
        payments: qticketsEvent.data.payments.reduce<EventTicketPayment[]>(
            (payments, payment) => {
                if (payment.handler === 'payanyway') {
                    payments.push({
                        id: payment.id,
                        type: 'card',
                        name: 'Банковской картой',
                        agree_url: payment.agree_url,
                    })
                } else if (payment.handler === 'invoice') {
                    payments.push({
                        id: payment.id,
                        type: 'invoice',
                        name: 'По счету',
                        agree_url: payment.agree_url,
                    })
                } else if (payment.handler === 'free') {
                    payments.push({
                        id: payment['id'],
                        type: 'free',
                        name: 'Бесплатно',
                        agree_url: payment['agree_url'],
                    })
                }

                return payments
            },
            []
        ),
        types: Object.values(Object.values(qticketsSeats.data)).reduce<
            EventTicketsType[]
        >((types, zone) => {
            const zone_scheme =
                qticketsShow.scheme_properties.zones[zone.zone_id]

            Object.values(zone.seats).forEach((seat) => {
                if (seat.disabled) {
                    return
                }

                const price = qticketsShow.prices.find(
                    (price) => price.id.toString() === zone_scheme.price_id
                )

                types.push({
                    id: seat.seat_id,
                    name: seat.name,
                    disabled: seat.free_quantity === 0,
                    free_quantity: seat.free_quantity,
                    price: price
                        ? {
                              current_value: seat.price.toString(),
                              default_value: price.default_price.toString(),
                              modifiers: price.modifiers.reduce<
                                  EventTicketsPriceModifier[]
                              >((modifiers, modifier) => {
                                  if (modifier.type === 'sales_count') {
                                      modifiers.push({
                                          value: modifier.value,
                                          type: 'sales_count',
                                          sales_count:
                                              modifier.sales_count_value,
                                      })
                                  } else if (modifier.type === 'date') {
                                      modifiers.push({
                                          value: modifier.value,
                                          type: 'date',
                                          active_from: modifier.active_from,
                                          active_to: modifier.active_to,
                                      })
                                  }

                                  return modifiers
                              }, []),
                          }
                        : {
                              current_value: seat.price.toString(),
                              default_value: seat.price.toString(),
                              modifiers: [],
                          },
                })
            })

            return types
        }, []),
    }
}
