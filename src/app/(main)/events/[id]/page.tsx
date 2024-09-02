import {
    getEvent,
    getEvents,
    isActivityTalk,
    isScheduleActivity,
} from '@/api/events'
import { notFound, permanentRedirect } from 'next/navigation'
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
import { buttonVariants } from '@/components/ui/button.tsx'
import React, { Suspense } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@/components/ui/card.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

type Props = {
    params: { id: string }
}

export async function generateStaticParams() {
    const events = await getEvents()

    return events.map((event) => ({ id: event.name }))
}

export default async function Page({ params }: Props) {
    const event = await getEvent(params.id)

    if (event === null) {
        notFound()
    }

    if (String(event.legacy_id) === params.id) {
        permanentRedirect(`/events/${encodeURIComponent(event.id)}`)
    }

    const talks = event.activities
        .filter(isActivityTalk)
        .map((activity) => activity.thing)
        .filter((talk) => talk !== null)
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
                        sizes="1200px"
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
                    startDate={event.start_date}
                    finishDate={event.finish_date}
                    venue={event.venue}
                    qticketsId={event.qtickets_id}
                />
                <Talks talks={talks} />
                <Schedule activities={activities} />
                {event.qtickets_id && (
                    <Suspense>
                        <EventPrice
                            description={event.ticket_description}
                            eventId={event.id}
                            qticketsId={event.qtickets_id}
                        />
                    </Suspense>
                )}
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

type EventInformationProps = {
    startDate: string
    finishDate: string
    venue: EventVenue
    qticketsId?: number
}

function VenueCard(props: { venue: EventVenue }) {
    return (
        <Card>
            <CardHeader>
                <CardDescription>Место проведения</CardDescription>
            </CardHeader>
            <CardContent
                itemProp="location"
                itemScope
                itemType="https://schema.org/Place"
            >
                <CardDescription className="text-foreground" itemProp="name">
                    {props.venue.name}
                </CardDescription>
                <CardDescription className="text-foreground" itemProp="name">
                    {props.venue.address}
                </CardDescription>
                <span
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
                </span>
            </CardContent>
            <CardFooter>
                <a
                    href={`https://yandex.ru/maps/?pt=${props.venue.longitude},${props.venue.latitude}&z=15&l=map`}
                    target="_blank"
                    rel="noreferrer nofollow noopener"
                    className="text-xs font-semibold hover:underline text-indigo-700"
                >
                    Смотреть на карте
                </a>
            </CardFooter>
        </Card>
    )
}

function DateTimeCard(props: { startDate: string; finishDate: string }) {
    const startAt = new Date(props.startDate)
    const finishAt = new Date(props.finishDate)

    return (
        <Card>
            <CardHeader>
                <CardDescription>Дата и время</CardDescription>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-foreground">
                    <meta
                        itemProp="startDate"
                        content={startAt.toISOString()}
                    />
                    <meta itemProp="endDate" content={finishAt.toISOString()} />
                    <EventDate startAt={startAt} finishAt={finishAt} />
                </CardDescription>
            </CardContent>
        </Card>
    )
}

function LoadingPriceCard() {
    return (
        <Card>
            <CardHeader>
                <CardDescription>Стоимость участия</CardDescription>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    <Skeleton className="h-5 w-full" />
                </CardDescription>
            </CardContent>
            <CardFooter>
                <a
                    className="text-xs font-semibold hover:underline text-indigo-700"
                    href="#event_price"
                >
                    Подробнее
                </a>
            </CardFooter>
        </Card>
    )
}

async function PriceCard(props: { qticketsId: number }) {
    const tickets = await getTickets(props.qticketsId)

    if (!tickets || tickets.types.length === 0) return null

    const price = tickets.types.reduce<{
        min: string
        max: string
    }>(
        (price, type) => {
            const newPrice = { ...price }

            if (parseFloat(price.min) > parseFloat(type.price.current_value)) {
                newPrice.min = type.price.current_value
            }

            if (parseFloat(price.max) < parseFloat(type.price.current_value)) {
                newPrice.max = type.price.current_value
            }

            return newPrice
        },
        {
            min: tickets.types[0].price.current_value,
            max: tickets.types[0].price.current_value,
        }
    )

    return (
        <Card>
            <CardHeader>
                <CardDescription>Стоимость участия</CardDescription>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-foreground">
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
                </CardDescription>
            </CardContent>
            <CardFooter>
                <a
                    className="text-xs font-semibold hover:underline text-indigo-700"
                    href="#event_price"
                >
                    Подробнее
                </a>
            </CardFooter>
        </Card>
    )
}

function EventInformation(props: EventInformationProps) {
    return (
        <div
            className={clsx('mt-10 grid grid-cols-1 gap-5', {
                'lg:grid-cols-3': props.qticketsId !== undefined,
                'lg:grid-cols-2': props.qticketsId === undefined,
            })}
        >
            <DateTimeCard
                startDate={props.startDate}
                finishDate={props.finishDate}
            />
            <VenueCard venue={props.venue} />
            {props.qticketsId && (
                <Suspense fallback={<LoadingPriceCard />}>
                    <PriceCard qticketsId={props.qticketsId} />
                </Suspense>
            )}
        </div>
    )
}

type EventPriceProps = {
    eventId: string
    qticketsId: number
    description?: string
}

async function EventPrice(props: EventPriceProps) {
    const tickets = await getTickets(props.qticketsId)

    if (tickets === null || tickets.types.length === 0) return null

    const types = tickets.types.map((type) => ({
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
                {tickets.is_active ? (
                    tickets.types.some((type) => type.free_quantity) ? (
                        <div className={styles.eventPriceButton}>
                            <Link
                                href={`/events/${encodeURIComponent(props.eventId)}/order`}
                                className={buttonVariants()}
                            >
                                Зарегистрироваться
                            </Link>
                            <p className={styles.eventPriceButton__description}>
                                Регистрация открыта до{' '}
                                <FormattedDate
                                    value={tickets.sale_finish_date}
                                    month="long"
                                    day="numeric"
                                />
                            </p>
                        </div>
                    ) : (
                        <div className={styles.eventPriceButton}>
                            <p className={styles.eventPriceButton__description}>
                                Билеты закончились :-(
                            </p>
                        </div>
                    )
                ) : (
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
