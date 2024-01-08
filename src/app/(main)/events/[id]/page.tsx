import {
    getEvent,
    getEvents,
    isActivityTalk,
    isScheduleActivity,
} from '@/api/events'
import { notFound } from 'next/navigation'
import { getTickets } from '@/api/qtickets'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { FormattedNumber } from '@/components/FormattedNumber'
import { EventDate } from '@/components/EventDate/EventDate'
import clsx from 'clsx'
import Link from 'next/link'
import { FormattedDate } from '@/components/FormattedDate'
import styles from './styles.module.css'
import Author, { AuthorProps } from '@/components/Author/Author'
import { Schedule } from '@/app/(main)/events/[id]/schedule'

type Props = {
    params: { id: string }
}

export default async function Page({ params }: Props) {
    const event = await getEvent(params.id)

    if (event === null) {
        notFound()
    }

    const tickets = event.qtickets_id
        ? await getTickets(event.qtickets_id)
        : null
    const talks = event.activities
        .filter(isActivityTalk)
        .map((activity) => activity.thing)
    const activities = event.activities.filter(isScheduleActivity)

    return (
        <div
            className="max-w-7xl sm:px-6 lg:px-8 mx-auto"
            itemScope
            itemType="https://schema.org/Event"
        >
            {event.image && (
                <div className="relative h-36 sm:h-72 sm:rounded-2xl shadow-xl sm:overflow-hidden bg-gray-500">
                    <Image
                        loading="lazy"
                        src={event.image}
                        alt={event.name}
                        itemProp="image"
                        fill
                        sizes="100vw"
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                    />
                </div>
            )}
            <div className="mx-2 sm:mx-auto">
                <h1
                    className="mt-10 mb-6 text-2xl font-bold text-gray-900"
                    itemProp="name"
                >
                    {event.name}
                </h1>
                <div className="prose max-w-none" itemProp="description">
                    {event.full_description ? (
                        <MDXRemote source={event.full_description} />
                    ) : (
                        <p>{event.short_description}</p>
                    )}
                </div>
                <EventInformation
                    tickets={tickets}
                    startDate={event.start_date}
                    finishDate={event.finish_date}
                    venue={event.venue}
                />
                <Talks talks={talks} />
                <Schedule activities={activities} />
                <EventPrice
                    tickets={tickets}
                    description={event.ticket_description}
                    eventId={event.legacy_id.toString()}
                />
            </div>
        </div>
    )
}

type Talk = {
    description?: string
    speaker: AuthorProps
    title: string
}

type TalksProps = {
    talks: Talk[]
}

function Talks(props: TalksProps) {
    if (props.talks.length === 0) {
        return null
    }

    return (
        <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Доклады</h2>
            <ul
                role="list"
                className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
                {props.talks.map((talk, index) => (
                    <li
                        key={index}
                        className="group bg-white rounded-lg shadow divide-y divide-gray-200 overflow-hidden"
                    >
                        <div className="h-full w-full p-6 flex flex-col justify-between relative">
                            <div className="flex-1 text-gray-900 font-medium">
                                {talk.title}
                            </div>
                            <Author className="mt-10" {...talk.speaker} />
                            <div className="absolute inset-0 p-6 opacity-0 group-hover:opacity-100 bg-white text-xs overflow-auto">
                                {talk.description && (
                                    <MDXRemote source={talk.description} />
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}

type EventVenue = {
    name: string
    address: string
    latitude: number
    longitude: number
}

export type EventTickets = {
    is_active: boolean
    sale_start_date: string | null
    sale_finish_date: string
    types: Array<{
        id: string
        disabled: boolean
        name: string
        price: {
            current_value: string
            default_value: string
            modifiers: Array<
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
            >
        }
    }>
    payments: Array<{
        id: number
        type: 'card' | 'invoice' | 'free'
        agree_url: string
    }>
}

type EventInformationProps = {
    tickets: EventTickets | null
    startDate: string
    finishDate: string
    venue: EventVenue
}

function EventInformation(props: EventInformationProps) {
    const startAt = new Date(props.startDate)
    const finishAt = new Date(props.finishDate)

    const price = (
        props.tickets && props.tickets.is_active ? props.tickets.types : []
    ).reduce<null | {
        min: string
        max: string
    }>((price, type) => {
        if (type.disabled) return price

        if (price === null) {
            return {
                min: type.price.current_value,
                max: type.price.current_value,
            }
        }

        const newPrice = { ...price }

        if (parseFloat(price.min) > parseFloat(type.price.current_value)) {
            newPrice.min = type.price.current_value
        }

        if (parseFloat(price.max) < parseFloat(type.price.current_value)) {
            newPrice.max = type.price.current_value
        }

        return newPrice
    }, null)

    return (
        <dl
            className={clsx('mt-10 grid grid-cols-1 gap-5', {
                'lg:grid-cols-3': price !== null,
                'lg:grid-cols-2': price === null,
            })}
        >
            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                    Дата и время
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                    <meta
                        itemProp="startDate"
                        content={startAt.toISOString()}
                    />
                    <meta itemProp="endDate" content={finishAt.toISOString()} />
                    <EventDate startAt={startAt} finishAt={finishAt} />
                </dd>
            </div>
            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                    Место проведения
                </dt>
                <dd
                    className="mt-1 text-sm text-gray-900"
                    itemProp="location"
                    itemScope
                    itemType="https://schema.org/Place"
                >
                    <span itemProp="name">{props.venue.name}</span>
                    <br />
                    <span itemProp="address">{props.venue.address}</span>
                    <div
                        itemProp="geo"
                        itemScope
                        itemType="https://schema.org/GeoCoordinates"
                    >
                        <meta
                            itemProp="latitude"
                            content={props.venue.latitude.toString()}
                        />
                        <meta
                            itemProp="longitude"
                            content={props.venue.longitude.toString()}
                        />
                    </div>
                    <div className="mt-2">
                        <a
                            href={`https://yandex.ru/maps/?pt=${props.venue.longitude},${props.venue.latitude}&z=15&l=map`}
                            target="_blank"
                            rel="noreferrer nofollow noopener"
                            className="text-xs font-semibold hover:underline text-indigo-700"
                        >
                            Смотреть на карте
                        </a>
                    </div>
                </dd>
            </div>
            {price !== null && (
                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                        Стоимость участия
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                        <div>
                            {price.min !== price.max ? (
                                <>
                                    от{' '}
                                    <FormattedNumber
                                        style="currency"
                                        value={parseFloat(price.min)}
                                        currency="RUB"
                                        minimumFractionDigits={0}
                                    />{' '}
                                    до{' '}
                                    <FormattedNumber
                                        style="currency"
                                        value={parseFloat(price.max)}
                                        currency="RUB"
                                        minimumFractionDigits={0}
                                    />
                                </>
                            ) : price.min === '0' ? (
                                'Бесплатно'
                            ) : (
                                <FormattedNumber
                                    style="currency"
                                    value={parseFloat(price.min)}
                                    currency="RUB"
                                    minimumFractionDigits={0}
                                />
                            )}
                        </div>
                        <div className="mt-2">
                            <a
                                className="text-xs font-semibold hover:underline text-indigo-700"
                                href="#event_price"
                            >
                                Подробнее
                            </a>
                        </div>
                    </dd>
                </div>
            )}
        </dl>
    )
}

type EventPriceProps = {
    eventId: string
    tickets: EventTickets | null
    description?: string
}

function EventPrice(props: EventPriceProps) {
    if (props.tickets === null || props.tickets.types.length === 0) return null

    let ticketsAvailable = props.tickets.is_active

    if (ticketsAvailable && props.tickets.sale_start_date !== null) {
        ticketsAvailable =
            new Date(props.tickets.sale_start_date).getTime() <=
            new Date().getTime()
    }

    if (ticketsAvailable) {
        ticketsAvailable =
            new Date(props.tickets.sale_finish_date).getTime() >
            new Date().getTime()
    }

    const types = props.tickets.types.map((type) => ({
        name: type.name,
        price: {
            value: type.price.current_value,
        },
    }))

    return (
        <section className="section" id="event_price">
            <h2 className="section__title">Стоимость участия</h2>
            <div className="section__content">
                <div className={styles.eventPriceItems}>
                    {types.map((type, index) => (
                        <div className={styles.eventPriceItem} key={index}>
                            <div className={styles.eventPriceItem__title}>
                                {type.name}
                            </div>
                            <div className={styles.eventPriceItem__value}>
                                {type.price.value === '0' ? (
                                    'Бесплатно'
                                ) : (
                                    <FormattedNumber
                                        style="currency"
                                        value={parseFloat(type.price.value)}
                                        currency="RUB"
                                        minimumFractionDigits={0}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {ticketsAvailable && (
                    <div className={styles.eventPriceButton}>
                        <Link
                            href={`/events/${props.eventId}/order`}
                            className="button"
                            // onClick={() => {
                            //     const params = {
                            //         event_id: props.eventId,
                            //     };
                            //     ym(53951545, 'reachGoal', 'click_event_buy_button', params);
                            //     _tmr.push({ type: 'reachGoal', goal: 'click_event_buy_button', params });
                            // }}
                        >
                            Зарегистрироваться
                        </Link>
                        <p className={styles.eventPriceButton__description}>
                            Регистрация открыта до{' '}
                            <FormattedDate
                                value={props.tickets.sale_finish_date}
                                month="long"
                                day="numeric"
                            />
                        </p>
                    </div>
                )}
                {!ticketsAvailable && (
                    <div className={styles.eventPriceButton}>
                        <p className={styles.eventPriceButton__description}>
                            Регистрация закрыта
                        </p>
                    </div>
                )}
                {props.description && (
                    <div className="prose max-w-none">
                        <MDXRemote source={props.description} />
                    </div>
                )}
            </div>
        </section>
    )
}
