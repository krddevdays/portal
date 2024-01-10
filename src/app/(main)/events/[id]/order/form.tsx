'use client'
import {
    useFieldArray,
    useForm,
    Control,
    FieldPathByValue,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Sentry from '@sentry/nextjs'

import { EventTicketPayment, EventTicketsType } from '@/api/qtickets.ts'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form.tsx'
import { Button, buttonVariants } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    paymentSchema,
    PaymentSchema,
    requesterSchema,
    RequesterSchema,
    TicketSchema,
    ticketsSchema,
    TicketsSchema,
} from './schemas.ts'
import { createOrder } from './/create'
import { FormattedDate } from '@/components/FormattedDate'
import { FormattedNumber } from '@/components/FormattedNumber'
import clsx from 'clsx'
import { MaskedInput } from '@/components/MaskedInput'
import { phoneMaskOptions } from '@/lib/phone-mask'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function RequesterForm({
    onSubmit,
}: {
    onSubmit: (values: RequesterSchema) => void
}) {
    const form = useForm<RequesterSchema>({
        resolver: zodResolver(requesterSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Фамилия</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input
                                    autoComplete="email"
                                    inputMode="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Телефон</FormLabel>
                            <FormControl>
                                <MaskedInput
                                    placeholder="+7"
                                    options={phoneMaskOptions}
                                    inputMode="tel"
                                    autoComplete="tel"
                                    enterKeyHint="done"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Продолжить
                </Button>
            </form>
        </Form>
    )
}

function TicketField({
    onRemove,
    number,
    name,
    types,
    control,
}: {
    onRemove?: () => void
    number: number
    name: FieldPathByValue<TicketsSchema, TicketSchema>
    types: EventTicketsType[]
    control: Control<TicketsSchema>
}) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="font-semibold">Участник №{number}</div>
                {onRemove && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            const result = confirm(
                                `Удалить участника №${number}?`
                            )

                            if (result) {
                                onRemove()
                            }
                        }}
                    >
                        Удалить
                    </Button>
                )}
            </div>
            <FormField
                control={control}
                name={`${name}.type`}
                render={({
                    field: { value, onChange, ref: _ref, ...field },
                }) => (
                    <FormItem>
                        <Select
                            onValueChange={onChange}
                            defaultValue={value}
                            {...field}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите тип билета" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {types.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name={`${name}.first_name`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name={`${name}.last_name`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Фамилия</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name={`${name}.email`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                            <Input
                                autoComplete="email"
                                inputMode="email"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

function TicketsForm({
    onSubmit,
    requester,
    types,
}: {
    onSubmit: (values: TicketsSchema) => void
    requester: RequesterSchema
    types: EventTicketsType[]
}) {
    const defaultType = types.length === 1 ? types[0].id : undefined

    const form = useForm<TicketsSchema>({
        resolver: zodResolver(ticketsSchema),
        defaultValues: {
            items: [
                {
                    type: defaultType,
                    first_name: requester.first_name,
                    last_name: requester.last_name,
                    email: requester.email,
                },
            ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {fields.map((field, index) => (
                    <TicketField
                        key={field.id}
                        types={types}
                        name={`items.${index}`}
                        number={index + 1}
                        control={form.control}
                        onRemove={
                            fields.length > 1
                                ? () => {
                                      remove(index)
                                  }
                                : undefined
                        }
                    />
                ))}
                <Button
                    type="button"
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                        append({
                            type: defaultType || '',
                            first_name: '',
                            last_name: '',
                            email: '',
                        })
                    }}
                >
                    Добавить еще участника
                </Button>
                <Button type="submit" className="w-full">
                    Продолжить
                </Button>
            </form>
        </Form>
    )
}

function PaymentForm({
    onSubmit,
    payments,
}: {
    onSubmit: (values: PaymentSchema) => void | Promise<unknown>
    payments: EventTicketPayment[]
}) {
    const form = useForm<PaymentSchema>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            type: payments.find((payment) => payment.type === 'card')?.type,
            legal_name: '',
            inn: '',
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="type"
                    render={({
                        formState,
                        field: { value, onChange, ref: _ref, ...field },
                    }) => {
                        const payment = payments.find(
                            (payment) => payment.type.toString() == value
                        )

                        return (
                            <>
                                <FormItem>
                                    <FormLabel>Способ оплаты</FormLabel>
                                    <Select
                                        onValueChange={onChange}
                                        defaultValue={value}
                                        {...field}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                disabled={
                                                    formState.isSubmitting
                                                }
                                            >
                                                <SelectValue placeholder="Выберите способ оплаты" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {payments.map((payment) => (
                                                <SelectItem
                                                    key={payment.type}
                                                    value={payment.type}
                                                >
                                                    {payment.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {payment && (
                                        <FormDescription>
                                            Нажимая на кнопку
                                            &quot;Продолжить&quot; вы
                                            подтверждаете, что изучили и
                                            согласны с{' '}
                                            <a
                                                href={payment.agree_url}
                                                className={'underline'}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                правовыми документами
                                            </a>
                                            .
                                        </FormDescription>
                                    )}
                                </FormItem>
                                {value === 'invoice' && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            disabled={formState.isSubmitting}
                                            name="legal_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Название компании
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            disabled={formState.isSubmitting}
                                            name="inn"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ИНН</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}
                            </>
                        )
                    }}
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Продолжить
                </Button>
                <FormMessage />
            </form>
        </Form>
    )
}

type OrderFormProps = {
    eventId: string
    types: EventTicketsType[]
    payments: EventTicketPayment[]
}

export function OrderForm(props: OrderFormProps) {
    const [requester, setRequester] = useState<RequesterSchema | null>(null)
    const [tickets, setTickets] = useState<TicketsSchema | null>(null)
    const [order, setOrder] = useState<{
        id: number
        paymentUrl: string
        reservedTo: string
        price: number
        currency: string
    } | null>(null)

    if (order) {
        return (
            <div className="space-y-6">
                <div className="text-2xl font-semibold">
                    Ваш заказ №{order.id} успешно оформлен
                </div>
                <div>
                    Бронь действительна до{' '}
                    <FormattedDate
                        value={order.reservedTo}
                        month="long"
                        day="numeric"
                        hour="numeric"
                        minute="numeric"
                    />
                </div>
                <a
                    className={clsx(buttonVariants(), 'w-full')}
                    href={order.paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    Оплатить{' '}
                    {order.price && (
                        <FormattedNumber
                            style="currency"
                            value={order.price}
                            currency={order.currency}
                            minimumFractionDigits={0}
                        />
                    )}
                </a>
            </div>
        )
    }

    if (!requester) {
        return <RequesterForm onSubmit={(values) => setRequester(values)} />
    }

    if (!tickets) {
        return (
            <TicketsForm
                types={props.types}
                requester={requester}
                onSubmit={(values) => setTickets(values)}
            />
        )
    }

    return (
        <PaymentForm
            payments={props.payments}
            onSubmit={async (payment) => {
                console.log({
                    requester,
                    tickets,
                    payment,
                })
                try {
                    const order = await createOrder(props.eventId, {
                        requester,
                        tickets,
                        payment,
                    })

                    setOrder(order)

                    const params = {
                        event_id: props.eventId,
                        order_id: order.id,
                        currency: order.currency,
                        order_price: order.price,
                    }

                    ym(53951545, 'reachGoal', 'event_order_success', params)

                    _tmr.push({
                        type: 'reachGoal',
                        goal: 'event_order_success',
                        value: order.price,
                        params,
                    })
                } catch (e) {
                    console.log(e)
                    Sentry.captureException(e)
                    toast.error('Упс, ошибка :-(', {
                        description: 'Что-то пошло не так, попробуйте еще раз',
                        dismissible: true,
                        duration: 60000,
                    })
                }
            }}
        />
    )
}
